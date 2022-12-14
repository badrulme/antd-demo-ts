import axios, { AxiosResponse } from "axios";
import ApiServicePath from "../enums/ApiServicePath";
import ITransaction from "../interfaces/Transaction";
import ITransactionBasic from "../interfaces/TransactionBasic";
import { API_URL } from "../settings";

export const getTransactions = async (): Promise<AxiosResponse<ITransaction[]>> => {
    console.log(`${API_URL}`);
    
  return axios.get(`${API_URL}/${ApiServicePath.Transaction}`);
};

export const getTransactionBasicList = async (transactionTypeId: Number): Promise<AxiosResponse<ITransactionBasic[]>> => {
  
  return axios.get(`${API_URL}/${ApiServicePath.Transaction}/basic-list?transactionTypeId=${transactionTypeId}`);
};


export const getTransaction = async (id: number): Promise<AxiosResponse<ITransaction>> => {
  return axios.get(`${API_URL}/${ApiServicePath.Transaction}/${id}`);
};

export const deleteTransaction = async (id: number): Promise<AxiosResponse<ITransaction>> => {
  return axios.delete(`${API_URL}/${ApiServicePath.Transaction}/${id}`);
};

export const createTransactionApi = async (transaction: ITransaction): Promise<AxiosResponse<ITransaction>> => {
  return axios.post(`${API_URL}/${ApiServicePath.Transaction}`, transaction);
};

export const updateTransaction = async (
  id: number,
  transaction: ITransaction
): Promise<AxiosResponse<ITransaction>> => {
  return axios.patch(`${API_URL}/${ApiServicePath.Transaction}/${id}`, transaction);
};
