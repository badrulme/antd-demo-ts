import IDepartment from "./Department";
import IJobTitle from "./JobTitle";


interface IEmployee {
    id: number;
    code: string;
    firstName: string;
    lastName: string;
    emailOfficial: string;
    emailPersonal: string;
    phonePersonal: string;
    phoneOfficial: string;
    presentAddress: string;
    permanentAddress: string;
    dob: Date;
    bloodGroup: string;
    jobTitleId: number;
    jobTitle: IJobTitle;
    departmentId: number;
    department: IDepartment;

    gender: string;
    activeStatus: boolean;
    createdDate: Date;
    lastModifiedDate: Date;
}

export default IEmployee;