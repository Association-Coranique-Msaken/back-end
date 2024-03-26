import { Column, CreateDateColumn, Entity, Index, IsNull, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "user" })
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Index()
    @Column({ unique: true })
    identifier: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ nullable: true, default: null })
    fatherFirstName: string;

    @Column({ nullable: true, default: null })
    grandFatherFirstName: string;

    @Column({ nullable: true, default: null })
    motherFirstName: string;

    @Column({ nullable: true, default: null })
    motherLastName: string;

    @Column()
    birthDate: Date;

    @Column({ nullable: true, default: null })
    birthPlace: string;

    @Column({ nullable: true, default: null })
    phoneNumber: string;

    @Column({ nullable: true, default: null })
    fatherPhoneNumber: string;

    @Column({ nullable: true, default: null })
    motherPhoneNumber: string;

    @Column({
        type: "enum",
        enum: ["male", "female"],
    })
    gender: string;

    @Column({ nullable: true, default: null })
    cin: string;

    @Column({ default: false })
    hasNationalIDcard: boolean;

    @Column({ default: false })
    hasGuaranteedBirthCertificate: boolean;

    @Column({ default: false })
    isDeleted: boolean;

    @Column({ default: false })
    hasPassport: boolean;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date;
}
