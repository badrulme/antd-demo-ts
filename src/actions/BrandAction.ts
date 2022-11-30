import axios, { AxiosResponse } from "axios";
import ApiServicePath from "../enums/ApiServicePath";
import IBrand from "../interfaces/Brand";
import { API_URL } from "../settings";

export const getBrands = async (): Promise<AxiosResponse<IBrand[]>> => {
  return axios.get(`${API_URL}/${ApiServicePath.Brand}`);
};

export const getBrand = async (id: number): Promise<AxiosResponse<IBrand>> => {
  return axios.get(`${API_URL}/${ApiServicePath.Brand}/${id}`);
};

export const deleteBrand = async (
  id: number
): Promise<AxiosResponse<IBrand>> => {
  return axios.delete(`${API_URL}/${ApiServicePath.Brand}/${id}`);
};

export const createBrandApi = async (
  brand: IBrand
): Promise<AxiosResponse<IBrand>> => {
  return axios.post(`${API_URL}/${ApiServicePath.Brand}`, brand);
};

export const updateBrand = async (
  id: number,
  brand: IBrand
): Promise<AxiosResponse<IBrand>> => {
  return axios.patch(`${API_URL}/${ApiServicePath.Brand}/${id}`, brand);
};
