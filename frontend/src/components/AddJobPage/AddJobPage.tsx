import {useState} from "react";
import './AddJobPage.css'
import {createJob} from "../../api/jobs.tsx";
import {useNavigate} from "react-router-dom";
import {TECH_STACKS} from "../../assets/techStack.ts";
export type JobFormData = {
    title: string;
    description: string;
    tech_stack_ids: number[];
    is_active: boolean;
    created_by: number;
};


export function AddJobPage() {
    const navigate = useNavigate();


    const [form, setForm] = useState<JobFormData>({
        title: "",
        description: "",
        tech_stack_ids: [],
        is_active: true,
        created_by: 1,
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;

        if (e.target instanceof HTMLSelectElement && e.target.multiple && name === "tech_stack") {
            const selectedOptions = Array.from(e.target.selectedOptions, (option) =>
                parseInt(option.value)
            );
            setForm((prev) => ({
                ...prev,
                tech_stack: selectedOptions,
            }));
            return;
        }

        const checked = (e.target as HTMLInputElement).checked;

        if (type === "checkbox") {
            setForm((prev) => ({ ...prev, [name]: checked }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createJob(form)
        navigate('/')


    };


    return (
        <div className="add-job-container">
            <h2 className="form-title">Add Job</h2>
            <form className="add-job-form" onSubmit={handleSubmit}>

                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Tech Stack</label>

                    {form.tech_stack_ids.length > 0 && (
                        <div className="selected-tags">
                            {form.tech_stack_ids.map((id) => {
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
                            const isSelected = form.tech_stack_ids.includes(stack.id);
                            return (
                                <li key={stack.id} className="tech-stack-item">
                                    <span>{stack.name}</span>
                                    <button
                                        type="button"
                                        className={`tech-stack-button ${isSelected ? "remove" : "add"}`}
                                        onClick={() => {
                                            setForm((prev) => ({
                                                ...prev,
                                                tech_stack_ids: isSelected
                                                    ? prev.tech_stack_ids.filter((id) => id !== stack.id)
                                                    : [...prev.tech_stack_ids, stack.id]
                                            }));
                                        }}
                                    >
                                        {isSelected ? "Remove" : "Add"}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>



                <button type="submit" className="submit-button">Create Job</button>
            </form>
        </div>

    );
}