import ITransactionItem from "./TransactionItem";

interface ITransaction {
  id: number;
  code: string;
  date: Date;
  description: string;
  postingStatus: boolean;
  transactionTypeId: number;
  customerId: number;
  //   paymentMethod: PaymentMethod;
  paymentMethod: string;
  invoiceAmount: number;
  discountAmount: number;
  actualAmount: number;
  paidAmount: number;
  dueAmount: number;
  transactionItems: ITransactionItem[];

  createdDate: Date;
  lastModifiedDate: Date;
}

export default ITransaction;
