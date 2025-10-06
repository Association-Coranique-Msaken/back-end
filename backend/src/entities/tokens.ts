import { Entity, Column, Index, PrimaryColumn } from "typeorm";

@Entity({ name: "Tokens" })
export class Tokens {
    @PrimaryColumn()
    token: string;

    @PrimaryColumn()
    @Index()
    elementId: string;

    @Column({ type: "timestamp" })
    expiration: Date;
}
