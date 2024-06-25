import { appDataSource } from "../config/database";
import { AppErrors } from "../helpers/appErrors";
import { PageOptionsDto } from "../DTOs/paging/pageOptionsDto";
import { PageMetaDto } from "../DTOs/paging/pageMetaDto";
import { PageDto } from "../DTOs/paging/pageDto";
import { FilterQuery } from "../filters/types";
import "../filters/extensions";
import { Competition } from "../entities/competition";
import { getOrThrow } from "../helpers/queryHelpers";

const competitionRepository = appDataSource.getRepository(Competition);

export class CompetitionService {
    public static getCompetitions = async (
        pageOptionsDto: PageOptionsDto,
        filters: FilterQuery
    ): Promise<PageDto<Partial<Competition>>> => {
        const query = appDataSource
            .createQueryBuilder()
            .select("*")
            .from(Competition, "competition")
            .where({ isDeleted: false })
            .addPaging(pageOptionsDto, "competition")
            .addFilters(filters);
        const [itemCount, competitions] = await Promise.all([query.getCount(), query.execute()]);
        return new PageDto(competitions, new PageMetaDto({ itemCount, pageOptionsDto }));
    };

    public static createCompetition = async (competitionData: any): Promise<Competition> => {
        return await competitionRepository.save(competitionData);
    };

    public static updateCompetitionById = async (updateData: any) => {
        const competition = await CompetitionService.getCompetitionOrThrow(updateData.id);
        await competitionRepository.update(competition.id, updateData);
    };

    public static getCompetitionById = async (id: string): Promise<Competition> => {
        const competition = await competitionRepository.findOne({
            where: { id: id, isDeleted: false },
        });
        if (!competition) {
            throw new AppErrors.NotFound();
        }
        return competition;
    };

    public static deleteCompetitionById = async (id: string) => {
        const competition = await this.getCompetitionOrThrow(id, true);
        if (competition.isDeleted) {
            throw new AppErrors.AlreadyDeleted();
        }
        // FIXME: Should we delete competitionRegistrations ?
        await competitionRepository.update(id, { isDeleted: true });
    };

    // helpers
    public static getCompetitionOrThrow = async (id: string, bringDeleted: boolean = false) =>
        getOrThrow<Competition>(id, competitionRepository, "competition", bringDeleted);
}
