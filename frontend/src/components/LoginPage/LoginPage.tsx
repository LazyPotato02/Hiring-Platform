import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../../api/auth.tsx";
import "./LoginPage.css";
import {useAuth} from "../../auth/AuthContect.tsx"; // 👈 добави CSS файла

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const { access,refresh } = await loginApi(email, password);
            await login(access,refresh);
            navigate("/");
        } catch {
            setError("Wrong email or password");
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                {error && <p className="error">{error}</p>}

                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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


                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;
