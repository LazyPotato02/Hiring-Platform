import { useState } from 'react';
import './ApplyForJobPopUp.css';
import { applyForJob } from '../../api/jobApplications.tsx';

interface ApplyForJobPageProps {
    jobId: number;
    onClose: () => void;
    onSuccess: () => void;
}

function ApplyForJobPopUp({ jobId, onClose, onSuccess }: ApplyForJobPageProps) {
    const [cv, setCv] = useState<File | null>(null);
    const [message, setMessage] = useState('');
    const [linkedin, setLinkedin] = useState('');
    const [github, setGithub] = useState('');
    const [phone, setPhone] = useState('');
    const [agree, setAgree] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [submitting, setSubmitting] = useState(false);
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors: { [key: string]: string } = {};

        if (!agree) newErrors.agree = "You must agree to the terms.";



        if (cv && cv.size > 5 * 1024 * 1024) {
            newErrors.cv = "File size must be less than 5MB.";
        }
        if (!cv) {
            newErrors.cv = "Please attach your CV.";
        }
        else {
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ];
            if (!allowedTypes.includes(cv.type)) {
                newErrors.cv = "Only PDF or Word documents are allowed.";
            }
        }
        if (!message) {
            newErrors.message = "Message/Cover letter is required";
        }
        if (!linkedin) {
            newErrors.linkedin = "LinkedIn profile is required.";
        } else if (!/^https:\/\/(www\.)?linkedin\.com\/.+/.test(linkedin)) {
            newErrors.linkedin = "Must be a valid LinkedIn URL (e.g. https://www.linkedin.com/in/...)";
        }

        if (!github) {
            newErrors.github = "GitHub or GitLab profile is required.";
        } else if (!/^https:\/\/(github|gitlab)\.com\//.test(github)) {
            newErrors.github = "Must be a valid GitHub/GitLab URL.";
        }
        if (!phone) {
            newErrors.phone = "Phone number is required.";
        } else if (!/^[\d+\-\s()]+$/.test(phone)) {
            newErrors.phone = "Invalid phone number format.";
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        const formData = new FormData();
        formData.append('job', jobId.toString());
        if (cv) {
            formData.append('cv', cv);
        }
        formData.append('message', message);
        formData.append('linkedin', linkedin);
        formData.append('github', github);
        formData.append('phone', phone);
        setSubmitting(true)
        applyForJob(formData)
            .then(() => {
                // alert("You have successfully applied!");
                onClose();
                onSuccess();
            })
            .catch((err) => {
                console.error("Application error", err);
                alert("An error occurred while applying.");
            })
            .finally(() => setSubmitting(false));

    };
    const clearError = (field: string) => {
        if (errors[field]) {
            setErrors(prev => {
                const copy = { ...prev };
                delete copy[field];
                return copy;
            });
        }
    };
    return (
        <div className="popup">
            <h1 className="job-title">Job Application Form</h1>
            <button onClick={onClose} className="close-btn">✖</button>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div>
                    <label>Upload CV (PDF/DOCX):</label>
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            if (e.target.files && e.target.files.length > 0) {
                                setCv(e.target.files[0]);
                                clearError("cv")
                            }
                        }}
                    />
                    {errors.cv && <p className="error-text">{errors.cv}</p>}
                </div>

                <div>
                    <label>Message / Cover letter:</label>
                    <textarea
                        value={message}
                        onChange={(e) => {
                            setMessage(e.target.value);
                            clearError("message");
                        }}
                        placeholder="Tell us why you are applying..."
                        rows={4}
                    />
                    {errors.message && <p className="error-text">{errors.message}</p>}

                </div>

                <div>
                    <label>LinkedIn:</label>
                    <input
                        type="url"
                        value={linkedin}
                        onChange={(e) => {
                            setLinkedin(e.target.value);
                            clearError("linkedin");
                        }}
                        placeholder="https://linkedin.com/in/..."
                    />
                    {errors.linkedin && <p className="error-text">{errors.linkedin}</p>}
                </div>

                <div>
                    <label>GitHub / GitLab:</label>
                    <input
                        type="url"
                        value={github}
                        onChange={(e) => {
                            setGithub(e.target.value);
                            clearError("github");
                        }}
                        placeholder="https://github.com/..."
                    />
                    {errors.github && <p className="error-text">{errors.github}</p>}
                </div>

                <div>
                    <label>Phone Number:</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                            setPhone(e.target.value);
                            clearError("phone");
                        }}
                        placeholder="+359..."
                    />
                    {errors.phone && <p className="error-text">{errors.phone}</p>}
                </div>

                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={agree}
                            onChange={(e) => {
                                setAgree(e.target.checked);
                                clearError("agree");
                            }}
                        />
                        I agree to my personal data being processed for the purpose of applying.
                    </label>
                    {errors.agree && <p className="error-text">{errors.agree}</p>}
                </div>

                <button type="submit" disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit an application"}
                </button>
            </form>
        </div>
    );
}

export default ApplyForJobPopUp;
