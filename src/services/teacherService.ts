import { PageDto } from "../DTOs/paging/PageDto";
import { PageMetaDto } from "../DTOs/paging/PageMetaDto";
import { PageOptionsDto } from "../DTOs/paging/PageOptionsDto";
import { appDataSource } from "../config/Database";
import { Teacher } from "../entities/Teacher";
import { User } from "../entities/User";
import { AppErrors } from "../helpers/appErrors";
import { transformQueryOutput } from "../helpers/helpers";
import { DeepPartial } from "typeorm";

const userRepository = appDataSource.getRepository(User);
const teacherRepository = appDataSource.getRepository(Teacher);

export class TeacherService {
    public static createTeacher = async (teacherData: any): Promise<Teacher> => {
        const userId = teacherData.userId;
        const user = await userRepository.findOne({ where: { id: userId } });
        if (user) {
            const code = await TeacherService.generateTeacherCode(teacherData.codeType);
            console.log({ ...teacherData, user: user, code: code });
            const teacher: Teacher = teacherRepository.create({
                ...teacherData,
                user: user,
                code: code,
            } as DeepPartial<Teacher>);
            await teacherRepository.save(teacher);
            return teacher;
        } else {
            throw new AppErrors.NotFound(`Unable to find corresponding user with id: ${userId}`);
        }
    };

    private static generateTeacherCode = async (codeType: string) => {
        const queryResult = await appDataSource
            .createQueryBuilder()
            .select("MAX(`code`)", "code")
            .from(Teacher, "teacher")
            .where('code LIKE "":codeType"%" ', { codeType: codeType })
            .execute();
        const perviouscode = queryResult?.[0]?.code;
        return TeacherService.computeNextCode(codeType, perviouscode);
    };

    private static computeNextCode = (codeType: string, previousCode: string | undefined): string => {
        if (previousCode) {
            var nextCode = 0;
            const code = parseInt(previousCode.substring(1));
            nextCode = code + 1;
            return `${codeType.at(0)}${nextCode.toString().padStart(2, "0")}`;
        } else {
            return `${codeType.at(0)}00`;
        }
    };

    public static getTeachers = async (pageOptionsDto: PageOptionsDto): Promise<PageDto<Partial<Teacher>>> => {
        const query = appDataSource
            .createQueryBuilder()
            .select(["teacher"])
            .from(Teacher, "teacher")
            .where({ isDeleted: false })
            .leftJoinAndSelect("teacher.user", "user")
            .addPaging(pageOptionsDto, "teacher");

        const [itemCount, entities] = await Promise.all([query.getCount(), query.execute()]);
        const [teachers, users] = await transformQueryOutput(entities, ["teacher_", "user_"]);
        for (let i = 0; i < teachers.length; i++) {
            teachers[i].user = users[i];
        }
        return new PageDto(teachers, new PageMetaDto({ itemCount, pageOptionsDto }));
    };

    public static getTeacherById = async (id: string): Promise<Teacher> => {
        const teacher = await teacherRepository.findOne({
            where: { id: id, isDeleted: false },
            relations: ["user"],
        });
        if (!teacher) {
            throw new AppErrors.NotFound();
        }
        return teacher;
    };

    public static updateTeacherById = async (updateData: any) => {
        const teacher = await teacherRepository.findOne({
            where: { id: updateData.id, isDeleted: false },
        });
        if (!teacher) {
            throw new AppErrors.NotFound(`Unable to find teacher with id: ${updateData.id}`);
        }
        // Update teacher fields
        await teacherRepository.update(teacher.id, updateData);
    };

    public static deleteTeacherById = async (id: string) => {
        const teacher = await teacherRepository.findOne({ where: { id: id } });
        if (!teacher) {
            throw new AppErrors.NotFound();
        }
        if (teacher.isDeleted) {
            throw new AppErrors.AlreadyDeleted();
        }
        await teacherRepository.update(id, { isDeleted: true });
    };

    public static getTeacherByCode = async (code: string): Promise<Teacher> => {
        const teacher = await teacherRepository.findOne({
            where: { code: code, isDeleted: false },
            relations: ["user"],
        });
        if (!teacher) {
            throw new AppErrors.NotFound();
        }
        return teacher;
    };
}
