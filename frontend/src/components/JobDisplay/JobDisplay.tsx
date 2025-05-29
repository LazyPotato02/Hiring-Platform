import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { fetchPaginatedJobs, fetchTechStackJobsPaginated } from "../../api/jobs";
import Pagination from "../Pagination/Pagination";
import './JobDisplay.css';
import * as Icons from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
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

const techIconMap: Record<string, keyof typeof Icons> = {
    net: 'SiDotnet',
    php: 'SiPhp',
    ccembedded: 'SiCplusplus',
    python: 'SiPython',
    ruby: 'SiRuby',
    go: 'SiGo',
    nodejs: 'SiNodedotjs',
    'node-dot-js': 'SiNodedotjs',
    javascript: 'SiJavascript',
    react: 'SiReact',
    angular: 'SiAngular',
    vuejs: 'SiVuedotjs',
    devops: 'SiJenkins', // примерна DevOps иконка
    'database-engineer': 'SiMysql', // или SiPostgresql
    cybersecurity: 'SiHackthebox', // или друга близка
    sysadmin: 'SiGnubash', // или терминален инструмент
    'automation-qa': 'SiCypress',
    'manual-qa': 'SiTestinglibrary', // или друга близка
    'etldata-warehouse': 'SiApacheairflow',
    'big-data': 'SiApachehadoop',
    'bidata-visualization': 'SiTableau',
    'mlaidata-modelling': 'SiTensorflow',
    sap: 'SiSap',
    salesforce: 'SiSalesforce',
    ios: 'SiAppstore',
    android: 'SiAndroid',
    'it-business-analyst': 'SiMicrostrategy', // условна
    'product-management': 'SiProducthunt', // условна
    'product-owner': 'SiProducthunt', // условна
    'tech-writer': 'SiReadthedocs',
    'hardware-and-engineering': 'SiRaspberrypi',
    'customer-support': 'SiZendesk',
    'technical-support': 'SiSlack',
    'ui-ux': 'SiFigma',
};
const getTechColor = (tech: string): string => {
    const colors: Record<string, string> = {
        java: '#007396',
        net: '#512BD4',
        php: '#777BB4',
        ccembedded: '#00599C',
        python: '#3776AB',
        ruby: '#CC342D',
        go: '#00ADD8',
        nodejs: '#339933',
        javascript: '#F7DF1E',
        react: '#61DAFB',
        angular: '#DD0031',
        vuejs: '#42B883',
        devops: '#F25022',
        'database-engineer': '#336791',
        cybersecurity: '#00FFEF',
        sysadmin: '#4EAA25',
        'automation-qa': '#58C0DB',
        'manual-qa': '#E34F26',
        'etldata-warehouse': '#0178D4',
        'big-data': '#66CCFF',
        'bidata-visualization': '#E97627',
        'mlaidata-modelling': '#FF6F00',
        sap: '#0FAAFF',
        salesforce: '#00A1E0',
        ios: '#000000',
        android: '#3DDC84',
        'it-business-analyst': '#FF9900',
        'product-management': '#DA552F',
        'product-owner': '#DA552F',
        'tech-writer': '#8B8B8B',
        'hardware-and-engineering': '#B22222',
        'customer-support': '#F46A25',
        'technical-support': '#611f69',
        'ui-ux': '#F24E1E',
    };

    return colors[tech.toLowerCase()] || '#999'; // default gray
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

    const TechIcon = ({ tech }: { tech: string }) => {
        const key = tech.toLowerCase();

        if (key === 'java') {
            return <FaJava title="Java" style={{ marginRight: '0.5rem', color: '#007396' }} />;
        }

        const iconKey = techIconMap[key] as keyof typeof Icons;
        const Icon = Icons[iconKey];

        return Icon ? (
            <Icon
                title={tech}
                style={{
                    marginRight: '0.5rem',
                    color: getTechColor(key), // 🟢 виж функцията по-долу
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
                        <li className="job-card" key={job.id}>
                            <h3 className="job-title">{job.title}</h3>
                            <p className="job-description">{job.description}</p>
                            <div className="job-icons">
                                {job.tech_stack.map((tech) => (
                                    <TechIcon key={tech.id} tech={tech.slug} />
                                ))}
                            </div>
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
