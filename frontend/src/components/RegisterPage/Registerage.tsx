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
    const [validationErrors, setValidationErrors] = useState({
        email: "",
        firstName: "",
        lastName: "",
        password: ""
    });

    const validateEmail = (value: string) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value)) {
            return "Please enter a valid email address.";
        }
        return "";
    };

    const validateFirstName = (value: string) => {
        if (value.trim().length < 2 || value.trim().length > 30) {
            return "First name must be between 2 and 30 characters.";
        }
        if (!/^[a-zA-Zа-яА-Я\s-]+$/.test(value)) {
            return "First name can only contain letters, spaces, and hyphens.";
        }
        return "";
    };

    const validateLastName = (value: string) => {
        if (value.trim().length < 2 || value.trim().length > 30) {
            return "Last name must be between 2 and 30 characters.";
        }
        if (!/^[a-zA-Zа-яА-Я\s-]+$/.test(value)) {
            return "Last name can only contain letters, spaces, and hyphens.";
        }
        return "";
    }

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const errors = {
            email: validateEmail(email),
            firstName: validateFirstName(firstName),
            lastName: validateLastName(lastName),
            password: validatePassword(password)
        };

        setValidationErrors(errors);

        const hasErrors = Object.values(errors).some(err => err !== "");
        if (hasErrors) return;

        try {
            await registerApi(email, firstName, lastName, password, role);
            await register();
            navigate("/");
        } catch {
            setError("Something went wrong during registration.");
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
                    onChange={(e) => {
                        const val = e.target.value;
                        setEmail(val);
                        setValidationErrors(prev => ({
                            ...prev,
                            email: validateEmail(val)
                        }));
                    }}
                    required
                />
                {validationErrors.email && <p className="error">{validationErrors.email}</p>}
                <label htmlFor="firstName">First Name</label>
                <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => {
                        const val = e.target.value;
                        setFirstName(val);
                        setValidationErrors(prev => ({
                            ...prev,
                            firstName: validateFirstName(val)
                        }));
                    }}
                    required
                />
                {validationErrors.firstName && <p className="error">{validationErrors.firstName}</p>}
                <label htmlFor="lastName">Last Name</label>
                <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => {
                        const val = e.target.value;
                        setLastName(val);
                        setValidationErrors(prev => ({
                            ...prev,
                            lastName: validateLastName(val)
                        }));
                    }}
                    required
                />
                {validationErrors.lastName && <p className="error">{validationErrors.lastName}</p>}
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                        const val = e.target.value;
                        setPassword(val);
                        setValidationErrors(prev => ({
                            ...prev,
                            password: validatePassword(val)
                        }));
                    }}
                    required
                />
                {validationErrors.password && <p className="error">{validationErrors.password}</p>}
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