import { appDataSource } from "../config/database";
import { User } from "../entities/user";
import { AppErrors } from "../helpers/appErrors";
import { Card } from "../entities/card";

const userRepository = appDataSource.getRepository(User);
const cardRepository = appDataSource.getRepository(Card);

export class CardService {
    public static createUserCard = async (cardCreationDto: any): Promise<Card> => {
        const user = await userRepository.findOne({ where: { id: cardCreationDto.userId, isDeleted: false } });
        if (!user) {
            throw new AppErrors.NotFound(`Unable to find user with id: ${cardCreationDto.userId}`);
        }
        const oldCards = await cardRepository.count({ where: { user: { id: user.id } } });
        if (oldCards > 0) {
            await cardRepository.update({ user: user }, { isDeleted: true });
        }
        const nextYear = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
        const card = cardRepository.create({
            ...cardCreationDto,
            user: user,
            countId: oldCards + 1,
            expiration: nextYear,
        });
        await cardRepository.insert(card);
        return card[0];
    };

    public static getUserLastCard = async (userId: string): Promise<Card | null> => {
        return await cardRepository.findOne({
            where: { user: { id: userId }, isDeleted: false },
            order: { countId: "DESC" },
        });
    };
}
