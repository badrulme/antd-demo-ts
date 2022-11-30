import axios, { AxiosResponse } from "axios";
import ApiServicePath from "../enums/ApiServicePath";
import ICustomer from "../interfaces/Customer";
import { API_URL } from "../settings";

export const getCustomers = async (): Promise<AxiosResponse<ICustomer[]>> => {
  return axios.get(`${API_URL}/${ApiServicePath.Customer}`);
};

export const getCustomer = async (
  id: number
): Promise<AxiosResponse<ICustomer>> => {
  return axios.get(`${API_URL}/${ApiServicePath.Customer}/${id}`);
};

export const deleteCustomer = async (
  id: number
): Promise<AxiosResponse<ICustomer>> => {
  return axios.delete(`${API_URL}/${ApiServicePath.Customer}/${id}`);
};

export const createCustomerApi = async (
  customer: ICustomer
): Promise<AxiosResponse<ICustomer>> => {
  return axios.post(`${API_URL}/${ApiServicePath.Customer}`, customer);
};

export const updateCustomer = async (
  id: number,
  customer: ICustomer
): Promise<AxiosResponse<ICustomer>> => {
  return axios.patch(`${API_URL}/${ApiServicePath.Customer}/${id}`, customer);
};
