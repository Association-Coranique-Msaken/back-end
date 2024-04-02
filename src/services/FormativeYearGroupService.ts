import { CreateSummerGroupDto, UpdateSummerGroupDto } from "../DTOs/SummerGroupDto";
import { PageDto } from "../DTOs/paging/PageDto";
import { PageMetaDto } from "../DTOs/paging/PageMetaDto";
import { PageOptionsDto } from "../DTOs/paging/PageOptionsDto";
import { appDataSource } from "../config/Database";
import { Teacher } from "../entities/Teacher";
import { User } from "../entities/User";
import { AppErrors } from "../helpers/appErrors";
import { FormativeYearGroup } from "../entities/FormativeYearGroup";
import { DeepPartial } from "typeorm";

const userRepository = appDataSource.getRepository(User);
const teacherRepository = appDataSource.getRepository(Teacher);
const groupRepository = appDataSource.getRepository(FormativeYearGroup);

export class FormativeYearGroupService {
    public static createGroup = async (groupData: CreateSummerGroupDto): Promise<FormativeYearGroup> => {
        const teacherId: string = groupData.teacherId;
        const teacher = await teacherRepository.findOne({ where: { id: teacherId } });
        if (teacher) {
            const grp = groupRepository.create(groupData as DeepPartial<FormativeYearGroup>);
            groupRepository.save(grp);
            return grp;
        } else {
            throw new AppErrors.NotFound(
                `Unable to find corresponding teacher with identifier: ${groupData.teacherId}`
            );
        }
    };

    public static getGroups = async (pageOptionsDto: PageOptionsDto): Promise<PageDto<FormativeYearGroup>> => {
        const query = appDataSource
            .createQueryBuilder()
            .select()
            .from(FormativeYearGroup, "formativeYearGroup")
            .where({ isDeleted: false })
            .addPaging(pageOptionsDto, "formativeYearGroup");
        const [itemCount, entities] = await Promise.all([query.getCount(), query.execute()]);
        return new PageDto(entities, new PageMetaDto({ itemCount, pageOptionsDto }));
    };

    public static getGroupById = async (id: string): Promise<FormativeYearGroup> => {
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
    ): Promise<PageDto<FormativeYearGroup>> => {
        const query = appDataSource
            .createQueryBuilder()
            .select()
            .from(FormativeYearGroup, "formativeYearGroup")
            .where({ isDeleted: false, teacher: teacherId })
            .addPaging(pageOptionsDto, "formativeYearGroup");
        const [itemCount, entities] = await Promise.all([query.getCount(), query.execute()]);
        return new PageDto(entities, new PageMetaDto({ itemCount, pageOptionsDto }));
    };
}
