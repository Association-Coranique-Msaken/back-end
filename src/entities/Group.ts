import { Entity, Column, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { Teacher } from "./Teacher";
import { AbstractEntity } from "./AbstractEntity";
import { User } from "./User";
import { GroupUser } from "./GroupUser";
import { DtoField } from "../DTOs/dtoEngine";
import { Validators } from "../DTOs/validators";

export type CourseType = "practical" | "theoretical" | "summerGroup";

@Entity({ name: "group" })
export class Group extends AbstractEntity {
    @DtoField({ dtoNames: ["CreateGroupDto"], validator: Validators.REQ_GRP_CODE })
    @DtoField({ dtoNames: ["UpdateGroupDto"], validator: Validators.GRP_CODE })
    @Column({ type: "varchar", length: 5 })
    code: string;

    @DtoField({ dtoNames: ["CreateGroupDto"], validator: Validators.REQ_TEXT })
    @DtoField({ dtoNames: ["UpdateGroupDto"], validator: Validators.TEXT })
    @Column()
    days: string;

    @DtoField({ dtoNames: ["CreateGroupDto"], validator: Validators.REQ_TEXT })
    @DtoField({ dtoNames: ["UpdateGroupDto"], validator: Validators.TEXT })
    @Column({ type: "varchar", length: 20 })
    timeRange: string;

    @DtoField({ dtoNames: ["CreateGroupDto"], validator: Validators.REQ_NUM })
    @DtoField({ dtoNames: ["UpdateGroupDto"], validator: Validators.NUM })
    @Column()
    roomNumber: number;

    @DtoField({ dtoNames: ["CreateGroupDto"], validator: Validators.REQ_TEXT })
    @DtoField({ dtoNames: ["UpdateGroupDto"], validator: Validators.TEXT })
    @Column()
    levelOrNumHizbs: string;

    @DtoField({
        dtoNames: ["CreateGroupDto"],
        validator: Validators.REQ_ONE_OF("practical", "theorethical", "summerGroup"),
    })
    @DtoField({
        dtoNames: ["UpdateGroupDto"],
        validator: Validators.ONE_OF("practical", "theorethical", "summerGroup"),
    })
    @Column({
        type: "enum",
        enum: ["practical", "theorethical", "summerGroup"],
    })
    courseType: CourseType;

    @DtoField({ dtoNames: ["CreateGroupDto", "UpdateGroupDto"], validator: Validators.NUM })
    @Column({ nullable: true, default: null })
    maxStudents?: number;

    @DtoField({ dtoNames: ["CreateGroupDto"], validator: Validators.REQ_GUID, attributeName: "teacherId" })
    @DtoField({ dtoNames: ["UpdateGroupDto"], validator: Validators.GUID, attributeName: "teacherId" })
    @OneToOne(() => Teacher)
    @JoinColumn()
    teacher: Teacher;

    @OneToMany((type) => GroupUser, (groupUsers) => groupUsers.group)
    users: GroupUser[];

    // calculated fields.
    numStudents: number;
    inactiveStudents?: number;
}
