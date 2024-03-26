import { CreateTeacherDto, UpdateTeacherDto } from "../DTOs/TeacherDto";
import { appDataSource } from "../config/Database";
import { Teacher } from "../entities/Teacher";
import { User } from "../entities/User";
import { AppErrors } from "../helpers/appErrors";

const userRepository = appDataSource.getRepository(User);
const teacherRepository = appDataSource.getRepository(Teacher);

export class TeacherService {}
