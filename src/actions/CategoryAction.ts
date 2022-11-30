import axios, { AxiosResponse } from "axios";
import ApiServicePath from "../enums/ApiServicePath";
import ICategory from "../interfaces/Category";
import { API_URL } from "../settings";

export const getCategories = async (): Promise<AxiosResponse<ICategory[]>> => {
  return axios.get(`${API_URL}/${ApiServicePath.Category}`);
};

export const getCategory = async (
  id: number
): Promise<AxiosResponse<ICategory>> => {
  return axios.get(`${API_URL}/${ApiServicePath.Category}/${id}`);
};

export const deleteCategory = async (
  id: number
): Promise<AxiosResponse<ICategory>> => {
  return axios.delete(`${API_URL}/${ApiServicePath.Category}/${id}`);
};

export const createCategoryApi = async (
  category: ICategory
): Promise<AxiosResponse<ICategory>> => {
  return axios.post(`${API_URL}/${ApiServicePath.Category}`, category);
};

export const updateCategory = async (
  id: number,
  category: ICategory
): Promise<AxiosResponse<ICategory>> => {
  return axios.patch(`${API_URL}/${ApiServicePath.Category}/${id}`, category);
};
