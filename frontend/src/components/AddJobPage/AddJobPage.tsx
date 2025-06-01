import {useState} from "react";
import './AddJobPage.css'
import {createJob} from "../../api/jobs.tsx";
import {useNavigate} from "react-router-dom";
export type JobFormData = {
    title: string;
    description: string;
    tech_stack_ids: number[];
    is_active: boolean;
    created_by: number;
};


export function AddJobPage() {
    const navigate = useNavigate();


    const TECH_STACKS = [
        {id: 1, name: "Java"},
        {id: 2, name: ".NET"},
        {id: 3, name: "PHP"},
        {id: 4, name: "C/C++/Embedded"},
        {id: 5, name: "Python"},
        {id: 6, name: "Ruby"},
        {id: 7, name: "Go"},
        {id: 8, name: "Node.js"},
        {id: 9, name: "JavaScript"},
        {id: 10, name: "React"},
        {id: 11, name: "Angular"},
        {id: 12, name: "Vue.js"},
        {id: 13, name: "DevOps"},
        {id: 14, name: "Database Engineer"},
        {id: 15, name: "Cybersecurity"},
        {id: 16, name: "SysAdmin"},
        {id: 17, name: "Automation QA"},
        {id: 18, name: "Manual QA"},
        {id: 19, name: "ETL/Data warehouse"},
        {id: 20, name: "Big Data"},
        {id: 21, name: "BI/Data visualization"},
        {id: 22, name: "ML/AI/Data modelling"},
        {id: 23, name: "SAP"},
        {id: 24, name: "SalesForce"},
        {id: 25, name: "iOS"},
        {id: 26, name: "Android"},
        {id: 27, name: "IT Project Management"},
        {id: 28, name: "IT Business Analyst"},
        {id: 29, name: "Product Management"},
        {id: 30, name: "Product Owner"},
        {id: 31, name: "Tech Writer"},
        {id: 32, name: "FullStack Developer"},
        {id: 33, name: "Hardware and Engineering"},
        {id: 34, name: "Customer Support"},
        {id: 35, name: "Technical Support"},
        {id: 36, name: "UI/UX"},
    ];

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