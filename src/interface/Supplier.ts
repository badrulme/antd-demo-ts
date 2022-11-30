interface ISupplier {
    id: number;
    code: string;
    name: string;
    openingBalance: number;
    openingDate: Date;
    companyName: string;
    description: string;
    address: string;
    email: string;
    gender: string;
    contactPersonName: string;
    contactPersonPhone: string;
    remarks: string;
    activeStatus: boolean;
    mobile1: string;
    mobile2: string;
    createdDate: Date;
    lastModifiedDate: Date;
}

export default ISupplier;