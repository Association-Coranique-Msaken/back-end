import { Admin } from "../entities/admin";
import { Group } from "../entities/group";
import { Teacher } from "../entities/teacher";
import { User } from "../entities/user";
import { generateFilterMetaData } from "./annotations";

export const UserListFilterMeta = generateFilterMetaData("user", User.prototype);
export const AdminListFilterMeta = generateFilterMetaData("admin", Admin.prototype, User.prototype);
export const TeacherListFilterMeta = generateFilterMetaData("teacher", Teacher.prototype, User.prototype);
export const GroupListFilterMeta = generateFilterMetaData("group", Group.prototype);
