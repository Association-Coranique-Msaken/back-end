import { UserDto } from "../DTOs/UserDto";
import { appDataSource } from "../config/Database";
import { User } from "../entities/User";
import { AppErrors } from "../helpers/appErrors";

const userRepository = appDataSource.getRepository(User);

export class UserService {
    public static createUser = async (user: any): Promise<User> => {
        try {
            // TODO: Add lock here to prevent race condition in case of parallel requests.
            const identifier = await UserService.getNewUserIdentifier();
            const newUser = await userRepository.create({ ...user, identifier });
            await userRepository.save(newUser);
            return newUser[0];
        } catch (error) {
            console.error(error);
            throw new AppErrors.InternalError(error);
        }
    };

    public static getNewUserIdentifier = async () => {
        const queryResult = await appDataSource
            .createQueryBuilder()
            .select("MAX(`identifier`)", "id")
            .from(User, "user")
            .execute();
        const perviousIdentifier = queryResult?.[0]?.id;
        const currentYear = new Date().getFullYear();
        return UserService.computeNextIdentifier(currentYear, perviousIdentifier);
    };

    public static computeNextIdentifier = (currentYear: number, perviousIdentifier?: string): string => {
        if (perviousIdentifier) {
            const previousIdentifierYear = parseInt(perviousIdentifier.substring(0, 4));
            if (currentYear > previousIdentifierYear) {
                return `${currentYear}001`;
            } else {
                const previousIncrementalOrder = parseInt(perviousIdentifier.substring(4, 8)) ?? 1;
                const nextIncrementalOrder = previousIncrementalOrder + 1;
                if (nextIncrementalOrder >= 1000) {
                    return `${previousIdentifierYear + 1}000`;
                } else {
                    return `${previousIdentifierYear}${nextIncrementalOrder.toString().padStart(3, "0")}`;
                }
            }
        } else {
            return `${currentYear}001`;
        }
    };

    public static getUsers = async (): Promise<User[]> => {
        try {
            const users = await userRepository.find({ where: { isDeleted: false } });
            return users;
        } catch (error) {
            throw new AppErrors.InternalError();
        }
    };

    public static getUserById = async (id: string): Promise<User> => {
        try {
            const user = await userRepository.findOne({ where: { id: id, isDeleted: false } });
            if (!user) {
                throw new AppErrors.NotFound();
            }
            return user;
        } catch (error) {
            throw new AppErrors.InternalError();
        }
    };

    public static updateUser = async (updateData: UserDto.UpdateUserDto) => {
        try {
            const user = await userRepository.findOne({ where: { id: updateData.id, isDeleted: false } });

            if (!user) {
                throw new AppErrors.NotFound();
            }
            await userRepository.update(updateData.id, updateData);
        } catch (error) {
            throw new AppErrors.InternalError();
        }
    };

    public static deleteUser = async (id: string) => {
        try {
            const user = await userRepository.findOne({ where: { id: id } });

            if (!user) {
                return new AppErrors.NotFound();
            }
            if (user.isDeleted) {
                return new AppErrors.AlreadyDeleted();
            }
            await userRepository.update(id, { isDeleted: true });
        } catch (error) {
            throw new AppErrors.InternalError();
        }
    };
}
