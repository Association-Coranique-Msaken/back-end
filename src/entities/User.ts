import { Column, Entity, Index, OneToMany } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import { GroupUser } from "./GroupUser";
import { DtoField } from "../DTOs/dtoEngine";
import { Validators } from "../DTOs/validators";

@Entity({ name: "user" })
export class User extends AbstractEntity {
    @DtoField({ dtoNames: ["UserLoginDto"], validator: Validators.REQ_IDENTIFIER })
    @Index()
    @Column({ unique: true })
    identifier: string;

    @DtoField({ dtoNames: ["UpdateUserDto"], validator: Validators.TEXT })
    @DtoField({ dtoNames: ["CreateUserDto", "CreateUserAdminDto"], validator: Validators.REQ_TEXT })
    @Column()
    firstName: string;

    @DtoField({ dtoNames: ["UpdateUserDto"], validator: Validators.TEXT })
    @DtoField({ dtoNames: ["CreateUserDto", "CreateUserAdminDto"], validator: Validators.REQ_TEXT })
    @Column()
    lastName: string;

    @DtoField({ dtoNames: ["UpdateUserDto"], validator: Validators.TEXT })
    @DtoField({ dtoNames: ["CreateUserDto", "CreateUserAdminDto"], validator: Validators.REQ_TEXT })
    @Column({ nullable: true, default: null })
    fatherFirstName: string;

    @DtoField({ dtoNames: ["UpdateUserDto"], validator: Validators.TEXT })
    @DtoField({ dtoNames: ["CreateUserDto", "CreateUserAdminDto"], validator: Validators.TEXT })
    @Column({ nullable: true, default: null })
    grandFatherFirstName: string;

    @DtoField({ dtoNames: ["UpdateUserDto"], validator: Validators.TEXT })
    @DtoField({ dtoNames: ["CreateUserDto", "CreateUserAdminDto"], validator: Validators.REQ_TEXT })
    @Column({ nullable: true, default: null })
    motherFirstName: string;

    @DtoField({ dtoNames: ["UpdateUserDto"], validator: Validators.TEXT })
    @DtoField({ dtoNames: ["CreateUserDto", "CreateUserAdminDto"], validator: Validators.REQ_TEXT })
    @Column({ nullable: true, default: null })
    motherLastName: string;

    @DtoField({ dtoNames: ["UpdateUserDto"], validator: Validators.DATE_TRANSFORM })
    @DtoField({
        dtoNames: ["CreateUserDto", "CreateUserAdminDto", "UserLoginDto"],
        validator: Validators.REQ_DATE_TRANSFORM,
    })
    @Column()
    birthDate: Date;

    @DtoField({ dtoNames: ["UpdateUserDto"], validator: Validators.TEXT })
    @DtoField({ dtoNames: ["CreateUserDto", "CreateUserAdminDto"], validator: Validators.REQ_TEXT })
    @Column({ nullable: true, default: null })
    birthPlace: string;

    @DtoField({ dtoNames: ["CreateUserDto", "CreateUserAdminDto", "UpdateUserDto"], validator: Validators.TEL })
    @Column({ nullable: true, default: null })
    phoneNumber: string;

    @DtoField({ dtoNames: ["CreateUserDto", "CreateUserAdminDto", "UpdateUserDto"], validator: Validators.TEL })
    @Column({ nullable: true, default: null })
    fatherPhoneNumber: string;

    @Column({ nullable: true, default: null })
    @DtoField({ dtoNames: ["CreateUserDto", "CreateUserAdminDto", "UpdateUserDto"], validator: Validators.TEL })
    motherPhoneNumber: string;

    @DtoField({ dtoNames: ["UpdateUserDto"], validator: Validators.ONE_OF("male", "female") })
    @DtoField({ dtoNames: ["CreateUserDto", "CreateUserAdminDto"], validator: Validators.REQ_ONE_OF("male", "female") })
    @Column({
        type: "enum",
        enum: ["male", "female"],
    })
    gender: string;

    @DtoField({ dtoNames: ["CreateUserDto", "CreateUserAdminDto", "UpdateUserDto"], validator: Validators.CIN })
    @Column({ nullable: true, default: null })
    cin: string;

    @DtoField({ dtoNames: ["CreateUserDto", "CreateUserAdminDto", "UpdateUserDto"], validator: Validators.BOOL })
    @Column({ default: false })
    hasNationalIDcard: boolean;

    @DtoField({ dtoNames: ["CreateUserDto", "CreateUserAdminDto", "UpdateUserDto"], validator: Validators.BOOL })
    @Column({ default: false })
    hasGuaranteedBirthCertificate: boolean;

    @DtoField({ dtoNames: ["CreateUserDto", "CreateUserAdminDto", "UpdateUserDto"], validator: Validators.BOOL })
    @Column({ default: false })
    hasPassport: boolean;

    @OneToMany((type) => GroupUser, (groupUser) => groupUser.user)
    groups: GroupUser[];
}
