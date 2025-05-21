import axios from "axios";
import type {User} from "../auth/AuthContect.tsx";

const API_URL = "http://localhost:8000/users"; // смени с реалния backend адрес

export async function getCurrentUser(token: string): Promise<User> {
    const response = await axios.get(`${API_URL}/me/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}


export async function loginApi(email: string, password: string) {
    const response = await axios.post(`${API_URL}/login/`, {
        email,
        password,

    }, {withCredentials: true});
    return response.data;
}

export async function registerApi(email: string, first_name: string, last_name: string, password: string, role: string) {
    const response = await axios.post(`${API_URL}/register/`, {
        email,
        first_name,
        last_name,
        password,
        role,

    }, {withCredentials: true});
    return response.data;
}

export async function logoutApi(accessToken: string | null, refreshToken: string | null) {
    const response = await axios.post(`${API_URL}/logout/`, {
        refreshToken,
    }, {
        withCredentials: true, headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
}