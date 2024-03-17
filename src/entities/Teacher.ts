import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity({ name: "teacher" })
export class Teacher {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    code: string;

    @Column()
    password: string;

    @Column()
    kotebName: string;

    @Column()
    bonus: string;

    @Column()
    teacherType: string; //TODO: change to enum

    @Column()
    currentStatus: string;

    @Column({ default: false })
    isDeleted: boolean;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;
}
