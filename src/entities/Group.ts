import { Entity, Column, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { Teacher } from "./Teacher";
import { AbstractEntity } from "./AbstractEntity";
import { User } from "./User";
import { GroupUser } from "./GroupUser";

export type CourseType = "practical" | "theoretical" | "summerGroup";

@Entity({ name: "group" })
export class Group extends AbstractEntity {
    @Column({ type: "varchar", length: 5 })
    code: string;

    @Column()
    days: string;

    @Column({ type: "varchar", length: 20 })
    timeRange: string;

    @Column()
    roomNumber: number;

    @Column()
    levelOrNumHizbs: string;

    @Column({
        type: "enum",
        enum: ["practical", "theorethical", "summerGroup"],
    })
    courseType: CourseType;

    @Column()
    numStudents: number; // TODO: make this a calculated field.

    @Column({ nullable: true, default: null })
    maxStudents?: number;

    @Column({ nullable: true, default: null })
    inactiveStudents?: number; // TODO: make this a calculated field.

    @OneToOne(() => Teacher)
    @JoinColumn()
    teacher: Teacher;

    @OneToMany((type) => GroupUser, (groupUsers) => groupUsers.group)
    users: GroupUser[];
}
