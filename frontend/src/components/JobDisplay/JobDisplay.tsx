import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { fetchPaginatedJobs, fetchTechStackJobsPaginated } from "../../api/jobs";
import Pagination from "../Pagination/Pagination";
import './JobDisplay.css';

type Job = {
    id: number;
    title: string;
    description: string;
};

export function JobDisplay() {
    const { techName } = useParams();
    const [searchParams] = useSearchParams();
    const search = searchParams.get("search") || "";

    const [jobs, setJobs] = useState<Job[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const loadJobs = async () => {
            try {
                let res;

                if (techName) {
                    res = await fetchTechStackJobsPaginated(techName, currentPage, 5, search);
                } else {
                    res = await fetchPaginatedJobs(currentPage, 5, search);
                }

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
                        <li className="job-card" key={job.id}>
                            <h3 className="job-title">{job.title}</h3>
                            <p className="job-description">{job.description}</p>
                        </li>
                    ))}
                </ul>
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
}
