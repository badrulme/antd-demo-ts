import IProduct from "./Product";
import ITransaction from "./Transaction";

interface ITransactionItem {
  transaction: ITransaction | null;
  productId: number;
  product: IProduct | null | undefined;
  salePrice: number;
  receiveQuantity: number;
  issueQuantity: number;

  createdDate: Date | null;
  lastModifiedDate: Date | null;
}

export default ITransactionItem;
