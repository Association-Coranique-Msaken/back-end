import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToMany, JoinTable } from "typeorm";
import { Teacher } from "./Teacher";
import { AbstractEntity } from "./AbstractEntity";
import { User } from "./User";

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
    numStudents: number;

    @Column({ nullable: true, default: null })
    maxStudents?: number;

    @Column({ nullable: true, default: null })
    inactiveStudents?: number;

    @OneToOne(() => Teacher)
    @JoinColumn()
    teacher: Teacher;

    @ManyToMany(() => User, (user: User) => user.groups)
    @JoinTable({ name: "groupUsers" })
    users: User[];
}
