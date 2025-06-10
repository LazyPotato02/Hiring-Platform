import axiosInstance from "../interceptors/auth.interceptor";
import type {AxiosError} from "axios";

const API_URL = "http://localhost:8000/users";

export const getCurrentUser = async () => {
    try {
        const response = await axiosInstance.get("/users/me/");
        return response.data;
    } catch (err) {
        const error = err as AxiosError;

        if (!error.response) {
            console.error("Unknown error:", error);
            return null;
        }

        if (error.response.status === 401) {
            return null;
        }

        throw error;
    }
};


export async function loginApi(email: string, password: string) {
    const response = await axiosInstance.post(`${API_URL}/login/`, {
        email,
        password,

    }, {withCredentials: true});
    return response.data;
}

export async function registerApi(email: string, first_name: string, last_name: string, password: string, role: string) {
    const response = await axiosInstance.post(`${API_URL}/register/`, {
        email,
        first_name,
        last_name,
        password,
        role,

    }, {withCredentials: true});
    return response.data;
}


export async function logoutApi() {
    const response = await axiosInstance.post(`${API_URL}/logout/`, {},{withCredentials: true});
    return response.data;
}

export async function updateUserProfile(data: {
    first_name: string;
    last_name: string;
    email: string;
}) {
    const res = await axiosInstance.put(`${API_URL}/update-profile/`, data, { withCredentials: true });
    return res.data;
}

export async function changeUserPassword(data: {
    current_password: string;
    new_password: string;
}) {
    const res = await axiosInstance.post(`${API_URL}/change-password/`, data, { withCredentials: true });
    return res.data;
}