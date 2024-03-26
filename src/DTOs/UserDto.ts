export interface CreateUserDto {
    firstName: string;
    lastName: string;
    fatherFirstName?: string;
    grandFatherFirstName?: string;
    motherFirstName?: string;
    motherLastName?: string;
    birthDate: Date;
    birthPlace?: string;
    phoneNumber?: string;
    fatherPhoneNumber?: string;
    motherPhoneNumber?: string;
    gender?: string;
    cin?: string;
    hasNationalIDcard?: boolean;
    hasGuaranteedBirthCertificate?: boolean;
    isDeleted?: boolean;
    hasPassport?: boolean;
}
export interface UpdateUserDto {
    id: string;
    identifier?: string;
    firstName?: string;
    lastName?: string;
    fatherFirstName?: string;
    grandFatherFirstName?: string;
    motherFirstName?: string;
    motherLastName?: string;
    birthDate?: Date;
    birthPlace?: string;
    phoneNumber?: string;
    fatherPhoneNumber?: string;
    motherPhoneNumber?: string;
    gender?: string;
    cin?: string;
    hasNationalIDcard?: boolean;
    hasGuaranteedBirthCertificate?: boolean;
    isDeleted?: boolean;
    hasPassport?: boolean;
}
