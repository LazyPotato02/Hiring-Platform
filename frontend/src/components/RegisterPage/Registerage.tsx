import "./RegisterPage.css"
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {registerApi} from "../../api/auth.tsx";
import {useAuth} from "../../auth/AuthContect.tsx";


const RegisterPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState('candidate');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { register } = useAuth();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            await registerApi(email, firstName, lastName, password,role);
            await register();
            navigate("/");
        } catch {
            setError("Wrong email or password");
        }
    };

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRole(e.target.value);
    };

    return (
        <div className="register-container">
            <form className="register-form" onSubmit={handleSubmit}>
                <h2>Register</h2>
                {error && <p className="error">{error}</p>}

                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label htmlFor="firstName">First Name</label>
                <input
                    id="email"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
                <label htmlFor="lastName">Last Name</label>
                <input
                    id="email"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <label htmlFor="role">Account Type</label>
                <select name="role" id="role" value={role} onChange={handleRoleChange}>
                    <option value="candidate">Candidate</option>
                    <option value="interviewer">Interviewer</option>
                </select>
                <button type="submit">Register</button>
            </form>

        </div>
    )
}
export default RegisterPage;