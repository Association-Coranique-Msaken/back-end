import { Entity, Column, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { AbstractEntity } from "../abstractEntity";
import { ExamBound } from "./examBound";

@Entity({ name: "exam" })
export class Exam extends AbstractEntity {
    @Column()
    start: ExamBound;

    @Column({ default: false })
    end: ExamBound;
}
