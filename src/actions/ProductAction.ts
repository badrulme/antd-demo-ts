import axios, { AxiosResponse } from "axios";
import ApiServicePath from "../enums/ApiServicePath";
import IProduct from "../interfaces/Product";
import { API_URL } from "../settings";

export const getProducts = async (): Promise<AxiosResponse<IProduct[]>> => {
  return axios.get(`${API_URL}/${ApiServicePath.Product}`);
};

export const getProduct = async (
  id: number
): Promise<AxiosResponse<IProduct>> => {
  return axios.get(`${API_URL}/${ApiServicePath.Product}/${id}`);
};

export const deleteProduct = async (
  id: number
): Promise<AxiosResponse<IProduct>> => {
  return axios.delete(`${API_URL}/${ApiServicePath.Product}/${id}`);
};

export const createProductApi = async (
  product: IProduct
): Promise<AxiosResponse<IProduct>> => {
  return axios.post(`${API_URL}/${ApiServicePath.Product}`, product);
};

export const updateProduct = async (
  id: number,
  product: IProduct
): Promise<AxiosResponse<IProduct>> => {
  return axios.patch(`${API_URL}/${ApiServicePath.Product}/${id}`, product);
};
