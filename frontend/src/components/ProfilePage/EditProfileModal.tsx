import './ProfilePage.css';

import {useState} from 'react';
import type {User} from "../../auth/AuthContect.tsx";
import {updateUserProfile} from "../../api/auth.tsx";
function EditProfileModal({user, onClose}: { user: User, onClose: () => void }) {
    const [firstName, setFirstName] = useState(user.first_name);
    const [lastName, setLastName] = useState(user.last_name);
    const [email, setEmail] = useState(user.email);

    const handleSave = async () => {
        try {
            await updateUserProfile({
                first_name: firstName,
                last_name: lastName,
                email,
            });
            onClose();
            window.location.reload();
        } catch (err) {
            console.error("Failed to update profile", err);
        }
    };

    return (
        <div className="popup-backdrop">
            <div className="edit-profile-popup">
                <button className="close-btn-modal" onClick={onClose}>×</button>
                <h2>Edit Profile</h2>
                <label>First Name</label>
                <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                <label>Last Name</label>
                <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <button type='submit' onClick={handleSave}>💾 Save</button>
            </div>
        </div>

    );
}

export default EditProfileModal;
