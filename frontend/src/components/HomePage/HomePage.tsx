import {useEffect, useState} from "react";
import {getTechStacks} from "../../api/jobs.tsx";
import './HomePage.css'
import {useNavigate} from "react-router-dom";


export interface Technology {
    id: number;
    name: string;
    slug:string
}

export interface TechCategory {
    id: number;
    name: string;
    tech_stacks: Technology[];
}

export function HomePage() {
    const navigate = useNavigate();
    const [techStacks, setTechStacks] = useState<TechCategory[]>([]);
    useEffect(() => {
        const fetchTechStack = async () => {
            try {
                const techStack = await getTechStacks();
                setTechStacks(techStack);
            } catch (error) {
                console.error("Error loading tech stacks", error);
            }
        };

        fetchTechStack();

    }, []);

    return (
        <>
            <h1 className='home-page-title'>Job Board</h1>
            <div className="home-page">

                {techStacks.length > 0 && (
                    <div className="tech-stack">
                        {techStacks.map((category) => (
                            <div className="tech-stack-list" key={category.id}>
                                <h3>{category.name}</h3>
                                {category.tech_stacks.map((tech) => (
                                    <div className="tech-stack-item" key={tech.id}
                                         onClick={() =>  navigate(`/jobs/${tech.slug}`)}>
                                        {tech.name}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>

    )
}