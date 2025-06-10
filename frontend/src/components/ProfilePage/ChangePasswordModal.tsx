import './ProfilePage.css';
import { useState } from 'react';
import {changeUserPassword} from "../../api/auth.tsx";

function ChangePasswordModal({ onClose }: { onClose: () => void }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const validatePassword = (value: string) => {
        if (value.length < 8) {
            return "Password must be at least 8 characters.";
        }
        if (!/[a-z]/.test(value)) {
            return "Password must contain at least one lowercase letter.";
        }
        if (!/[A-Z]/.test(value)) {
            return "Password must contain at least one uppercase letter.";
        }
        if (!/[0-9]/.test(value)) {
            return "Password must contain at least one number.";
        }
        if (!/[\W_]/.test(value)) {
            return "Password must contain at least one special character.";
        }
        return "";
    };
    const handleSave = async () => {
        const validationError = validatePassword(newPassword);
        if (validationError) {
            setError(validationError);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            await changeUserPassword({
                current_password: currentPassword,
                new_password: newPassword,
            });
            onClose();
        } catch (err) {
            setError("Failed to change password.");
            console.error(err);
        }
    };

    return (
        <div className="popup-backdrop">
            <div className="edit-profile-popup">
                <button className="close-btn-modal" onClick={onClose}>×</button>
                <h2>Change Password</h2>

                <label>Current Password</label>
                <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                />

                <label>New Password</label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => {
                        setNewPassword(e.target.value);
                        setError("");
                    }}
                />

                <label>Confirm New Password</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError("");
                    }}
                />

                {error && <p className="error-text">{error}</p>}

                <button type="submit" onClick={handleSave}>🔒 Save</button>
            </div>
        </div>
    );
}

export default ChangePasswordModal;
