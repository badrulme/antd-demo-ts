import axios, { AxiosResponse } from "axios";
import ApiServicePath from "../enums/ApiServicePath";
import ITransactionType from "../interfaces/TransactionType";
import { API_URL } from "../settings";

export const getTransactionTypes = async (): Promise<
  AxiosResponse<ITransactionType[]>
> => {
  return axios.get(`${API_URL}/${ApiServicePath.TransactionType}`);
};

export const getTransactionType = async (
  id: number
): Promise<AxiosResponse<ITransactionType>> => {
  return axios.get(`${API_URL}/${ApiServicePath.TransactionType}/${id}`);
};

export const deleteTransactionType = async (
  id: number
): Promise<AxiosResponse<ITransactionType>> => {
  return axios.delete(`${API_URL}/${ApiServicePath.TransactionType}/${id}`);
};

export const createTransactionTypeApi = async (
  transactionType: ITransactionType
): Promise<AxiosResponse<ITransactionType>> => {
  return axios.post(
    `${API_URL}/${ApiServicePath.TransactionType}`,
    transactionType
  );
};

export const updateTransactionType = async (
  id: number,
  transactionType: ITransactionType
): Promise<AxiosResponse<ITransactionType>> => {
  return axios.patch(
    `${API_URL}/${ApiServicePath.TransactionType}/${id}`,
    transactionType
  );
};
