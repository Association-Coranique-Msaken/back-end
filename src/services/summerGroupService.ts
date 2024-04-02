import { DeepPartial } from "typeorm";
import { CreateSummerGroupDto, UpdateSummerGroupDto } from "../DTOs/SummerGroupDto";
import { PageDto } from "../DTOs/paging/PageDto";
import { PageMetaDto } from "../DTOs/paging/PageMetaDto";
import { PageOptionsDto } from "../DTOs/paging/PageOptionsDto";
import { appDataSource } from "../config/Database";
import { SummerGroup } from "../entities/SummerGroup";
import { Teacher } from "../entities/Teacher";
import { User } from "../entities/User";
import { AppErrors } from "../helpers/appErrors";

const userRepository = appDataSource.getRepository(User);
const teacherRepository = appDataSource.getRepository(Teacher);
const groupRepository = appDataSource.getRepository(SummerGroup);

export class SummerGroupService {
    public static createGroup = async (groupData: CreateSummerGroupDto): Promise<SummerGroup> => {
        const teacherId: string = groupData.teacherId;
        const teacher = await teacherRepository.findOne({ where: { id: teacherId } });
        if (teacher) {
            const grp = groupRepository.create(groupData as DeepPartial<SummerGroup>);
            groupRepository.save(grp);
            return grp;
        } else {
            throw new AppErrors.NotFound(
                `Unable to find corresponding teacher with identifier: ${groupData.teacherId}`
            );
        }
    };

    public static getGroups = async (pageOptionsDto: PageOptionsDto): Promise<PageDto<SummerGroup>> => {
        const query = appDataSource
            .createQueryBuilder()
            .select()
            .from(SummerGroup, "summerGroup")
            .where({ isDeleted: false })
            .addPaging(pageOptionsDto, "summerGroup");
        const [itemCount, entities] = await Promise.all([query.getCount(), query.execute()]);
        return new PageDto(entities, new PageMetaDto({ itemCount, pageOptionsDto }));
    };

    public static getGroupById = async (id: string): Promise<SummerGroup> => {
        const group = await groupRepository.findOne({
            where: { id: id, isDeleted: false },
        });
        if (!group) {
            throw new AppErrors.NotFound();
        }
        return group;
    };

    public static updateGroupById = async (updateData: UpdateSummerGroupDto) => {
        const group = await groupRepository.findOne({
            where: { id: updateData.id, isDeleted: false },
        });
        if (!group) {
            throw new AppErrors.NotFound(`Unable to find group with id: ${updateData.id}`);
        }
        // Update teacher fields
        await teacherRepository.update(group.id, updateData);
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
    ): Promise<PageDto<SummerGroup>> => {
        const query = appDataSource
            .createQueryBuilder()
            .select()
            .from(SummerGroup, "summerGroup")
            .where({ isDeleted: false, teacher: teacherId })
            .addPaging(pageOptionsDto, "summerGroup");
        const [itemCount, entities] = await Promise.all([query.getCount(), query.execute()]);
        return new PageDto(entities, new PageMetaDto({ itemCount, pageOptionsDto }));
    };
}
