import { Entity, Column, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { AbstractEntity } from "./abstractEntity";
import { User } from "./user";
import { DtoField } from "../DTOs/dtoEngine";
import { Validators } from "../DTOs/validators";
import { Competition } from "./competition";
import { Teacher } from "./teacher";

@Entity({ name: "competitionRegistration" })
export class CompetitionRegistration extends AbstractEntity {
    @DtoField({
        dto: ["CreateCompetitionRegistrationDto"],
        validator: Validators.REQ_GUID,
        attributeName: "competitionId",
    })
    @ManyToOne(() => Competition)
    @JoinColumn()
    competition: Competition;

    @DtoField({ dto: ["CreateCompetitionRegistrationDto"], validator: Validators.REQ_GUID, attributeName: "userId" })
    @ManyToOne(() => User)
    @JoinColumn()
    user: User;

    @DtoField({ dto: ["CreateCompetitionRegistrationDto"], validator: Validators.REQ_GUID, attributeName: "teacherId" })
    @DtoField({ dto: ["UpdateCompetitionRegistrationDto"], validator: Validators.GUID, attributeName: "teacherId" })
    @ManyToOne(() => Teacher)
    @JoinColumn()
    teacher: Teacher;

    @DtoField({ dto: ["CreateCompetitionRegistrationDto"], validator: Validators.REQ_NUM_HIZB })
    @DtoField({ dto: ["UpdateCompetitionRegistrationDto"], validator: Validators.NUM_HIZB })
    @Column({ nullable: false })
    numHizb: number;
}
