import { PageDto } from "../DTOs/paging/pageDto";
import { PageMetaDto } from "../DTOs/paging/pageMetaDto";
import { PageOptionsDto } from "../DTOs/paging/pageOptionsDto";
import { appDataSource } from "../config/database";
import { Teacher } from "../entities/teacher";
import { User } from "../entities/user";
import { AppErrors } from "../helpers/appErrors";
import { DeepPartial } from "typeorm";
import { getOrThrow, transformQueryOutput } from "../helpers/queryHelpers";
import { FilterQuery } from "../filters/types";
import { generatePassword } from "../helpers/helpers";
import { encrypt } from "../helpers/encrypt";
import { AccessTokenRepo, RefreshTokenRepo } from "../helpers/tokens/tokensRepository";

const userRepository = appDataSource.getRepository(User);
const teacherRepository = appDataSource.getRepository(Teacher);

const TEACHER_PASSWORD_LENGTH = 6;

export class TeacherService {
    public static createTeacher = async (teacherData: any): Promise<Teacher> => {
        const userId = teacherData.userId;
        const user = await userRepository.findOne({ where: { id: userId, isDeleted: false } });
        if (user) {
            const code = await TeacherService.generateTeacherCode(teacherData.codeType);
            const password = generatePassword(TEACHER_PASSWORD_LENGTH);
            const teacher: Teacher = teacherRepository.create({
                ...teacherData,
                user: user,
                code: code,
                password: await encrypt.encryptPass(password),
            } as DeepPartial<Teacher>);
            await teacherRepository.save(teacher);
            return { ...teacher, password: password };
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
        const perviousCode = queryResult?.[0]?.code;
        return TeacherService.computeNextCode(codeType, perviousCode);
    };

    private static computeNextCode = (codeType: string, previousCode: string | undefined): string => {
        if (previousCode) {
            let nextCode = 0;
            const code = parseInt(previousCode.substring(1));
            nextCode = code + 1;
            return `${codeType.at(0)}${nextCode.toString().padStart(2, "0")}`;
        } else {
            return `${codeType.at(0)}00`;
        }
    };

    public static getTeachers = async (
        pageOptionsDto: PageOptionsDto,
        filters: FilterQuery
    ): Promise<PageDto<Partial<Teacher>>> => {
        const query = appDataSource
            .createQueryBuilder()
            .select(["teacher"])
            .from(Teacher, "teacher")
            .where({ isDeleted: false })
            .leftJoinAndSelect("teacher.user", "user")
            .addPaging(pageOptionsDto, "teacher")
            .addFilters(filters);

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
        Promise.all([
            TeacherService.invalidateAccessTokenIfNeeded(updateData, teacher),
            teacherRepository.update(teacher.id, updateData),
        ]);
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

    public static regenerateTeacherPassword = async (teacherId: string) => {
        const teacher = await teacherRepository.findOne({
            where: { id: teacherId, isDeleted: false },
        });
        if (!teacher) {
            throw new AppErrors.NotFound();
        }
        const newPassword = generatePassword(TEACHER_PASSWORD_LENGTH);
        const hashedPassword = await encrypt.encryptPass(newPassword);
        await teacherRepository.update(teacherId, { password: hashedPassword });
        // FIXME: this should not be blocking call for the response to return.
        Promise.all([AccessTokenRepo.blacklistAll(teacherId), RefreshTokenRepo.blacklistAll(teacherId)]);
        const newTeacher: Teacher = teacherRepository.create({
            ...teacher,
            password: newPassword,
        } as DeepPartial<Teacher>);
        return newTeacher;
    };

    private static invalidateAccessTokenIfNeeded = async (updateData: any, currentData: Teacher): Promise<void> => {
        if (TeacherService.shouldInvalidateAccessToken(updateData, currentData)) {
            return await AccessTokenRepo.blacklistAll(currentData.id);
        }
    };

    private static shouldInvalidateAccessToken = (updateData: any, currentData: Teacher): boolean => {
        if (updateData.isActive != undefined) {
            return updateData.isActive != currentData.isActive;
        }
        return true;
    };

    public static getTeacherOrThrow = async (id: string, bringDeleted: boolean = false) =>
        getOrThrow<Teacher>(id, teacherRepository, "teacher", bringDeleted);
}
