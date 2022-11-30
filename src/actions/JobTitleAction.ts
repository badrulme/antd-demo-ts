import axios, { AxiosResponse } from "axios";
import ApiServicePath from "../enums/ApiServicePath";
import IJobTitle from "../interfaces/JobTitle";
import { API_URL } from "../settings";

export const getJobTitles = async (): Promise<AxiosResponse<IJobTitle[]>> => {
  return axios.get(`${API_URL}/${ApiServicePath.JobTitle}`);
};

export const getJobTitle = async (
  id: number
): Promise<AxiosResponse<IJobTitle>> => {
  return axios.get(`${API_URL}/${ApiServicePath.JobTitle}/${id}`);
};

export const deleteJobTitle = async (
  id: number
): Promise<AxiosResponse<IJobTitle>> => {
  return axios.delete(`${API_URL}/${ApiServicePath.JobTitle}/${id}`);
};

export const createJobTitleApi = async (
  jobTitle: IJobTitle
): Promise<AxiosResponse<IJobTitle>> => {
  return axios.post(`${API_URL}/${ApiServicePath.JobTitle}`, jobTitle);
};

export const updateJobTitle = async (
  id: number,
  jobTitle: IJobTitle
): Promise<AxiosResponse<IJobTitle>> => {
  return axios.patch(`${API_URL}/${ApiServicePath.JobTitle}/${id}`, jobTitle);
};
