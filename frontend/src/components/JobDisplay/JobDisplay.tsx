import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {getTechJobs} from "../../api/jobs.tsx";
import './JobDisplay.css'
type Job = {
    id: number;
    title: string;
    description: string;
};
export function JobDisplay() {
    const {techName} = useParams();
    const [jobs, setJobs] = useState<Job[]>([]);

    useEffect(() => {
        const fetchTechStackJobs = async () => {
            try {
                const res = await getTechJobs(techName);
                setJobs(res);
            } catch (error) {
                console.error("Error loading tech stack jobs:", error);
            }
        };

        if (techName) {
            fetchTechStackJobs();
        }
    }, [techName]);

    return (
        <div className="job-list-container">
            <h2 className="job-list-title">Available Jobs</h2>

            {jobs.length === 0 ? (
                <p className="job-empty">No jobs found.</p>
            ) : (
                <ul className="job-list">
                    {jobs.map((job) => (
                        <li className="job-card" key={job.id}>
                            <h3 className="job-title">{job.title}</h3>
                            <p className="job-description">{job.description}</p>
                        </li>
                    ))}
                </ul>
            )}

            {/*<Pagination*/}
            {/*    currentPage={currentPage}*/}
            {/*    totalPages={totalPages}*/}
            {/*    onPageChange={onPageChange}*/}
            {/*/>*/}
        </div>

    );
}