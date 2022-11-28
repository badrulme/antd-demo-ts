import { AxiosResponse } from "axios";
import axios from 'axios';
import { API_URL } from "../settings";
import ApiServicePath from "../enums/ApiServicePath";
import IUom from "../interfaces/Uom";

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