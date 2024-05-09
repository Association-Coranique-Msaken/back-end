import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { AbstractEntity } from "./abstractEntity";
import { User } from "./user";
import { OneToOne } from "typeorm/browser";
import { Filterable } from "../filters/annotations";
import { QueryRelation } from "../filters/types";

@Entity({ name: "card" })
export class Card extends AbstractEntity {
    @Filterable({ relation: QueryRelation.EQ })
    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @Column()
    number: number;

    @Column({ default: true })
    isDelivered: boolean;

    @Column({ type: "timestamp" })
    expiration: Date;
}
