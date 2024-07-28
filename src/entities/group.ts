import { Entity, Column, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { Teacher } from "./teacher";
import { AbstractEntity } from "./abstractEntity";
import { GroupUser } from "./groupUser";
import { DtoField } from "../DTOs/dtoEngine";
import { Validators } from "../DTOs/validators";
import { Filterable } from "../filters/annotations";
import { QueryItemType, QueryRelation } from "../filters/types";
import { Dto } from "../DTOs/dto";

export type CourseType = "practical" | "theoretical" | "summerGroup";
const courseTypeValues: CourseType[] = ["practical", "theoretical", "summerGroup"];

@Entity({ name: "group" })
export class Group extends AbstractEntity {
    @Filterable()
    @DtoField({ dto: [Dto.createGroup], validator: Validators.REQ_GRP_CODE })
    @DtoField({ dto: [Dto.updateGroup], validator: Validators.GRP_CODE })
    @Column({ type: "varchar", length: 5 })
    code: string;

    @Filterable()
    @DtoField({ dto: [Dto.createGroup], validator: Validators.REQ_TEXT })
    @DtoField({ dto: [Dto.updateGroup], validator: Validators.TEXT })
    @Column()
    days: string;

    @Filterable()
    @DtoField({ dto: [Dto.createGroup], validator: Validators.REQ_TEXT })
    @DtoField({ dto: [Dto.updateGroup], validator: Validators.TEXT })
    @Column({ type: "varchar", length: 20 })
    timeRange: string;

    @Filterable({ type: QueryItemType.NUMBER })
    @DtoField({ dto: [Dto.createGroup], validator: Validators.REQ_NUM })
    @DtoField({ dto: [Dto.updateGroup], validator: Validators.NUM })
    @Column()
    roomNumber: number;

    @Filterable({ relation: QueryRelation.EQ })
    @DtoField({ dto: [Dto.createGroup], validator: Validators.REQ_TEXT })
    @DtoField({ dto: [Dto.updateGroup], validator: Validators.TEXT })
    @Column()
    levelOrNumHizbs: string;

    @Filterable({ relation: QueryRelation.EQ })
    @DtoField({ dto: [Dto.createGroup], validator: Validators.REQ_ONE_OF(...courseTypeValues) })
    @DtoField({ dto: [Dto.updateGroup], validator: Validators.ONE_OF(...courseTypeValues) })
    @Column({ type: "enum", enum: courseTypeValues })
    courseType: CourseType;

    @DtoField({ dto: [Dto.createGroup, Dto.updateGroup], validator: Validators.NUM })
    @Column({ nullable: true, default: null })
    maxStudents?: number;

    @Filterable({ type: QueryItemType.GUID, fieldName: "teacherId" })
    @DtoField({ dto: [Dto.createGroup], validator: Validators.REQ_GUID, attributeName: "teacherId" })
    @DtoField({ dto: [Dto.updateGroup], validator: Validators.GUID, attributeName: "teacherId" })
    @OneToOne(() => Teacher)
    @JoinColumn()
    teacher: Teacher;

    @OneToMany((type) => GroupUser, (groupUsers) => groupUsers.group)
    users: GroupUser[];

    // calculated fields.
    numStudents: number;
    inactiveStudents?: number;
}
