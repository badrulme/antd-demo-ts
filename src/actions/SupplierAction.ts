import axios, { AxiosResponse } from "axios";
import ApiServicePath from "../enums/ApiServicePath";
import ISupplier from "../interfaces/Supplier";
import { API_URL } from "../settings";

export const getSuppliers = async (): Promise<AxiosResponse<ISupplier[]>> => {
  return axios.get(`${API_URL}/${ApiServicePath.Supplier}`);
};

export const getSupplier = async (
  id: number
): Promise<AxiosResponse<ISupplier>> => {
  return axios.get(`${API_URL}/${ApiServicePath.Supplier}/${id}`);
};

export const deleteSupplier = async (
  id: number
): Promise<AxiosResponse<ISupplier>> => {
  return axios.delete(`${API_URL}/${ApiServicePath.Supplier}/${id}`);
};

export const createSupplierApi = async (
  supplier: ISupplier
): Promise<AxiosResponse<ISupplier>> => {
  return axios.post(`${API_URL}/${ApiServicePath.Supplier}`, supplier);
};

export const updateSupplier = async (
  id: number,
  supplier: ISupplier
): Promise<AxiosResponse<ISupplier>> => {
  return axios.patch(`${API_URL}/${ApiServicePath.Supplier}/${id}`, supplier);
};
