import { DeepPartial } from "typeorm";
import { appDataSource } from "../config/Database";
import { User } from "../entities/User";
import { AppErrors } from "../helpers/appErrors";
import { PageOptionsDto } from "../DTOs/paging/PageOptionsDto";
import { PageDto } from "../DTOs/paging/PageDto";
import { PageMetaDto } from "../DTOs/paging/PageMetaDto";

const userRepository = appDataSource.getRepository(User);

export class UserService {
    public static createUser = async (user: any): Promise<User> => {
        // TODO: Add lock here to prevent race condition in case of parallel requests.
        const identifier = await UserService.getNewUserIdentifier();
        const data: DeepPartial<User> = { ...user, identifier };
        const newUser = await userRepository.create(data);
        await userRepository.save(newUser);
        return newUser;
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

    public static getUsers = async (pageOptionsDto: PageOptionsDto): Promise<PageDto<User>> => {
        const query = appDataSource
            .createQueryBuilder()
            .select()
            .from(User, "user")
            .where({ isDeleted: false })
            .addPaging(pageOptionsDto, "user");
        const [itemCount, entities] = await Promise.all([query.getCount(), query.execute()]);
        return new PageDto(entities, new PageMetaDto({ itemCount, pageOptionsDto }));
    };

    public static getUserById = async (id: string): Promise<User> => {
        const user = await userRepository.findOne({ where: { id: id, isDeleted: false } });
        if (!user) {
            throw new AppErrors.NotFound();
        }
        return user;
    };

    public static updateUserById = async (updateData: any) => {
        const user = await userRepository.findOne({ where: { id: updateData.id, isDeleted: false } });
        if (!user) {
            throw new AppErrors.NotFound();
        }
        await userRepository.update(updateData.id, updateData);
    };

    public static deleteUser = async (id: string) => {
        const user = await userRepository.findOne({ where: { id: id } });
        if (!user) {
            return new AppErrors.NotFound();
        }
        if (user.isDeleted) {
            return new AppErrors.AlreadyDeleted();
        }
        await userRepository.update(id, { isDeleted: true });
    };
}
