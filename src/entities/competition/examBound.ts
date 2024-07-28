import { Entity, Column } from "typeorm";
import { AbstractEntity } from "../abstractEntity";
import { DtoField } from "../../DTOs/dtoEngine";
import { Validators } from "../../DTOs/validators";
import { Dto } from "../../DTOs/dto";

@Entity({ name: "examBound" })
export class ExamBound extends AbstractEntity {
    @DtoField({ dto: [Dto.createExamBound], validator: Validators.REQ_TEXT })
    @Column()
    desciption: string;

    @DtoField({ dto: [Dto.createExamBound], validator: Validators.BOOL })
    @Column({ default: false })
    isStart: Boolean;

    @DtoField({ dto: [Dto.createExamBound], validator: Validators.BOOL })
    @Column({ default: false })
    isEnd: Boolean;
}
