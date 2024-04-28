import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { AbstractEntity } from "./AbstractEntity";
import { DtoField } from "../DTOs/dtoEngine";
import { Validators } from "../DTOs/validators";

export type AdminRole = "fullAccessAdmin" | "limitedAccess" | "readOnly";

@Entity({ name: "admin" })
export class Admin extends AbstractEntity {
    @DtoField({ dtoNames: ["UpdateAdminDto"], validator: Validators.TEXT })
    @DtoField({ dtoNames: ["CreateAdminDto", "CreateUserAdminDto", "AdminLoginDto"], validator: Validators.REQ_TEXT })
    @Column({ unique: true })
    username: string;

    @DtoField({ dtoNames: ["CreateAdminDto", "CreateUserAdminDto", "AdminLoginDto"], validator: Validators.REQ_TEXT })
    @Column()
    password: string;

    @Column({ default: false })
    isDeleted: boolean;

    @DtoField({
        dtoNames: ["UpdateAdminDto"],
        validator: Validators.ONE_OF("fullAccessAdmin", "limitedAccess", "readOnly"),
    })
    @DtoField({
        dtoNames: ["CreateUserAdminDto", "CreateAdminDto"],
        validator: Validators.REQ_ONE_OF("fullAccessAdmin", "limitedAccess", "readOnly"),
    })
    @Column({
        type: "enum",
        enum: ["fullAccessAdmin", "limitedAccess", "readOnly"],
        default: "fullAccessAdmin",
    })
    role: AdminRole;

    @DtoField({ dtoNames: ["CreateAdminDto"], validator: Validators.REQ_GUID, attributeName: "userId" })
    @OneToOne(() => User)
    @JoinColumn()
    user: User;
}
