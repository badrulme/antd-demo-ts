import ListOperationType from "../enums/ListOperationType";
import IProduct from "./Product";
import ITransaction from "./Transaction";

interface ITransactionItem {
  id: number | null;
  transaction: ITransaction | null;
  productId: number;
  product: IProduct | null | undefined;
  salePrice: number;
  receiveQuantity: number;
  issueQuantity: number;
  listOperationType: ListOperationType | null;

  createdDate: Date | null;
  lastModifiedDate: Date | null;
}

export default ITransactionItem;
