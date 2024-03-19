import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
@Entity({ name: "admin" })
export class Admin {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ unique: true })
    username: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    password: string;

    @Column({ default: false })
    isDeleted: boolean;

    @Column({
        type: "enum",
        enum: ["fullAccessAdmin", "limitedAccess", "readOnly"],
        default: "fullAccessAdmin",
    })
    role: "fullAccessAdmin" | "limitedAccess" | "readOnly";
}
