import IBrand from "./Brand";
import ICategory from "./Category";
import IUom from "./Uom";

interface IProduct {
    id: number;
    code: string;
    name: string;
    summary: string;
    description: string;
    uomId: number;
    uom: IUom;
    categoryId: number;
    category: ICategory;
    brandId: number;
    brand: IBrand;
    activeStatus: boolean;
    createdDate: Date;
    lastModifiedDate: Date;
}

export default IProduct;