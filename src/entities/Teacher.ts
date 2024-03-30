import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { AbstractEntity } from "./AbstractEntity";

@Entity({ name: "teacher" })
export class Teacher extends AbstractEntity {
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

    @OneToOne(() => User)
    @JoinColumn()
    user: User;
}
