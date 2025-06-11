import axiosInstance from "../interceptors/auth.interceptor";
import type {JobFormData} from "../components/AddJobPage/AddJobPage.tsx";
import type {Job} from "../types/job.ts";

const API_URL = "http://localhost:8000/job";


export async function getTechStacks() {
    const response = await axiosInstance.get(`${API_URL}/tech-categories/`,
        {withCredentials: true}
    );
    return response.data;
}

export async function createJob(data: JobFormData) {
    const response = await axiosInstance.post(`${API_URL}/`, data, {withCredentials: true});
    return response.data;
}
export async function updateJob(id: number, updatedJob: {
    title: string;
    description: string;
    is_active: boolean;
    tech_stack_ids: number[]
}): Promise<Job> {
    const res = await axiosInstance.put(`${API_URL}/detail/${id}/`, updatedJob, {
        withCredentials: true,
    });
    return res.data;
}


export async function fetchPaginatedJobs(page: number = 1, limit: number = 5, search: string = "") {
    const response = await axiosInstance.get(`${API_URL}/jobs/`, {
        params: {
            page,
            limit,
            search,
            ordering: '-posted_at',
        },
    });
    return response.data;
}


export async function fetchTechStackJobsPaginated(
    techName: string,
    page: number = 1,
    limit: number = 5,
    search: string = ""
) {
    const response = await axiosInstance.get(`${API_URL}/jobs/tech/${techName}/`, {
        params: {
            page,
            limit,
            search,
            ordering: '-posted_at',
        },
    });
    return response.data;
}


export async function getJobById(id: string | undefined) {

    const response = await axiosInstance.get(`${API_URL}/search/${id}`, {})

    return response.data;
}

export async function fetchUserJobs(userId: number) {
    const res = await fetch(`${API_URL}/my-jobs/${userId}/`, {
        credentials: 'include',
    });

    if (!res.ok) {
        throw new Error("Failed to fetch user's jobs");
    }

    return await res.json();
}

export async function deleteJob(jobId: number): Promise<void> {
    await axiosInstance.delete(`${API_URL}/detail/${jobId}/`);
}