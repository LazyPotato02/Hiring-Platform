import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {getTechJobs} from "../../api/jobs.tsx";

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
        <div>
            <h2>Available Jobs</h2>
            {jobs.length === 0 ? (
                <p>No jobs found.</p>
            ) : (
                <ul>
                    {jobs.map((job) => (
                        <li key={job.id}>
                            <h3>{job.title}</h3>
                            <p>{job.description}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}