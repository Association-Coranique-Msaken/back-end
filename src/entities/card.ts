import { Entity, Column, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { User } from "./user";
import { AbstractEntity } from "./abstractEntity";
import { DtoField } from "../DTOs/dtoEngine";
import { Validators } from "../DTOs/validators";
import { Filterable } from "../filters/annotations";
import { QueryItemType } from "../filters/types";

@Entity({ name: "card" })
export class Card extends AbstractEntity {
    @Filterable({ type: QueryItemType.NUMBER })
    @Column()
    countId: number;

    @DtoField({ dto: ["CreateCardDto"], validator: Validators.BOOL })
    @Filterable({ type: QueryItemType.BOOL })
    @Column({ default: true })
    isDelivered: boolean;

    @Column({ type: "timestamp" })
    expiration: Date;

    @Filterable({ type: QueryItemType.GUID, fieldName: "userId" })
    @DtoField({ dto: ["CreateCardDto"], validator: Validators.REQ_GUID, attributeName: "userId" })
    @ManyToOne(() => User)
    @JoinColumn()
    user: User;
}
