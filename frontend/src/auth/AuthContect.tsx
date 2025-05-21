import {createContext, useContext, useEffect, useState} from "react";
import {clearToken, getToken} from "../utils/tokenUtils.tsx";
import {getCurrentUser} from "../api/auth.tsx";


export type User ={
    id:number;
    email:string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (accessToken: string,refreshToken:string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getToken();
        if (token) {
            getCurrentUser(token)
                .then(setUser)
                .catch(() => clearToken())
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (accessToken: string,refreshToken:string) => {
        try {
            localStorage.setItem("token", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            const user = await getCurrentUser(accessToken);
            setUser(user);
        } catch (error) {
            console.error("Login failed:", error);
            clearToken();
        }
    };

    const logout = () => {
        clearToken();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading,login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext)!;