import './ProfilePage.css';
import { useState } from 'react';
import {changeUserPassword} from "../../api/auth.tsx";

function ChangePasswordModal({ onClose }: { onClose: () => void }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSave = async () => {
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            await changeUserPassword({
                current_password: currentPassword,
                new_password: newPassword,
            });
            onClose();
        } catch (err) {
            alert("Failed to change password.");
            console.error(err);
        }
    };

    return (
        <div className="popup-backdrop">
            <div className="popup">
                <button className="close-btn" onClick={onClose}>×</button>
                <h2>Change Password</h2>
                <label>Current Password</label>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                <label>New Password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                <label>Confirm New Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <button onClick={handleSave}>🔒 Save</button>
            </div>
        </div>
    );
}

export default ChangePasswordModal;
