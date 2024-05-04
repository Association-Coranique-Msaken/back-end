import { Column, Entity, Index, OneToMany } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import { GroupUser } from "./GroupUser";
import { DtoField } from "../DTOs/dtoEngine";
import { Validators } from "../DTOs/validators";
import { Filterable } from "../filters/annotations";
import { QueryItemType, QueryRelation } from "../filters/types";

@Entity({ name: "user" })
export class User extends AbstractEntity {
    @Filterable({ names: ["user", "admin", "teacher"] })
    @DtoField({ dto: ["UserLoginDto"], validator: Validators.REQ_IDENTIFIER })
    @Index()
    @Column({ unique: true })
    identifier: string;

    @Filterable({ names: ["user", "admin", "teacher"] })
    @DtoField({ dto: ["UpdateUserDto"], validator: Validators.TEXT })
    @DtoField({ dto: ["CreateUserDto", "CreateUserAdminDto"], validator: Validators.REQ_TEXT })
    @Column()
    firstName: string;

    @Filterable({ names: ["user", "admin", "teacher"] })
    @DtoField({ dto: ["UpdateUserDto"], validator: Validators.TEXT })
    @DtoField({ dto: ["CreateUserDto", "CreateUserAdminDto"], validator: Validators.REQ_TEXT })
    @Column()
    lastName: string;

    @Filterable({ names: ["user", "admin", "teacher"] })
    @DtoField({ dto: ["UpdateUserDto"], validator: Validators.TEXT })
    @DtoField({ dto: ["CreateUserDto", "CreateUserAdminDto"], validator: Validators.REQ_TEXT })
    @Column({ nullable: true, default: null })
    fatherFirstName: string;

    @Filterable({ names: ["user", "admin", "teacher"] })
    @DtoField({ dto: ["UpdateUserDto"], validator: Validators.TEXT })
    @DtoField({ dto: ["CreateUserDto", "CreateUserAdminDto"], validator: Validators.TEXT })
    @Column({ nullable: true, default: null })
    grandFatherFirstName: string;

    @Filterable({ names: ["user", "admin", "teacher"] })
    @DtoField({ dto: ["UpdateUserDto"], validator: Validators.TEXT })
    @DtoField({ dto: ["CreateUserDto", "CreateUserAdminDto"], validator: Validators.REQ_TEXT })
    @Column({ nullable: true, default: null })
    motherFirstName: string;

    @Filterable({ names: ["user", "admin", "teacher"] })
    @DtoField({ dto: ["UpdateUserDto"], validator: Validators.TEXT })
    @DtoField({ dto: ["CreateUserDto", "CreateUserAdminDto"], validator: Validators.REQ_TEXT })
    @Column({ nullable: true, default: null })
    motherLastName: string;

    @Filterable({ names: ["user", "admin", "teacher"], type: QueryItemType.DATE })
    @DtoField({ dto: ["UpdateUserDto"], validator: Validators.DATE_TRANSFORM })
    @DtoField({
        dto: ["CreateUserDto", "CreateUserAdminDto", "UserLoginDto"],
        validator: Validators.REQ_DATE_TRANSFORM,
    })
    @Column()
    birthDate: Date;

    @Filterable({ names: ["user", "admin", "teacher"] })
    @DtoField({ dto: ["UpdateUserDto"], validator: Validators.TEXT })
    @DtoField({ dto: ["CreateUserDto", "CreateUserAdminDto"], validator: Validators.REQ_TEXT })
    @Column({ nullable: true, default: null })
    birthPlace: string;

    @Filterable({ names: ["user", "admin", "teacher"] })
    @DtoField({ dto: ["CreateUserDto", "CreateUserAdminDto", "UpdateUserDto"], validator: Validators.TEL })
    @Column({ nullable: true, default: null })
    phoneNumber: string;

    @DtoField({ dto: ["CreateUserDto", "CreateUserAdminDto", "UpdateUserDto"], validator: Validators.TEL })
    @Column({ nullable: true, default: null })
    fatherPhoneNumber: string;

    @Column({ nullable: true, default: null })
    @DtoField({ dto: ["CreateUserDto", "CreateUserAdminDto", "UpdateUserDto"], validator: Validators.TEL })
    motherPhoneNumber: string;

    @Filterable({ names: ["user", "admin", "teacher"], relation: QueryRelation.EQ })
    @DtoField({ dto: ["UpdateUserDto"], validator: Validators.ONE_OF("male", "female") })
    @DtoField({ dto: ["CreateUserDto", "CreateUserAdminDto"], validator: Validators.REQ_ONE_OF("male", "female") })
    @Column({ type: "enum", enum: ["male", "female"] })
    gender: string;

    @Filterable({ names: ["user", "admin", "teacher"], relation: QueryRelation.EQ })
    @DtoField({ dto: ["CreateUserDto", "CreateUserAdminDto", "UpdateUserDto"], validator: Validators.CIN })
    @Column({ nullable: true, default: null })
    cin: string;

    @DtoField({ dto: ["CreateUserDto", "CreateUserAdminDto", "UpdateUserDto"], validator: Validators.BOOL })
    @Column({ default: false })
    hasNationalIDcard: boolean;

    @DtoField({ dto: ["CreateUserDto", "CreateUserAdminDto", "UpdateUserDto"], validator: Validators.BOOL })
    @Column({ default: false })
    hasGuaranteedBirthCertificate: boolean;

    @DtoField({ dto: ["CreateUserDto", "CreateUserAdminDto", "UpdateUserDto"], validator: Validators.BOOL })
    @Column({ default: false })
    hasPassport: boolean;

    @OneToMany((type) => GroupUser, (groupUser) => groupUser.user)
    groups: GroupUser[];
}
