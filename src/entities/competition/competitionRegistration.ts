import { Entity, Column, JoinColumn, ManyToOne } from "typeorm";
import { AbstractEntity } from "../abstractEntity";
import { User } from "../user";
import { DtoField } from "../../DTOs/dtoEngine";
import { Validators } from "../../DTOs/validators";
import { ExamBound } from "./examBound";
import { Competition } from "./competition";
import { Teacher } from "../teacher";
import { Dto } from "../../DTOs/dto";

@Entity({ name: "competitionRegistration" })
export class CompetitionRegistration extends AbstractEntity {
    @DtoField({
        dto: [Dto.createCompetitionRegistration],
        validator: Validators.REQ_GUID,
        attributeName: "competitionId",
    })
    @ManyToOne(() => Competition)
    @JoinColumn()
    competition: Competition;

    @DtoField({ dto: [Dto.createCompetitionRegistration], validator: Validators.REQ_GUID, attributeName: "userId" })
    @ManyToOne(() => User)
    @JoinColumn()
    user: User;

    @DtoField({ dto: [Dto.createCompetitionRegistration], validator: Validators.REQ_GUID, attributeName: "teacherId" })
    @DtoField({ dto: [Dto.updateCompetitionRegistration], validator: Validators.GUID, attributeName: "teacherId" })
    @ManyToOne(() => Teacher)
    @JoinColumn()
    teacher: Teacher;

    @DtoField({ dto: [Dto.createCompetitionRegistration], validator: Validators.REQ_NUM_HIZB })
    @DtoField({ dto: [Dto.updateCompetitionRegistration], validator: Validators.NUM_HIZB })
    @Column({ nullable: false })
    numHizb: number;

    @Column({ nullable: false })
    @DtoField({ dto: [Dto.createCompetitionRegistration], validator: Validators.REQ_NUM })
    @DtoField({ dto: [Dto.updateCompetitionRegistration], validator: Validators.NUM })
    registrationNumber: Number;

    @DtoField({ dto: [Dto.createCompetitionRegistration], validator: Validators.REQ_GUID })
    @DtoField({ dto: [Dto.updateCompetitionRegistration], validator: Validators.GUID })
    @Column({ nullable: false })
    startBound: ExamBound;

    @DtoField({ dto: [Dto.createCompetitionRegistration], validator: Validators.REQ_GUID })
    @DtoField({ dto: [Dto.updateCompetitionRegistration], validator: Validators.GUID })
    @Column({ nullable: false })
    endBound: ExamBound;

    // the user can have two "bound" in the local competition
    @Column({ nullable: true })
    @DtoField({
        dto: [Dto.createCompetitionRegistration, Dto.updateCompetitionRegistration],
        validator: Validators.GUID,
    })
    startBound2: ExamBound;

    @Column({ nullable: true })
    @DtoField({
        dto: [Dto.createCompetitionRegistration, Dto.updateCompetitionRegistration],
        validator: Validators.GUID,
    })
    endBound2: ExamBound;
}
