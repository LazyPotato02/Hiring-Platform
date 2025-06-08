import {useState} from 'react';
import './ApplyForJobPage.css'
import {applyForJob} from "../../api/jobApplications.tsx";

interface ApplyForJobPageProps {
    jobId: number;
    onClose: () => void;
}

function ApplyForJobPage({jobId, onClose}: ApplyForJobPageProps) {
    const [cv, setCv] = useState<File | null>(null);
    const [message, setMessage] = useState('');
    const [linkedin, setLinkedin] = useState('');
    const [github, setGithub] = useState('');
    const [phone, setPhone] = useState('');
    const [agree, setAgree] = useState(false);
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!agree) {
            alert("Please agree to the terms and conditions.");
            return;
        }

        if (!cv) {
            alert("Please attach your CV.");
            return;
        }

        const formData = new FormData();
        formData.append('job', jobId.toString());
        formData.append('cv', cv);
        formData.append('message', message);
        formData.append('linkedin', linkedin);
        formData.append('github', github);
        formData.append('phone', phone);
        applyForJob(formData)
            .then((data) => {
                console.log("Successful:", data);
                alert("You have successfully applied!");
                onClose();
            })
            .catch((err) => {
                console.error("Application error", err);
                alert("An error occurred while applying.");

            });
    };

    return (
        <div className="popup">
            <h1 className='job-title'>Job Application Form</h1>
            <button onClick={onClose} style={{position: 'absolute', top: '10px', right: '10px'}}>✖</button>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div>
                    <label>Upload CV (PDF/DOCX):</label>
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            if (e.target.files && e.target.files.length > 0) {
                                setCv(e.target.files[0]);
                            }
                        }}
                        required
                    />
                </div>

                <div>
                    <label>Message / Cover letter:</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us why you are applying...."
                        rows={4}
                    />
                </div>

                <div>
                    <label>LinkedIn:</label>
                    <input
                        type="url"
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        placeholder="https://linkedin.com/in/..."
                    />
                </div>

                <div>
                    <label>GitHub / GitLab профил:</label>
                    <input
                        type="url"
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                        placeholder="https://github.com/..."
                    />
                </div>

                <div>
                    <label>Phone Number:</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+359..."
                    />
                </div>

                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={agree}
                            onChange={(e) => setAgree(e.target.checked)}
                        />
                        I agree to my personal data being processed for the purpose of applying.
                    </label>
                </div>

                <button type="submit">Submit an application</button>
            </form>
        </div>
    );
}

export default ApplyForJobPage;
