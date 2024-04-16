import { Entity, Column, ManyToOne } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import { User } from "./User";
import { Group } from "./Group";

@Entity({ name: "groupUser" })
export class GroupUser extends AbstractEntity {
    @ManyToOne((type) => Group, (group) => group.users)
    //@JoinColumn()
    group: Group;

    @ManyToOne((type) => User, (user) => user.groups)
    // @JoinColumn()
    user: User;

    @Column({ default: true })
    isActive: boolean;
}
