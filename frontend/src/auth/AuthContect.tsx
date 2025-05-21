import {createContext, useContext, useEffect, useState} from "react";
import {clearToken, getRefreshToken, getToken} from "../utils/tokenUtils.tsx";
import {getCurrentUser, logoutApi} from "../api/auth.tsx";


export type User = {
    id: number;
    email: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (accessToken: string, refreshToken: string) => Promise<void>;
    register: (accessToken: string, refreshToken: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
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

    const login = async (accessToken: string, refreshToken: string) => {
        try {
            const user = await getCurrentUser(accessToken);
            setUser(user);
            localStorage.setItem("token", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("user", JSON.stringify(user));

        } catch (error) {
            console.error("Login failed:", error);
            clearToken();
        }
    };

    const register = async (accessToken: string, refreshToken: string) => {
        try {
            const user = await getCurrentUser(accessToken);
            setUser(user);
            localStorage.setItem("token", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("user", JSON.stringify(user));

        } catch (error) {
            console.error("Register failed:", error);
            clearToken();
        }
    };


    const logout = async () => {
        const accessToken:string |null = getToken()
        const refreshToken:string | null = getRefreshToken();
        const logoutResponse = await logoutApi(accessToken,refreshToken)

        console.log(logoutResponse)
        clearToken();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{user, loading, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext)!;