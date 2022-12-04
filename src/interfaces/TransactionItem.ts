import ITransaction from "./Transaction";

interface ITransactionItem {
  transaction: ITransaction;
  productId: number;
  salePrice: number;
  receiveQuantity: number;
  issueQuantity: number;

  createdDate: Date;
  lastModifiedDate: Date;
}

export default ITransactionItem;
