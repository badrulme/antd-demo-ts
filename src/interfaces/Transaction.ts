import ITransactionItem from "./TransactionItem";

interface ITransaction {
  id: number | null;
  code: string | null;
  date: Date;
  description: string;
  postingStatus: boolean;
  transactionTypeId: number;
  customerId: number | null;
  supplierId: number | null;
  paymentMethod: string | null;
  invoiceAmount: number | null;
  discountAmount: number | null;
  actualAmount: number | null;
  paidAmount: number | null;
  dueAmount: number | null;
  transactionItems: ITransactionItem[];

  createdDate: Date | null;
  lastModifiedDate: Date | null;
}

export default ITransaction;
