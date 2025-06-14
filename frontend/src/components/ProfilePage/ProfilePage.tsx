import './ProfilePage.css';
import { useAuth } from "../../auth/AuthContect.tsx";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal.tsx";
import ChangePasswordModal from './ChangePasswordModal.tsx';
import {useNavigate} from "react-router-dom";

function ProfilePage() {
    const { user } = useAuth();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);
    const navigate = useNavigate();
    if (!user) return <p className="profile-loading">Loading profile...</p>;
    const handleRedirectToJobs = () => {
        navigate("/user/posted-jobs");
    };
    return (
        <div className="profile-container">
            <h1 className="profile-title">👤 Profile</h1>

            <div className="profile-field">
                <label>First Name:</label>
                <span>{user.first_name}</span>
            </div>

            <div className="profile-field">
                <label>Last Name:</label>
                <span>{user.last_name}</span>
            </div>

            <div className="profile-field">
                <label>Email:</label>
                <span>{user.email}</span>
            </div>

            <div className="profile-buttons">
                {user.role =='interviewer' && (
                    <button onClick={handleRedirectToJobs}>📅 ️Uploaded Jobs</button>
                )}
                <button onClick={() => setIsEditOpen(true)}>✏️ Edit Profile</button>
                <button onClick={() => setIsPasswordOpen(true)}>🔒 Change Password</button>
            </div>

            {isEditOpen && <EditProfileModal user={user} onClose={() => setIsEditOpen(false)} />}
            {isPasswordOpen && <ChangePasswordModal onClose={() => setIsPasswordOpen(false)} />}
        </div>
    );
}

export default ProfilePage;
