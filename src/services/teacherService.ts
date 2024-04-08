import { PageDto } from "../DTOs/paging/PageDto";
import { PageMetaDto } from "../DTOs/paging/PageMetaDto";
import { PageOptionsDto } from "../DTOs/paging/PageOptionsDto";
import { CreateTeacherDto, UpdateTeacherDto } from "../DTOs/TeacherDto";
import { appDataSource } from "../config/Database";
import { Teacher } from "../entities/Teacher";
import { User } from "../entities/User";
import { AppErrors } from "../helpers/appErrors";
import { transformQueryOutput } from "../helpers/helpers";
import { DeepPartial } from "typeorm";

const userRepository = appDataSource.getRepository(User);
const teacherRepository = appDataSource.getRepository(Teacher);

export class TeacherService {
    public static createTeacher = async (teacherData: CreateTeacherDto): Promise<Teacher> => {
        const userId = teacherData.identifier;
        const user = await userRepository.findOne({ where: { identifier: userId } });
        if (user) {
            console.log("successs");
            const teacher: Teacher = teacherRepository.create({ ...teacherData, user: user } as DeepPartial<Teacher>);
            teacherRepository.save(teacher);
            return teacher;
        } else {
            throw new AppErrors.NotFound(
                `Unable to find corresponding user with identifier: ${teacherData.identifier}`
            );
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

    public static updateTeacherById = async (updateData: UpdateTeacherDto) => {
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
