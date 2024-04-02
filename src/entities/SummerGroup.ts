import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { Teacher } from "./Teacher";
import { AbstractEntity } from "./AbstractEntity";

@Entity({ name: "summerGroup" })
export class SummerGroup extends AbstractEntity {
    @Column({ type: "varchar", length: 5 })
    code: string;

    @Column({ type: "varchar", length: 20 })
    numHizb: string;

    @Column()
    days: string;

    @Column({ type: "varchar", length: 20 })
    timeRange: string;

    @Column()
    roomNumber: number;

    @Column()
    maxStudents: number;

    @Column()
    numStudents: number;

    @Column()
    inactiveStudents: number;

    @OneToOne(() => Teacher)
    @JoinColumn()
    teacher: Teacher;
}
