import { DeepPartial } from "typeorm";
import { UpdateUserDto } from "../DTOs/UserDto";
import { appDataSource } from "../config/Database";
import { User } from "../entities/User";
import { AppErrors } from "../helpers/appErrors";

const userRepository = appDataSource.getRepository(User);

export class UserService {}
