import { appDataSource } from "../config/database";
import { AppErrors } from "../helpers/appErrors";
import { PageOptionsDto } from "../DTOs/paging/pageOptionsDto";
import { PageMetaDto } from "../DTOs/paging/pageMetaDto";
import { PageDto } from "../DTOs/paging/pageDto";
import { FilterQuery } from "../filters/types";
import "../filters/extensions";
import { CompetitionRegistration } from "../entities/competitionRegistration";
import { UserService } from "./userService";
import { SelectQueryBuilder } from "typeorm";
import { getOrThrow, transformQueryOutput } from "../helpers/queryHelpers";
import { CompetitionService } from "./competitionService";
import { TeacherService } from "./teacherService";

const registrationRepository = appDataSource.getRepository(CompetitionRegistration);

export class CompetitionRegistrationService {
    public static getRegistrations = async (
        pageOptionsDto: PageOptionsDto,
        filters: FilterQuery
    ): Promise<PageDto<Partial<CompetitionRegistration>>> => {
        const query = CompetitionRegistrationService.buildRegistrationQuery()
            .addPaging(pageOptionsDto, "competitionRegistration")
            .addFilters(filters);

        const [itemCount, entities] = await Promise.all([query.getCount(), query.execute()]);
        const [regs, users, teachers, competitions] = await transformQueryOutput(entities, [
            "competitionRegistration_",
            "user_",
            "teacher_",
            "competition_",
        ]);
        for (let i = 0; i < regs.length; i++) {
            regs[i].user = users[i];
            regs[i].teacher = teachers[i];
            regs[i].competition = competitions[i];
        }
        return new PageDto(regs, new PageMetaDto({ itemCount, pageOptionsDto }));
    };

    private static buildRegistrationQuery = (): SelectQueryBuilder<Partial<CompetitionRegistration>> => {
        return appDataSource
            .createQueryBuilder()
            .select(["competitionRegistration"])
            .from(CompetitionRegistration, "competitionRegistration")
            .where({ isDeleted: false })
            .leftJoinAndSelect("competitionRegistration.user", "user")
            .leftJoinAndSelect("competitionRegistration.competition", "competition")
            .leftJoinAndSelect("competitionRegistration.teacher", "teacher");
    };

    public static createRegistration = async (data: any): Promise<CompetitionRegistration> => {
        await this.checkRegistrationExistsAndThrow(data.userId, data.competitionId);
        const userPromise = UserService.getUserOrThrow(data.userId);
        const competitionPromise = CompetitionService.getCompetitionOrThrow(data.competitionId);
        const teacherPromise = TeacherService.getTeacherOrThrow(data.teacherId);
        const [user, competition, teacher] = await Promise.all([userPromise, competitionPromise, teacherPromise]);
        return await registrationRepository.save({ user, competition, teacher, ...data });
    };

    public static updateRegistration = async (updateData: any) => {
        const reg = await this.getRegistrationOrThrow(updateData.id);
        const updateObject: Partial<CompetitionRegistration> = {
            numHizb: updateData.numHizb,
        };
        if (updateData.teacherId && reg.teacher.id != updateData.teacherId) {
            const teacher = await TeacherService.getTeacherOrThrow(updateData.teacherId);
            updateObject.teacher = teacher;
        }
        updateData.teacherId = undefined;
        await registrationRepository.update(reg.id, updateObject);
    };

    public static getRegistrationById = async (id: string): Promise<CompetitionRegistration> => {
        return await this.getRegistrationOrThrow(id);
    };

    public static deleteRegistrationById = async (id: string) => {
        const reg = await this.getRegistrationOrThrow(id, /*bringDeleted*/ true);
        if (reg.isDeleted) {
            throw new AppErrors.AlreadyDeleted();
        }
        await registrationRepository.update(id, { isDeleted: true });
    };

    private static checkRegistrationExistsAndThrow = async (userId: string, competitionId: string) => {
        if (
            await registrationRepository.exists({
                where: { user: { id: userId }, competition: { id: competitionId }, isDeleted: false },
            })
        ) {
            throw new AppErrors.AlreadyExists("User already registred in the competition.");
        }
    };

    public static getRegistrationOrThrow = async (id: string, bringDeleted: boolean = false) =>
        getOrThrow<CompetitionRegistration>(id, registrationRepository, "competition registration", bringDeleted, [
            "user",
            "teacher",
            "competition",
        ]);
}
