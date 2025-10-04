import { appDataSource } from "../config/database";
import { Renseignement } from "../entities/renseignement";
import { User } from "../entities/user";
import { AppErrors } from "../helpers/appErrors";
import { PageOptionsDto } from "../DTOs/paging/pageOptionsDto";
import { PageMetaDto } from "../DTOs/paging/pageMetaDto";
import { PageDto } from "../DTOs/paging/pageDto";
import { FilterQuery } from "../filters/types";
import "../filters/extensions";

const renseignementRepository = appDataSource.getRepository(Renseignement);
const userRepository = appDataSource.getRepository(User);

export class RenseignementService {
    public static getRenseignements = async (
        pageOptionsDto: PageOptionsDto,
        filters: FilterQuery
    ): Promise<PageDto<Partial<Renseignement>>> => {
        const query = appDataSource
            .createQueryBuilder()
            .select(["renseignement"])
            .from(Renseignement, "renseignement")
            .leftJoinAndSelect("renseignement.user", "user")
            .addPaging(pageOptionsDto, "renseignement")
            .addFilters(filters);

        const [itemCount, entities] = await Promise.all([query.getCount(), query.execute()]);
        return new PageDto(entities, new PageMetaDto({ itemCount, pageOptionsDto }));
    };

    public static createRenseignement = async (renseignementData: any): Promise<Renseignement> => {
        const user = await userRepository.findOne({ where: { id: renseignementData.userId, isDeleted: false } });
        if (!user) {
            throw new AppErrors.NotFound(`Unable to find corresponding user with id: ${renseignementData.userId}`);
        }

        const newRenseignement = new Renseignement();
        Object.assign(newRenseignement, renseignementData);
        newRenseignement.user = user;
        newRenseignement.date_enreg = new Date();

        return await renseignementRepository.save(newRenseignement);
    };

    public static updateRenseignement = async (id: string, updateData: any): Promise<void> => {
        const renseignement = await renseignementRepository.findOne({ where: { id } });
        if (!renseignement) {
            throw new AppErrors.NotFound();
        }
        await renseignementRepository.update(id, updateData);
    };

    public static getRenseignementById = async (id: string): Promise<Renseignement> => {
        const renseignement = await renseignementRepository.findOne({
            where: { id },
            relations: ["user"],
        });
        if (!renseignement) {
            throw new AppErrors.NotFound();
        }
        return renseignement;
    };
}
