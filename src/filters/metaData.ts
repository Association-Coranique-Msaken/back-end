import { Admin } from "../entities/Admin";
import { Group } from "../entities/Group";
import { Teacher } from "../entities/Teacher";
import { User } from "../entities/User";
import { generateFilterMetaData } from "./annotations";

export const UserListFilterMeta = generateFilterMetaData("user", User.prototype);
export const AdminListFilterMeta = generateFilterMetaData("admin", Admin.prototype, User.prototype);
export const TeacherListFilterMeta = generateFilterMetaData("teacher", Teacher.prototype, User.prototype);
export const GroupListFilterMeta = generateFilterMetaData("group", Group.prototype);
