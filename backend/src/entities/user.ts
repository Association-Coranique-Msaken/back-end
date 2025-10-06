import { Column, Entity, Index, OneToMany } from "typeorm";
import { AbstractEntity } from "./abstractEntity";
import { GroupUser } from "./groupUser";
import { DtoField } from "../DTOs/dtoEngine";
import { Validators } from "../DTOs/validators";
import { Filterable } from "../filters/annotations";
import { QueryItemType, QueryRelation } from "../filters/types";
import { Dto } from "../DTOs/dto";

export type SocialCondition = "donator" | "poor" | "teacherSon" | "unknown";
const socialConditionValues: SocialCondition[] = ["donator", "poor", "teacherSon", "unknown"];
const male = "male";
const female = "female";

@Entity({ name: "user" })
export class User extends AbstractEntity {
    @Filterable({ names: ["user", "admin", "teacher", "competitionRegistration"] })
    @DtoField({ dto: [Dto.userLogin], validator: Validators.REQ_IDENTIFIER })
    @Column({ unique: true })
    identifier: string;

    @Filterable({ names: ["user", "admin", "teacher", "competitionRegistration"] })
    @DtoField({ dto: [Dto.updateUser], validator: Validators.TEXT })
    @DtoField({ dto: [Dto.createUser, Dto.createUserAdmin], validator: Validators.REQ_TEXT })
    @Column()
    firstName: string;

    @Filterable({ names: ["user", "admin", "teacher", "competitionRegistration"] })
    @DtoField({ dto: [Dto.updateUser], validator: Validators.TEXT })
    @DtoField({ dto: [Dto.createUser, Dto.createUserAdmin], validator: Validators.REQ_TEXT })
    @Column()
    lastName: string;

    @Filterable({ names: ["user", "admin", "teacher"] })
    @DtoField({ dto: [Dto.updateUser], validator: Validators.TEXT })
    @DtoField({ dto: [Dto.createUser, Dto.createUserAdmin], validator: Validators.REQ_TEXT })
    @Column({ nullable: true, default: null })
    fatherFirstName: string;

    @Filterable({ names: ["user", "admin", "teacher"] })
    @DtoField({ dto: [Dto.updateUser], validator: Validators.TEXT })
    @DtoField({ dto: [Dto.createUser, Dto.createUserAdmin], validator: Validators.TEXT })
    @Column({ nullable: true, default: null })
    grandFatherFirstName: string;

    @Filterable({ names: ["user", "admin", "teacher"] })
    @DtoField({ dto: [Dto.updateUser], validator: Validators.TEXT })
    @DtoField({ dto: [Dto.createUser, Dto.createUserAdmin], validator: Validators.REQ_TEXT })
    @Column({ nullable: true, default: null })
    motherFirstName: string;

    @Filterable({ names: ["user", "admin", "teacher"] })
    @DtoField({ dto: [Dto.updateUser], validator: Validators.TEXT })
    @DtoField({ dto: [Dto.createUser, Dto.createUserAdmin], validator: Validators.REQ_TEXT })
    @Column({ nullable: true, default: null })
    motherLastName: string;

    @Filterable({ names: ["user", "admin", "teacher"], type: QueryItemType.DATE })
    @DtoField({ dto: [Dto.updateUser], validator: Validators.DATE_TRANSFORM })
    @DtoField({
        dto: [Dto.createUser, Dto.createUserAdmin, Dto.userLogin],
        validator: Validators.REQ_DATE_TRANSFORM,
    })
    @Column()
    birthDate: Date;

    @Filterable({ names: ["user", "admin", "teacher"] })
    @DtoField({ dto: [Dto.updateUser], validator: Validators.TEXT })
    @DtoField({ dto: [Dto.createUser, Dto.createUserAdmin], validator: Validators.REQ_TEXT })
    @Column({ nullable: true, default: null })
    birthPlace: string;

    @Filterable({ names: ["user", "admin", "teacher"] })
    @DtoField({ dto: [Dto.createUser, Dto.createUserAdmin, Dto.updateUser], validator: Validators.TEL })
    @Column({ nullable: true, default: null })
    phoneNumber: string;

    @DtoField({ dto: [Dto.createUser, Dto.createUserAdmin, Dto.updateUser], validator: Validators.TEL })
    @Column({ nullable: true, default: null })
    fatherPhoneNumber: string;

    @Column({ nullable: true, default: null })
    @DtoField({ dto: [Dto.createUser, Dto.createUserAdmin, Dto.updateUser], validator: Validators.TEL })
    motherPhoneNumber: string;

    @Filterable({ names: ["user", "admin", "teacher"], relation: QueryRelation.EQ })
    @DtoField({ dto: [Dto.updateUser], validator: Validators.ONE_OF(male, female) })
    @DtoField({ dto: [Dto.createUser, Dto.createUserAdmin], validator: Validators.REQ_ONE_OF(male, female) })
    @Column({ type: "enum", enum: [male, female] })
    gender: string;

    @Filterable({ names: ["user", "admin", "teacher"], relation: QueryRelation.EQ })
    @DtoField({ dto: [Dto.createUser, Dto.createUserAdmin, Dto.updateUser], validator: Validators.CIN })
    @Column({ nullable: true, default: null })
    cin: string;

    @DtoField({ dto: [Dto.createUser, Dto.createUserAdmin, Dto.updateUser], validator: Validators.BOOL })
    @Column({ default: false })
    hasNationalIDcard: boolean;

    @DtoField({ dto: [Dto.createUser, Dto.createUserAdmin, Dto.updateUser], validator: Validators.BOOL })
    @Column({ default: false })
    hasGuaranteedBirthCertificate: boolean;

    @DtoField({ dto: [Dto.createUser, Dto.createUserAdmin, Dto.updateUser], validator: Validators.BOOL })
    @Column({ default: false })
    hasPassport: boolean;

    @Filterable({ names: socialConditionValues, relation: QueryRelation.EQ })
    @DtoField({ dto: [Dto.createUser, Dto.updateUser], validator: Validators.ONE_OF(...socialConditionValues) })
    @Column({ nullable: true, default: null })
    socialCondition: SocialCondition;

    @OneToMany((type) => GroupUser, (groupUser) => groupUser.user)
    groups: GroupUser[];
}
