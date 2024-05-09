import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { User } from "./user";
import { AbstractEntity } from "./abstractEntity";
import { DtoField } from "../DTOs/dtoEngine";
import { Validators } from "../DTOs/validators";
import { Filterable } from "../filters/annotations";
import { QueryItemType, QueryRelation } from "../filters/types";

@Entity({ name: "teacher" })
export class Teacher extends AbstractEntity {
    @Filterable({ relation: QueryRelation.STARTS_WITH })
    @DtoField({ dto: ["TeacherLoginDto"], validator: Validators.REQ_CODE })
    @DtoField({ dto: ["CreateTeacherDto"], validator: Validators.REQ_CODE_TYPE, attributeName: "codeType" })
    @Column()
    code: string;

    @DtoField({ dto: ["TeacherLoginDto", "CreateTeacherDto"], validator: Validators.REQ_TEXT })
    @DtoField({ dto: ["UpdateTeacherDto"], validator: Validators.TEXT })
    @Column()
    password: string;

    @Filterable()
    @DtoField({ dto: ["CreateTeacherDto", "UpdateTeacherDto"], validator: Validators.TEXT })
    @Column({ nullable: true, default: null })
    kotebName: string;

    @Filterable()
    @DtoField({ dto: ["CreateTeacherDto", "UpdateTeacherDto"], validator: Validators.TEXT })
    @Column({ nullable: true, default: null })
    bonus: string;

    @Filterable()
    @DtoField({ dto: ["CreateTeacherDto", "UpdateTeacherDto"], validator: Validators.TEXT })
    @Column({ nullable: true, default: null })
    teacherType: string; // TODO: change to enum

    @Filterable({ type: QueryItemType.NUMBER })
    @DtoField({ dto: ["UpdateTeacherDto"], validator: Validators.BOOL })
    @Column({ default: true })
    isActive: boolean;

    @DtoField({ dto: ["CreateTeacherDto"], validator: Validators.REQ_GUID, attributeName: "userId" })
    @OneToOne(() => User)
    @JoinColumn()
    user: User;
}
