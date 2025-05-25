import axiosInstance from "../interceptors/auth.interceptor";

const API_URL = "http://localhost:8000/job";


export async function getTechStacks() {
    const response = await axiosInstance.get(`${API_URL}/tech-categories/`,
        {withCredentials: true}
    );
    return response.data;
}


export async function getTechJobs(techName: string | undefined) {
    const response = await axiosInstance.get(`${API_URL}/get-techstack-jobs/${techName}`, {withCredentials: true});
    return response.data;
}