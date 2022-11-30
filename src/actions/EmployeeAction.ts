import axios, { AxiosResponse } from "axios";
import ApiServicePath from "../enums/ApiServicePath";
import IEmployee from "../interfaces/Employee";
import { API_URL } from "../settings";

export const getEmployees = async (): Promise<AxiosResponse<IEmployee[]>> => {
  return axios.get(`${API_URL}/${ApiServicePath.Employee}`);
};

export const getEmployee = async (
  id: number
): Promise<AxiosResponse<IEmployee>> => {
  return axios.get(`${API_URL}/${ApiServicePath.Employee}/${id}`);
};

export const deleteEmployee = async (
  id: number
): Promise<AxiosResponse<IEmployee>> => {
  return axios.delete(`${API_URL}/${ApiServicePath.Employee}/${id}`);
};

export const createEmployeeApi = async (
  employee: IEmployee
): Promise<AxiosResponse<IEmployee>> => {
  return axios.post(`${API_URL}/${ApiServicePath.Employee}`, employee);
};

export const updateEmployee = async (
  id: number,
  employee: IEmployee
): Promise<AxiosResponse<IEmployee>> => {
  return axios.patch(`${API_URL}/${ApiServicePath.Employee}/${id}`, employee);
};
