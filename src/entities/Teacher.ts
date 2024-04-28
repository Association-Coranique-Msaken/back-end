import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { AbstractEntity } from "./AbstractEntity";
import { DtoField } from "../DTOs/dtoEngine";
import { Validators } from "../DTOs/validators";

@Entity({ name: "teacher" })
export class Teacher extends AbstractEntity {
    @DtoField({ dtoNames: ["TeacherLoginDto", "CreateTeacherDto"], validator: Validators.REQ_CODE })
    @Column()
    code: string;

    @DtoField({ dtoNames: ["TeacherLoginDto", "CreateTeacherDto"], validator: Validators.REQ_TEXT })
    @DtoField({ dtoNames: ["UpdateTeacherDto"], validator: Validators.TEXT })
    @Column()
    password: string;

    @DtoField({ dtoNames: ["CreateTeacherDto", "UpdateTeacherDto"], validator: Validators.TEXT })
    @Column({ nullable: true, default: null })
    kotebName: string;

    @DtoField({ dtoNames: ["CreateTeacherDto", "UpdateTeacherDto"], validator: Validators.TEXT })
    @Column({ nullable: true, default: null })
    bonus: string;

    @DtoField({ dtoNames: ["CreateTeacherDto", "UpdateTeacherDto"], validator: Validators.TEXT })
    @Column({ nullable: true, default: null })
    teacherType: string; // TODO: change to enum

    @DtoField({ dtoNames: ["CreateTeacherDto", "UpdateTeacherDto"], validator: Validators.BOOL })
    @Column({ default: true })
    isActive: boolean;

    @DtoField({ dtoNames: ["CreateTeacherDto"], validator: Validators.REQ_GUID, attributeName: "userId" })
    @OneToOne(() => User)
    @JoinColumn()
    user: User;
}
