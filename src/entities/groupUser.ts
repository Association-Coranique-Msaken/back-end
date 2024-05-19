import { Entity, Column, ManyToOne } from "typeorm";
import { AbstractEntity } from "./abstractEntity";
import { User } from "./user";
import { Group } from "./group";
import { DtoField } from "../DTOs/dtoEngine";
import { Validators } from "../DTOs/validators";

@Entity({ name: "groupUser" })
export class GroupUser extends AbstractEntity {
    @DtoField({ dto: ["EnrollUserToGroupDto"], validator: Validators.REQ_GUID, attributeName: "groupId" })
    @ManyToOne((type) => Group, (group) => group.users)
    //@JoinColumn()
    group: Group;

    @DtoField({ dto: ["EnrollUserToGroupDto"], validator: Validators.REQ_GUID, attributeName: "userId" })
    @ManyToOne((type) => User, (user) => user.groups)
    // @JoinColumn()
    user: User;

    @Column({ default: true })
    isActive: boolean;

    @Column({ nullable: true, default: null })
    passed: boolean;
}
