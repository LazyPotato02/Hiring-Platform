import '../EditJobPopUp/EditJobPopUp.css';
import type { Job } from "../../types/job";
import { deleteJob } from "../../api/jobs.tsx";
import {useNavigate} from "react-router-dom";

interface DeleteJobPopUpProps {
    job: Job;
    onClose: () => void;
}

function DeleteJobPopUp({ job, onClose}: DeleteJobPopUpProps) {
    const navigate = useNavigate();
    const handleDelete = async () => {
        try {
            await deleteJob(job.id);
            navigate('/');
        } catch (err) {
            console.error("Failed to delete job", err);
        }
    };

    return (
        <div className="popup">
            <button className="close-btn" onClick={onClose}>×</button>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete the job <strong>{job.title}</strong>?</p>
            <div className="button-group">
                <button className="delete-btn" onClick={handleDelete}>🗑️ Delete</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
}

export default DeleteJobPopUp;
