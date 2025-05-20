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