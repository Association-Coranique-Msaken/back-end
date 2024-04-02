import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { Teacher } from "./Teacher";
import { AbstractEntity } from "./AbstractEntity";

export type CourseType = "practical" | "theoretical";

@Entity({ name: "formativeYearGroup" })
export class FormativeYearGroup extends AbstractEntity {
    @Column({ type: "varchar", length: 5 })
    code: string;

    @Column()
    days: string;

    @Column({ type: "varchar", length: 20 })
    timeRange: string;

    @Column()
    roomNumber: number;

    @Column()
    level: number;

    @Column({
        type: "enum",
        enum: ["practical", "theoretical"],
    })
    courseType: CourseType;

    @Column()
    numStudents: number;

    @OneToOne(() => Teacher)
    @JoinColumn()
    teacher: Teacher;
}
