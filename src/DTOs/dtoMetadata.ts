import { object } from "joi";
import { Admin } from "../entities/admin";
import { Group } from "../entities/group";
import { GroupUser } from "../entities/groupUser";
import { Teacher } from "../entities/teacher";
import { User } from "../entities/user";
import { generateDtoMetaData } from "./dtoEngine";
import { Card } from "../entities/card";
import { Competition } from "../entities/competition";
import { CompetitionRegistration } from "../entities/competitionRegistration";

export class Dto {
    static createAdmin = {
        name: "CreateAdminDto",
        meta: generateDtoMetaData("CreateAdminDto", Admin.prototype),
    };
    static updateAdmin = {
        name: "UpdateAdminDto",
        meta: generateDtoMetaData("UpdateAdminDto", Admin.prototype),
    };
    static createTeacher = {
        name: "createTeacherDto",
        meta: generateDtoMetaData("createTeacherDto", Teacher.prototype),
    };
    static updateTeacher = {
        name: "UpdateTeacherDto",
        meta: generateDtoMetaData("UpdateTeacherDto", Teacher.prototype),
    };
    static createUser = {
        name: "CreateUserDto",
        meta: generateDtoMetaData("CreateUserDto", User.prototype),
    };
    static updateUser = {
        name: "UpdateUserDto",
        meta: generateDtoMetaData("UpdateUserDto", User.prototype),
    };
    static createGroup = {
        name: "CreateGroupDto",
        meta: generateDtoMetaData("CreateGroupDto", Group.prototype),
    };
    static updateGroup = {
        name: "UpdateGroupDto",
        meta: generateDtoMetaData("UpdateGroupDto", Group.prototype),
    };
    static enrollUserToGroup = {
        name: "EnrollUserToGroup",
        meta: generateDtoMetaData("EnrollUserToGroupDto", GroupUser.prototype),
    };
    static createUserAdmin = {
        name: "CreateUserAdminDto",
        meta: generateDtoMetaData("CreateUserAdminDto", User.prototype, Admin.prototype),
    };
    static userLogin = {
        name: "UserLoginDto",
        meta: generateDtoMetaData("UserLoginDto", User.prototype),
    };
    static adminLogin = {
        name: "AdminLoginDto",
        meta: generateDtoMetaData("AdminLoginDto", Admin.prototype),
    };
    static teacherLogin = {
        name: "TeacherLoginDto",
        meta: generateDtoMetaData("TeacherLoginDto", Teacher.prototype),
    };
    static createCard = {
        name: "CreateCardDto",
        meta: generateDtoMetaData("CreateCardDto", Card.prototype),
    };
    static createCompetition = {
        name: "CreateCompetitionDto",
        meta: generateDtoMetaData("CreateCompetitionDto", Competition.prototype),
    };
    static updateCompetition = {
        name: "UpdateCompetitionDto",
        meta: generateDtoMetaData("UpdateCompetitionDto", Competition.prototype),
    };
    static createCompetitionRegistration = {
        name: "CreateCompetitionRegistrationDto",
        meta: generateDtoMetaData("CreateCompetitionRegistrationDto", CompetitionRegistration.prototype),
    };
    static updateCompetitionRegistration = {
        name: "UpdateCompetitionRegistrationDto",
        meta: generateDtoMetaData("UpdateCompetitionRegistrationDto", CompetitionRegistration.prototype),
    };
}
