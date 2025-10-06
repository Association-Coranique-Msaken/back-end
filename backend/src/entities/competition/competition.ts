import { Entity, Column, OneToOne, JoinColumn } from "typeorm";
import { AbstractEntity } from "../abstractEntity";
import { DtoField } from "../../DTOs/dtoEngine";
import { Validators } from "../../DTOs/validators";
import { Filterable } from "../../filters/annotations";
import { QueryItemType, QueryRelation } from "../../filters/types";
import { Dto } from "../../DTOs/dto";

export type CompetitionScope = "Local" | "Regional" | "National";
const CompetitionScopeValues: CompetitionScope[] = ["Local", "Regional", "National"];

@Entity({ name: "competition" })
export class Competition extends AbstractEntity {
    @Filterable({
        names: ["competitionRegistration", "competition"],
        relation: QueryRelation.EQ,
        type: QueryItemType.STRING,
    })
    @DtoField({ dto: [Dto.createCompetition], validator: Validators.REQ_TEXT })
    @DtoField({ dto: [Dto.updateCompetition], validator: Validators.TEXT })
    @Column()
    edition: string;

    @Filterable({ relation: QueryRelation.EQ })
    @Filterable({
        names: ["competitionRegistration", "competition"],
        relation: QueryRelation.EQ,
        type: QueryItemType.STRING,
    })
    @DtoField({ dto: [Dto.createCompetition], validator: Validators.REQ_ONE_OF(...CompetitionScopeValues) })
    @DtoField({ dto: [Dto.updateCompetition], validator: Validators.ONE_OF(...CompetitionScopeValues) })
    @Column({ type: "enum", enum: CompetitionScopeValues })
    scope: CompetitionScope;

    @Filterable({ relation: QueryRelation.EQ, type: QueryItemType.BOOL })
    @DtoField({ dto: [Dto.updateCompetition, Dto.createCompetition], validator: Validators.BOOL })
    @Column({ default: true })
    isActive: boolean;
}
