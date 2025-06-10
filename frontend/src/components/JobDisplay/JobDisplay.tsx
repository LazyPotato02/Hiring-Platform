import {useEffect, useState} from "react";
import {Link, useParams, useSearchParams} from "react-router-dom";
import {fetchPaginatedJobs, fetchTechStackJobsPaginated} from "../../api/jobs";
import Pagination from "../Pagination/Pagination";
import './JobDisplay.css';
import * as Icons from 'react-icons/si';
import {FaJava} from 'react-icons/fa';
import {getTechColor, techIconMap} from "../../assets/icons-style.tsx";

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


export function JobDisplay() {
    const {techName} = useParams();
    const [searchParams] = useSearchParams();
    const search = searchParams.get("search") || "";

    const [jobs, setJobs] = useState<Job[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const loadJobs = async () => {
            try {
                const res = techName
                    ? await fetchTechStackJobsPaginated(techName, currentPage, 5, search)
                    : await fetchPaginatedJobs(currentPage, 5, search);

                setJobs(res.results);
                setCurrentPage(res.current_page);
                setTotalPages(res.total_pages);
            } catch (error) {
                console.error("Failed to load jobs:", error);
            }
        };

        loadJobs();
    }, [techName, currentPage, search]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const TechIcon = ({tech}: { tech: string }) => {
        const key = tech.toLowerCase();

        if (key === 'java') {
            return <FaJava title="Java" style={{marginRight: '0.5rem', color: '#007396'}}/>;
        }

        const iconKey = techIconMap[key] as keyof typeof Icons;
        const Icon = Icons[iconKey];

        return Icon ? (
            <Icon
                title={tech}
                style={{
                    marginRight: '0.5rem',
                    color: getTechColor(key),
                }}
            />
        ) : (
            <span>{tech}</span>
        );
    };

    return (
        <div className="job-list-container">
            <h2 className="job-list-title">
                {techName ? `Available Jobs for ${techName.toUpperCase()}` : "Available Jobs"}
            </h2>

            {jobs.length === 0 ? (
                <p className="job-empty">No jobs found.</p>
            ) : (
                <ul className="job-list">
                    {jobs.map((job) => (

                        <Link to={`/jobs/search/${job.id}`} key={job.id}>
                    <li className="job-card">
                        <h3 className="job-title">{job.title}</h3>
                        <p className="job-display-description">{job.description}</p>
                        <div className="job-icons">
                            {job.tech_stack.map((tech) => (
                                <TechIcon key={tech.id} tech={tech.slug}/>
                            ))}
                        </div>
                    </li>
                </Link>
            ))}
        </ul>
    )
}

    <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
    />
</div>
)
    ;
}
