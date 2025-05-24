import axios from "axios";

const API_URL = "http://localhost:8000/job";


export async function getTechStacks() {
    const response = await axios.get(`${API_URL}/tech-categories/`,
        {withCredentials: true}
    );
    return response.data;
}


export async function getTechJobs(techName: string | undefined) {
    const response = await axios.get(`${API_URL}/get-techstack-jobs/${techName}`, {withCredentials: true});
    return response.data;
}