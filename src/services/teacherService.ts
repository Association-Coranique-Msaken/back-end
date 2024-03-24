import { TeacherDto } from "../DTOs/TeacherDto";
import { appDataSource } from "../config/Database";
import { Teacher } from "../entities/Teacher";
import { User } from "../entities/User";
import { AppErrors } from "../helpers/appErrors";

const userRepository = appDataSource.getRepository(User);
const teacherRepository = appDataSource.getRepository(Teacher);

export class TeacherService {
    public static createTeacher = async (teacherData: TeacherDto.CreateTeacherDto): Promise<Teacher> => {
        try {
            const userId = teacherData.identifier;
            const user = await userRepository.findOne({ where: { identifier: userId } });
            if (user) {
                return teacherRepository.create({ ...teacherData, user: user });
            } else {
                throw new AppErrors.NotFound(
                    `Unable to find corresponding user with identifier: ${teacherData.identifier}`
                );
            }
        } catch (error) {
            throw new AppErrors.InternalError(error);
        }
    };

    public static getTeachers = async () => {
        try {
            return await teacherRepository.find({ where: { isDeleted: false } });
        } catch (error) {
            throw new AppErrors.InternalError(error);
        }
    };

    public static getTeacherById = async (id: string): Promise<Teacher> => {
        try {
            const teacher = await teacherRepository.findOne({
                where: { id: id, isDeleted: false },
                relations: ["user"],
            });
            if (!teacher) {
                throw new AppErrors.NotFound();
            }
            return teacher;
        } catch (error) {
            throw new AppErrors.InternalError(error);
        }
    };

    public static updateTeacherById = async (updateData: TeacherDto.UpdateTeacherDto) => {
        try {
            const teacher = await teacherRepository.findOne({
                where: { code: updateData.code, isDeleted: false },
            });

            if (!teacher) {
                throw new AppErrors.NotFound();
            }

            // Update teacher fields
            await teacherRepository.update(teacher.id, updateData);
        } catch (error) {
            throw new AppErrors.InternalError(error);
        }
    };

    public static deleteTeacherById = async (id: string) => {
        try {
            const teacher = await teacherRepository.findOne({ where: { id: id } });

            if (!teacher) {
                throw new AppErrors.NotFound();
            }

            if (teacher.isDeleted) {
                throw new AppErrors.AlreadyDeleted();
            }
            await teacherRepository.update(id, { isDeleted: true });
        } catch (error) {
            throw new AppErrors.InternalError();
        }
    };

    public static getTeacherByCode = async (code: string): Promise<Teacher> => {
        try {
            const teacher = await teacherRepository.findOne({ where: { code: code, isDeleted: false } });

            if (!teacher) {
                throw new AppErrors.NotFound();
            }
            return teacher;
        } catch (error) {
            throw new AppErrors.InternalError();
        }
    };
}
