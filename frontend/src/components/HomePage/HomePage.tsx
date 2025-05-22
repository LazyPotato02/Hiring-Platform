import {useEffect, useState} from "react";
import {getTechStacks} from "../../api/jobs.tsx";

export interface Technology {
    id: number;
    name: string;
}

export interface TechCategory {
    id: number;
    name: string;
    tech_stacks: Technology[];
}

export function HomePage() {
    const [techStacks,setTechStacks] = useState<TechCategory[]>([]);
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



    return(
        <div className="HomePage">
            <p>Home</p>

            {techStacks.length > 0 && (
                <div className="tech-stack">
                    {techStacks.map((category) => (
                        <div key={category.id}>
                            <h3>{category.name}</h3>
                            <div className="tech-list">
                                {category.tech_stacks.map((tech) => (
                                    <div key={tech.id}>{tech.name}</div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}