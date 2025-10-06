import { Entity, Column, OneToOne, JoinColumn } from "typeorm";
import { User } from "./user";
import { AbstractEntity } from "./abstractEntity";
import { DtoField } from "../DTOs/dtoEngine";
import { Validators } from "../DTOs/validators";
import { Filterable } from "../filters/annotations";
import { QueryItemType, QueryRelation } from "../filters/types";
import { Dto } from "../DTOs/dto";

@Entity({ name: "teacher" })
export class Teacher extends AbstractEntity {
    @Filterable({ names: ["competitionRegistration", "teacher"], relation: QueryRelation.STARTS_WITH })
    @DtoField({ dto: [Dto.teacherLogin], validator: Validators.REQ_CODE })
    @DtoField({ dto: [Dto.createTeacher], validator: Validators.REQ_CODE_TYPE, attributeName: "codeType" })
    @Column()
    code: string;

    @DtoField({ dto: [Dto.teacherLogin], validator: Validators.REQ_TEXT })
    @Column()
    password: string;

    @Filterable()
    @DtoField({ dto: [Dto.createTeacher, Dto.updateTeacher], validator: Validators.TEXT })
    @Column({ nullable: true, default: null })
    kotebName: string;

    @Filterable()
    @DtoField({ dto: [Dto.createTeacher, Dto.updateTeacher], validator: Validators.TEXT })
    @Column({ nullable: true, default: null })
    bonus: string;

    @Filterable()
    @DtoField({ dto: [Dto.createTeacher, Dto.updateTeacher], validator: Validators.TEXT })
    @Column({ nullable: true, default: null })
    teacherType: string; // TODO: change to enum

    @Filterable({ type: QueryItemType.NUMBER })
    @DtoField({ dto: [Dto.updateTeacher], validator: Validators.BOOL })
    @Column({ default: true })
    isActive: boolean;

    @DtoField({ dto: [Dto.createTeacher], validator: Validators.REQ_GUID, attributeName: "userId" })
    @OneToOne(() => User)
    @JoinColumn()
    user: User;
}
