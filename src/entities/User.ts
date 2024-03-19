import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "user" })
export class User {
    @PrimaryGeneratedColumn()
    id: string;

    @Index({ unique: true })
    @Column({ unique: true })
    identifier: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    fatherName: string;

    @Column()
    grandFatherName: string;

    @Column()
    motherFirstName: string;

    @Column()
    motherLastName: string;

    @Column()
    birthDate: Date;

    @Column()
    birthPlace: string;

    @Column()
    phoneNumber: string;

    @Column()
    fatherPhoneNumber: string;

    @Column()
    motherPhoneNumber: string;

    @Column()
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
