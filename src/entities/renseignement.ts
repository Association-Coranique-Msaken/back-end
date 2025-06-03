import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user";
import { AbstractEntity } from "./abstractEntity";
import { Filterable } from "../filters/annotations";
import { DtoField } from "../DTOs/dtoEngine";
import { Validators } from "../DTOs/validators";
import { Dto } from "../DTOs/dto";

export enum NiveauScolaire {
    PRIMAIRE = "primaire",
    COLLEGE = "college",
    LYCEE = "lycee",
    UNIVERSITAIRE = "universitaire",
}

export enum TypeDiplome {
    BAC = "bac",
    LICENCE = "licence",
    MASTER = "master",
    DOCTORAT = "doctorat",
    AUTRE = "autre",
}

@Entity({ name: "renseignement" })
export class Renseignement extends AbstractEntity {
    @ManyToOne(() => User)
    @JoinColumn({ name: "id_user" })
    user: User;

    @Filterable()
    @DtoField({ dto: [Dto.createRenseignement, Dto.updateRenseignement], validator: Validators.TEXT })
    @Column()
    adresse: string;

    @Filterable()
    @DtoField({ dto: [Dto.createRenseignement, Dto.updateRenseignement], validator: Validators.TEXT })
    @Column()
    profession: string;

    @Filterable()
    @DtoField({
        dto: [Dto.createRenseignement, Dto.updateRenseignement],
        validator: Validators.ONE_OF(...Object.values(NiveauScolaire)),
    })
    @Column({
        type: "enum",
        enum: NiveauScolaire,
        default: NiveauScolaire.PRIMAIRE,
    })
    niveau_scol: NiveauScolaire;

    @Filterable()
    @DtoField({
        dto: [Dto.createRenseignement, Dto.updateRenseignement],
        validator: Validators.ONE_OF(...Object.values(TypeDiplome)),
    })
    @Column({
        type: "enum",
        enum: TypeDiplome,
        default: TypeDiplome.AUTRE,
    })
    diplome: TypeDiplome;

    @Filterable()
    @DtoField({ dto: [Dto.createRenseignement, Dto.updateRenseignement], validator: Validators.TEXT })
    @Column()
    specialite: string;

    @Column({ nullable: true })
    document: string;

    @Filterable()
    @DtoField({ dto: [Dto.createRenseignement, Dto.updateRenseignement], validator: Validators.NUM })
    @Column()
    nbr_hezb: number;

    @Column({ nullable: true })
    excellent: string;

    @Column({ nullable: true })
    dessus_moyen: string;

    @Column({ nullable: true })
    moyen: string;

    @Column({ type: "datetime" })
    date_enreg: Date;

    @Column({ default: false })
    statut: boolean;

    @Column({ default: false })
    isValidated: boolean;
}
