import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User";

export type AdminRole = "fullAccessAdmin" | "limitedAccess" | "readOnly";

@Entity({ name: "admin" })
export class Admin {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column({ default: false })
    isDeleted: boolean;

    @Column({
        type: "enum",
        enum: ["fullAccessAdmin", "limitedAccess", "readOnly"],
        default: "fullAccessAdmin",
    })
    role: AdminRole;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;
}
