import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity({ name: "teacher" })
export class Teacher {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    code: string;

    @Column()
    password: string;

    @Column({ nullable: true, default: null })
    kotebName: string;

    @Column({ nullable: true, default: null })
    bonus: string;

    @Column({ nullable: true, default: null })
    teacherType: string; // TODO: change to enum

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: false })
    isDeleted: boolean;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;
}
