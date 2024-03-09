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
    prim: string;

    @Column()
    teacherType: string; //TODO: change to enum

    @Column()
    statue: string;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;
}
