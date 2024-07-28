import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../abstractEntity";
import { DtoField } from "../../DTOs/dtoEngine";
import { Validators } from "../../DTOs/validators";
import { CompetitionRegistration } from "./competitionRegistration";
import { Exam } from "./exam";
import { Dto } from "../../DTOs/dto";

@Entity({ name: "userExam" })
export class UserExam extends AbstractEntity {
    @DtoField({ dto: [Dto.createUserExam], validator: Validators.REQ_GUID, attributeName: "registrationId" })
    @Column()
    registration: CompetitionRegistration;

    @DtoField({ dto: [Dto.createUserExam], validator: Validators.REQ_NUM })
    @Column()
    lajna: number;

    @DtoField({ dto: [Dto.createUserExam], validator: Validators.REQ_NUM })
    @Column()
    order: number;

    @Column()
    exam: Exam;
}
