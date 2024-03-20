import { Entity, Column, Index, PrimaryColumn } from "typeorm";

@Entity({ name: "invalidTokens" })
export class InvalidTokens {
    @PrimaryColumn()
    token: string;

    @PrimaryColumn()
    @Index()
    elementId: string;

    @Column({ type: "timestamp" })
    expiration: Date;
}
