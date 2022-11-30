interface ICustomer {
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
    remarks: string;
    activeStatus: boolean;
    mobile1: string;
    mobile2: string;
    createdDate: Date;
    lastModifiedDate: Date;
}

export default ICustomer;