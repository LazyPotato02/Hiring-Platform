import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {getJobById} from "../../api/jobs.tsx";
import type {Job} from "../../types/job.ts";
import './JobDetailPage.css'
import ApplyForJobPopUp from "../ApplyForJobPage/ApplyForJobPopUp.tsx";
import {getApplicationStatus} from "../../api/jobApplications.tsx";
import {useAuth} from "../../auth/AuthContect.tsx";

function JobDetailPage() {
    const {id} = useParams();
    const {user} = useAuth()
    const [job, setJob] = useState<Job | null>(null)
    const [isOpenApplyForm, setIsOpenApplyForm] = useState<boolean>(false)
    const [alreadyApplied, setAlreadyApplied] = useState<boolean>(false);
    useEffect(() => {
        const loadJob = async () => {
            try {
                const res = await getJobById(id);
                setJob(res);
                const applied = await getApplicationStatus(res.id);
                setAlreadyApplied(applied);
            } catch (e) {
                console.error(`Error while loading job: ${e}`);
            }
        }

        loadJob()

    }, [id])

    if (!job) return <p style={{padding: "1rem"}}>Loading...</p>;

    const postedDate = new Date(job.posted_at).toLocaleDateString();

    const openApplyForm = () => {
        setIsOpenApplyForm(true);
    }

    return (
        <div className="job-container">
            <div className="job-title-wrapper">
                <h1 className="job-title">{job.title}</h1>
                {user && !alreadyApplied && user.id !== job.created_by && (
                    <button onClick={openApplyForm}>Apply For Job</button>
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
        </div>

    );
}

export default JobDetailPage;