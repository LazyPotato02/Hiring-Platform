import './PostedJobsPage.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
import {getTechColor, techIconMap} from "../assets/icons-style.tsx";
import {useAuth} from "../auth/AuthContect.tsx";
import {fetchUserJobs} from "../api/jobs.tsx";

type TechStack = {
    id: number;
    name: string;
    slug: string;
};

type Job = {
    id: number;
    title: string;
    description: string;
    tech_stack: TechStack[];
};

function MyJobsPage() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState<Job[]>([]);

    useEffect(() => {
        if (!user) return;

        const loadJobs = async () => {
            try {
                const res = await fetchUserJobs(user.id);
                setJobs(res);
            } catch (err) {
                console.error('Failed to fetch user jobs', err);
            }
        };

        loadJobs();
    }, [user]);

    const TechIcon = ({ tech }: { tech: string }) => {
        const key = tech.toLowerCase();
        if (key === 'java') {
            return <FaJava title="Java" style={{ marginRight: '0.5rem', color: '#007396' }} />;
        }

        const iconKey = techIconMap[key] as keyof typeof Icons;
        const Icon = Icons[iconKey];

        return Icon ? (
            <Icon title={tech} style={{ marginRight: '0.5rem', color: getTechColor(key) }} />
        ) : (
            <span>{tech}</span>
        );
    };

    return (
        <div className="my-jobs-container">
            <h2 className="my-jobs-title">🧑‍💻 My Posted Jobs</h2>

            {jobs.length === 0 ? (
                <p className="my-jobs-empty">You haven't posted any jobs yet.</p>
            ) : (
                <ul className="my-jobs-list">
                    {jobs.map((job) => (
                        <Link to={`/jobs/search/${job.id}`} key={job.id}>
                            <li className="my-job-card">
                                <h3>{job.title}</h3>
                                <p>{job.description}</p>
                                <div className="my-job-techs">
                                    {job.tech_stack.map((tech) => (
                                        <TechIcon key={tech.id} tech={tech.slug} />
                                    ))}
                                </div>
                            </li>
                        </Link>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default MyJobsPage;
