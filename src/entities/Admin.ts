import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { AbstractEntity } from "./AbstractEntity";
import { DtoField } from "../DTOs/dtoEngine";
import { Validators } from "../DTOs/validators";
import { Filterable } from "../filters/annotations";
import { QueryItemType, QueryRelation } from "../filters/types";

export type AdminRole = "fullAccessAdmin" | "limitedAccess" | "readOnly";
const adminRroleValues: AdminRole[] = ["fullAccessAdmin", "limitedAccess", "readOnly"];

@Entity({ name: "admin" })
export class Admin extends AbstractEntity {
    @Filterable()
    @DtoField({ dto: ["UpdateAdminDto"], validator: Validators.TEXT })
    @DtoField({ dto: ["CreateAdminDto", "CreateUserAdminDto", "AdminLoginDto"], validator: Validators.REQ_TEXT })
    @Column({ unique: true })
    username: string;

    @DtoField({ dto: ["CreateAdminDto", "CreateUserAdminDto", "AdminLoginDto"], validator: Validators.REQ_TEXT })
    @Column()
    password: string;

    @Column({ default: false })
    isDeleted: boolean;

    @Filterable({ relation: QueryRelation.EQ })
    @DtoField({
        dto: ["UpdateAdminDto"],
        validator: Validators.ONE_OF(...adminRroleValues),
    })
    @DtoField({
        dto: ["CreateUserAdminDto", "CreateAdminDto"],
        validator: Validators.REQ_ONE_OF(...adminRroleValues),
    })
    @Column({
        type: "enum",
        enum: adminRroleValues,
        default: "fullAccessAdmin",
    })
    role: AdminRole;

    @DtoField({ dto: ["CreateAdminDto"], validator: Validators.REQ_GUID, attributeName: "userId" })
    @OneToOne(() => User)
    @JoinColumn()
    user: User;
}
