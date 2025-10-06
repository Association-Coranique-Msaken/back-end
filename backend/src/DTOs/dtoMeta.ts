import { Admin } from "../entities/admin";
import { Group } from "../entities/group";
import { GroupUser } from "../entities/groupUser";
import { Teacher } from "../entities/teacher";
import { User } from "../entities/user";
import { generateDtoMetaData } from "./dtoEngine";
import { Card } from "../entities/card";
import { Competition } from "../entities/competition/competition";
import { CompetitionRegistration } from "../entities/competition/competitionRegistration";
import { Dto } from "./dto";
import { UserResult } from "../entities/competition/userResult";

export class DtoMeta {
    static createAdmin = {
        name: Dto.createAdmin,
        meta: generateDtoMetaData(Dto.createAdmin, Admin.prototype),
    };
    static updateAdmin = {
        name: Dto.updateAdmin,
        meta: generateDtoMetaData(Dto.updateAdmin, Admin.prototype),
    };
    static createTeacher = {
        name: Dto.createTeacher,
        meta: generateDtoMetaData(Dto.createTeacher, Teacher.prototype),
    };
    static updateTeacher = {
        name: Dto.updateTeacher,
        meta: generateDtoMetaData(Dto.updateTeacher, Teacher.prototype),
    };
    static createUser = {
        name: Dto.createUser,
        meta: generateDtoMetaData(Dto.createUser, User.prototype),
    };
    static updateUser = {
        name: Dto.updateUser,
        meta: generateDtoMetaData(Dto.updateUser, User.prototype),
    };
    static createGroup = {
        name: Dto.createGroup,
        meta: generateDtoMetaData(Dto.createGroup, Group.prototype),
    };
    static updateGroup = {
        name: Dto.updateGroup,
        meta: generateDtoMetaData(Dto.updateGroup, Group.prototype),
    };
    static enrollUserToGroup = {
        name: Dto.enrollUserToGroup,
        meta: generateDtoMetaData(Dto.enrollUserToGroup, GroupUser.prototype),
    };
    static createUserAdmin = {
        name: Dto.createUserAdmin,
        meta: generateDtoMetaData(Dto.createUserAdmin, User.prototype, Admin.prototype),
    };
    static userLogin = {
        name: Dto.userLogin,
        meta: generateDtoMetaData(Dto.userLogin, User.prototype),
    };
    static adminLogin = {
        name: Dto.adminLogin,
        meta: generateDtoMetaData(Dto.adminLogin, Admin.prototype),
    };
    static teacherLogin = {
        name: Dto.teacherLogin,
        meta: generateDtoMetaData(Dto.teacherLogin, Teacher.prototype),
    };
    static createCard = {
        name: Dto.createCard,
        meta: generateDtoMetaData(Dto.createCard, Card.prototype),
    };
    static createCompetition = {
        name: Dto.createCompetition,
        meta: generateDtoMetaData(Dto.createCompetition, Competition.prototype),
    };
    static updateCompetition = {
        name: Dto.updateCompetition,
        meta: generateDtoMetaData(Dto.updateCompetition, Competition.prototype),
    };
    static createCompetitionRegistration = {
        name: Dto.createCompetitionRegistration,
        meta: generateDtoMetaData(Dto.createCompetitionRegistration, CompetitionRegistration.prototype),
    };
    static updateCompetitionRegistration = {
        name: Dto.updateCompetitionRegistration,
        meta: generateDtoMetaData(Dto.updateCompetitionRegistration, CompetitionRegistration.prototype),
    };
    static createUserResult = {
        name: Dto.createUserResult,
        meta: generateDtoMetaData(Dto.createUserResult, UserResult.prototype),
    };
    static createUserExam = {
        name: Dto.createUserExam,
        meta: generateDtoMetaData(Dto.createUserExam, UserResult.prototype),
    };
    static createExamBound = {
        name: Dto.createExamBound,
        meta: generateDtoMetaData(Dto.createExamBound, UserResult.prototype),
    };
}
