import axiosInstance from "../interceptors/auth.interceptor.ts";


const API_URL = "http://localhost:8000/applications";


export async function applyForJob(formData: FormData) {
    const response = await axiosInstance.post(`${API_URL}/apply/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'

        },withCredentials: true
    });

    return response.data;
}
