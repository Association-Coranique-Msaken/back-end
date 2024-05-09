import { PageDto } from "../DTOs/paging/pageDto";
import { PageMetaDto } from "../DTOs/paging/pageMetaDto";
import { PageOptionsDto } from "../DTOs/paging/pageOptionsDto";
import { appDataSource } from "../config/database";
import { Group } from "../entities/group";
import { GroupUser } from "../entities/groupUser";
import { Teacher } from "../entities/teacher";
import { User } from "../entities/user";
import { AppErrors } from "../helpers/appErrors";
import { DeepPartial, SelectQueryBuilder } from "typeorm";
import { FilterQuery } from "../filters/types";
import { transformQueryOutput } from "../helpers/queryHelpers";

const userRepository = appDataSource.getRepository(User);
const teacherRepository = appDataSource.getRepository(Teacher);
const groupRepository = appDataSource.getRepository(Group);
const groupUserRepository = appDataSource.getRepository(GroupUser);

export class GroupService {
    private static fetchTeacherWithId = async (teacherId: string): Promise<Teacher> => {
        const teacher = await teacherRepository.findOne({ where: { id: teacherId } });
        if (teacher) {
            return teacher;
        } else {
            throw new AppErrors.NotFound(`Unable to find corresponding teacher with identifier: ${teacherId}`);
        }
    };

    public static createGroup = async (groupData: any): Promise<Group> => {
        const teacherId: string = groupData.teacherId;
        const teacher = await GroupService.fetchTeacherWithId(teacherId);
        return groupRepository.create({ ...groupData, teacher } as DeepPartial<Group>);
    };

    private static buildGroupQuery = (): SelectQueryBuilder<Group> => {
        return appDataSource
            .createQueryBuilder()
            .select("`group`.*")
            .addSelect("COUNT(groupUser.id)", "numStudents")
            .addSelect("SUM(groupUser.isActive)", "activeStudents")
            .from(Group, "group")
            .leftJoin("group.users", "groupUser")
            .where("group.isDeleted = :isDeleted", { isDeleted: false })
            .where("groupUser.isDeleted = :isDeleted", { isDeleted: false })
            .groupBy("group.id");
    };

    public static getGroups = async (pageOptionsDto: PageOptionsDto, filters: FilterQuery): Promise<PageDto<Group>> => {
        const query = GroupService.buildGroupQuery().addPaging(pageOptionsDto, "group").addFilters(filters);
        const [itemCount, entities] = await Promise.all([query.getCount(), query.execute()]);
        return new PageDto(entities, new PageMetaDto({ itemCount, pageOptionsDto }));
    };

    public static getGroupById = async (id: string): Promise<Group> => {
        const query = GroupService.buildGroupQuery().where("group.id = :id", { id });
        const [itemCount, group] = await Promise.all([query.getCount(), query.execute()]);
        if (!group) {
            throw new AppErrors.NotFound();
        }
        return group;
    };

    public static updateGroupById = async (updateData: any) => {
        const group = await groupRepository.findOne({
            where: { id: updateData.id, isDeleted: false },
        });
        if (!group) {
            throw new AppErrors.NotFound(`Unable to find group with id: ${updateData.id}`);
        }
        let teacher: Teacher | undefined = undefined;
        if (updateData.teacherId !== undefined) {
            teacher = await GroupService.fetchTeacherWithId(updateData.teacherId);
        }
        await groupRepository.update(group.id, { ...updateData, teacher, teacherId: undefined } as DeepPartial<Group>);
    };

    public static deleteGroupById = async (id: string) => {
        const group = await groupRepository.findOne({ where: { id: id } });
        if (!group) {
            throw new AppErrors.NotFound();
        }
        if (group.isDeleted) {
            throw new AppErrors.AlreadyDeleted();
        }
        await groupRepository.update(id, { isDeleted: true });
    };

    public static getTeacherGroups = async (
        teacherId: string,
        pageOptionsDto: PageOptionsDto
    ): Promise<PageDto<Group>> => {
        const query = GroupService.buildGroupQuery().where({ teacher: teacherId }).addPaging(pageOptionsDto, "group");
        const [itemCount, entities] = await Promise.all([query.getCount(), query.execute()]);
        return new PageDto(entities, new PageMetaDto({ itemCount, pageOptionsDto }));
    };

    public static getGroupUsers = async (
        groupId: string,
        pageOptionsDto: PageOptionsDto
    ): Promise<PageDto<Partial<User>>> => {
        const query = appDataSource
            .createQueryBuilder()
            .select("")
            .from(GroupUser, "groupUser")
            .where({ isDeleted: false, group: groupId })
            .leftJoinAndSelect("groupUser.user", "user")
            .addPaging(pageOptionsDto, "groupUser");

        const [itemCount, entities] = await Promise.all([query.getCount(), query.execute()]);
        const [users] = await transformQueryOutput(entities, ["user_"]);
        return new PageDto(users, new PageMetaDto({ itemCount, pageOptionsDto }));
    };

    public static enrollUserToGroup = async (userId: string, groupId: string) => {
        const group = await groupRepository.findOne({
            where: { id: groupId, isDeleted: false },
        });
        if (!group) {
            throw new AppErrors.NotFound(`Unable to find group with id: ${groupId}`);
        }

        const user = await userRepository.findOne({
            where: { id: userId, isDeleted: false },
        });

        if (!user) {
            throw new AppErrors.NotFound(`Unable to find user with id: ${groupId}`);
        }

        const groupUser = await GroupService.findUserGroup(userId, groupId);

        if (groupUser) {
            throw new AppErrors.AlreadyExists(`User already enrolled to group.`);
        }

        const newGroupUser = new GroupUser();
        newGroupUser.user = user;
        newGroupUser.group = group;
        await groupUserRepository.insert(newGroupUser);
    };

    private static findUserGroup = async (userId: string, groupId: string): Promise<GroupUser | null> => {
        const query = appDataSource
            .createQueryBuilder()
            .select()
            .from(GroupUser, "groupUser")
            .where("userId = :userId", { userId: userId })
            .where("groupId = :groupId", { groupId: groupId })
            .where("isDeleted = :isDeleted", { isDeleted: false })
            .limit(1);
        const [itemCount, entities] = await Promise.all([query.getCount(), query.execute()]);
        if (itemCount == 0) {
            return null;
        }
        return entities[0] as GroupUser;
    };
}
