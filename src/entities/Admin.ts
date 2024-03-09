import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
@Entity({ name: "admin" })
export class Admin {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    username: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    password: string;

    @Column({
        type: "enum",
        enum: ["fullAccessAdmin", "limitedAccess", "readOnly"],
        default: "fullAccessAdmin",
    })
    role: "fullAccessAdmin" | "limitedAccess" | "readOnly";
}
