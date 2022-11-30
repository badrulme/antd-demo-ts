import { AxiosResponse } from "axios";
import axios from 'axios';
import { API_URL } from "../settings";
import ApiServicePath from "../enums/ApiServicePath";
import IUom from "../interface/Uom";

export const getUoms = async (): Promise<AxiosResponse<IUom[]>> => {
    return axios.get(
        `${API_URL}/${ApiServicePath.Uom}`,
    );
};


export const getUom = async (
    id: number,
): Promise<AxiosResponse<IUom>> => {
    return axios.get(
        `${API_URL}/${ApiServicePath.Uom}/${id}`,
    );
};

export const deleteUom = async (
    id: number,
): Promise<AxiosResponse<IUom>> => {
    return axios.delete(
        `${API_URL}/${ApiServicePath.Uom}/${id}`,
    );
};

export const createUom = async (
    uom: IUom,
): Promise<AxiosResponse<IUom>> => {
    return axios.post(
        `${API_URL}/${ApiServicePath.Uom}`,
        uom,
    );
};


export const updateUom = async (
    id: number,
    uom: IUom,
): Promise<AxiosResponse<IUom>> => {
    return axios.patch(
        `${API_URL}/${ApiServicePath.Uom}/${id}`,
        uom
    );
};