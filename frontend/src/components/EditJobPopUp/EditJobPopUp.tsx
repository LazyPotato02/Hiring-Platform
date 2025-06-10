import { useState } from "react";
import type { Job } from "../../types/job";
import './EditJobPopUp.css'
import {TECH_STACKS} from "../../assets/techStack.ts";
import {updateJob} from "../../api/jobs.tsx";
interface EditJobPopUpProps {
    job: Job;
    onClose: () => void;
    onSave: (updatedJob: Job) => void;
}

function EditJobPopUp({ job, onClose, onSave }: EditJobPopUpProps) {
    const [title, setTitle] = useState(job.title);
    const [description, setDescription] = useState(job.description);
    const [techStackIds, setTechStackIds] = useState<number[]>(
        job.tech_stack.map((t) => t.id)
    );
    const [isActive, setIsActive] = useState(job.is_active);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        const updatedJob: Job = {
            ...job,
            title,
            description,
            is_active: isActive,
            tech_stack: techStackIds.map((id) => {
                const tech = TECH_STACKS.find((t) => t.id === id);
                return tech
                    ? { id: tech.id, name: tech.name, slug: tech.slug }
                    : { id, name: "Unknown", slug: "unknown" };
            }),
        };

        try {
            const updated = await updateJob(job.id, updatedJob);
            onSave(updated);
        } catch (err) {
            console.error("Failed to update job", err);
        }
    };

    return (
        <div className="popup">
            <button className="close-btn" onClick={onClose}>×</button>
            <h1>Edit Job</h1>
            <form onSubmit={handleSave}>
                <div>
                    <label>Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div>
                    <label>Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div>
                    <label>Tech Stack</label>

                    {techStackIds.length > 0 && (
                        <div className="selected-tags">
                            {techStackIds.map((id) => {
                                const tech = TECH_STACKS.find((t) => t.id === id);
                                return tech ? (
                                    <span key={id} className="tag">
                        {tech.name}
                    </span>
                                ) : null;
                            })}
                        </div>
                    )}

                    <ul className="add-job-tech-list">
                        {TECH_STACKS.map((stack) => {
                            const isSelected = techStackIds.includes(stack.id);
                            return (
                                <li key={stack.id} className="tech-stack-item">
                                    <span>{stack.name}</span>
                                    <button
                                        type="button"
                                        className={`tech-stack-button ${isSelected ? "remove" : "add"}`}
                                        onClick={() => {
                                            setTechStackIds((prev) =>
                                                isSelected
                                                    ? prev.filter((id) => id !== stack.id)
                                                    : [...prev, stack.id]
                                            );
                                        }}
                                    >
                                        {isSelected ? "Remove" : "Add"}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div>
                    <label>Status</label>
                    <select
                        value={isActive ? "true" : "false"}
                        onChange={(e) => setIsActive(e.target.value === "true")}
                    >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </div>

                <button type="submit" disabled={!title.trim() || !description.trim()}>
                    💾 Save
                </button>
            </form>
        </div>
    );
}

export default EditJobPopUp;
