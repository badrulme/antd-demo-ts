interface ITransactionType {
    id: number;
    name: string;
    alias: string;
    description: string;
    transactionFlow: string;
    createdDate: string;
    lastModifiedDate: string;
}

export default ITransactionType;