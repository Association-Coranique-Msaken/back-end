import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../abstractEntity";
import { DtoField } from "../../DTOs/dtoEngine";
import { Validators } from "../../DTOs/validators";
import { CompetitionRegistration } from "./competitionRegistration";
import { Dto } from "../../DTOs/dto";

@Entity({ name: "userResult" })
export class UserResult extends AbstractEntity {
    @DtoField({ dto: [Dto.createUserResult], validator: Validators.REQ_GUID, attributeName: "registrationId" })
    @Column()
    registration: CompetitionRegistration;

    @DtoField({ dto: [Dto.createUserResult], validator: Validators.REQ_NUM })
    @Column()
    rank: number;

    @DtoField({ dto: [Dto.createUserResult], validator: Validators.REQ_DECIMAL_RANGE(0, 20) })
    @Column()
    score: number;

    @DtoField({ dto: [Dto.createUserResult], validator: Validators.NUM })
    @Column({ default: null })
    reward: number;

    @DtoField({ dto: [Dto.createUserResult], validator: Validators.TEXT })
    @Column({ default: null })
    certificate: string;
}
