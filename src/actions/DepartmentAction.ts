import axios, { AxiosResponse } from "axios";
import ApiServicePath from "../enums/ApiServicePath";
import IDepartment from "../interfaces/Department";
import { API_URL } from "../settings";

export const getDepartments = async (): Promise<
  AxiosResponse<IDepartment[]>
> => {
  return axios.get(`${API_URL}/${ApiServicePath.Department}`);
};

export const getDepartment = async (
  id: number
): Promise<AxiosResponse<IDepartment>> => {
  return axios.get(`${API_URL}/${ApiServicePath.Department}/${id}`);
};

export const deleteDepartment = async (
  id: number
): Promise<AxiosResponse<IDepartment>> => {
  return axios.delete(`${API_URL}/${ApiServicePath.Department}/${id}`);
};

export const createDepartmentApi = async (
  department: IDepartment
): Promise<AxiosResponse<IDepartment>> => {
  return axios.post(`${API_URL}/${ApiServicePath.Department}`, department);
};

export const updateDepartment = async (
  id: number,
  department: IDepartment
): Promise<AxiosResponse<IDepartment>> => {
  return axios.patch(
    `${API_URL}/${ApiServicePath.Department}/${id}`,
    department
  );
};
