import IJobTitle from "./JobTitle";
import IDepartment from "./Department";

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