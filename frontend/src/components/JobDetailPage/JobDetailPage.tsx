import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {getJobById} from "../../api/jobs.tsx";
import type {Job} from "../../types/job.ts";
import './JobDetailPage.css'
import ApplyForJobPopUp from "../ApplyForJobPage/ApplyForJobPopUp.tsx";
import {getApplicationStatus} from "../../api/jobApplications.tsx";
import {useAuth} from "../../auth/AuthContect.tsx";
import EditJobPopUp from "../EditJobPopUp/EditJobPopUp.tsx";
import axios from "axios";

function JobDetailPage() {
    const {id} = useParams();
    const {user} = useAuth()
    const [job, setJob] = useState<Job | null>(null)
    const [isOpenApplyForm, setIsOpenApplyForm] = useState<boolean>(false)
    const [alreadyApplied, setAlreadyApplied] = useState<boolean>(false);
    const [isOpenEditForm, setIsOpenEditForm] = useState<boolean>(false);
    const navigate = useNavigate()
    useEffect(() => {
        const loadJob = async () => {
            try {
                const res = await getJobById(id);
                setJob(res);
                const applied = await getApplicationStatus(res.id);
                setAlreadyApplied(applied);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 404) {
                        navigate("/");
                    } else {
                        console.error("API error:", error.message);
                    }
                } else {
                    console.error("Unexpected error:", error);
                }
            }
        }

        loadJob()

    }, [id])

    if (!job) return <p style={{padding: "1rem"}}>Loading...</p>;

    const postedDate = new Date(job.posted_at).toLocaleDateString();

    const openApplyForm = () => {
        setIsOpenApplyForm(true);
    }
    const openEditForm = () => {
        setIsOpenEditForm(true);
    }

    const handleJobUpdate = (updatedJob: Job) => {
        setJob(updatedJob);
        setIsOpenEditForm(false);
    };
    return (
        <div className="job-container">
            <div className="job-title-wrapper">
                <h1 className="job-title">{job.title}</h1>
                {user && !alreadyApplied && user.id !== job.created_by && (
                    <button onClick={openApplyForm}>Apply For Job</button>
                )}
                {user && user.id == job.created_by && (
                    <button onClick={openEditForm}> Edit</button>
                )}
                {alreadyApplied && (
                    <p style={{ color: 'green', fontWeight: 'bold' }}>✅ You have already applied for this job.</p>
                )}
            </div>

            <p className="job-date">📅 Posted on: {postedDate}</p>

            <div>
                <h3 className="job-section-title">Tech Stack:</h3>
                <div className="tech-list">
                    {job.tech_stack.map((tech) => (
                        <span key={tech.id} className="tech-badge">{tech.name}</span>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="job-section-title">Job Description:</h3>
                <p className="job-description">{job.description}</p>
            </div>

            <p className="job-status">
                Status:{" "}
                <strong style={{color: job.is_active ? "green" : "red"}}>
                    {job.is_active ? "Active" : "Inactive"}
                </strong>
            </p>
            {isOpenApplyForm && (
                <div className="popup-backdrop">
                    <ApplyForJobPopUp jobId={job.id} onClose={() => setIsOpenApplyForm(false)} onSuccess={() => {
                        setAlreadyApplied(true);
                        setIsOpenApplyForm(false);
                    }} />
                </div>
            )}
            {isOpenEditForm && (
                <div className="popup-backdrop">
                    <EditJobPopUp
                        job={job}
                        onClose={() => setIsOpenEditForm(false)}
                        onSave={handleJobUpdate}
                    />
                </div>
            )}
        </div>

    );
}

export default JobDetailPage;