import { Entity, Column, OneToOne, JoinColumn } from "typeorm";
import { User } from "./user";
import { AbstractEntity } from "./abstractEntity";
import { DtoField } from "../DTOs/dtoEngine";
import { Validators } from "../DTOs/validators";
import { Filterable } from "../filters/annotations";
import { QueryRelation } from "../filters/types";
import { Dto } from "../DTOs/dto";

export type AdminRole = "fullAccessAdmin" | "limitedAccess" | "readOnly";
const adminRoleValues: AdminRole[] = ["fullAccessAdmin", "limitedAccess", "readOnly"];

@Entity({ name: "admin" })
export class Admin extends AbstractEntity {
    @Filterable()
    @DtoField({ dto: [Dto.updateAdmin], validator: Validators.TEXT })
    @DtoField({ dto: [Dto.createAdmin, Dto.createUserAdmin, Dto.adminLogin], validator: Validators.REQ_TEXT })
    @Column({ unique: true })
    username: string;

    @DtoField({ dto: [Dto.createAdmin, Dto.createUserAdmin, Dto.adminLogin], validator: Validators.REQ_TEXT })
    @Column()
    password: string;

    @Column({ default: false })
    isDeleted: boolean;

    @Filterable({ relation: QueryRelation.EQ })
    @DtoField({
        dto: [Dto.updateAdmin],
        validator: Validators.ONE_OF(...adminRoleValues),
    })
    @DtoField({
        dto: [Dto.createUserAdmin, Dto.createAdmin],
        validator: Validators.REQ_ONE_OF(...adminRoleValues),
    })
    @Column({
        type: "enum",
        enum: adminRoleValues,
        default: "fullAccessAdmin",
    })
    role: AdminRole;

    @DtoField({ dto: [Dto.createAdmin], validator: Validators.REQ_GUID, attributeName: "userId" })
    @OneToOne(() => User)
    @JoinColumn()
    user: User;
}
