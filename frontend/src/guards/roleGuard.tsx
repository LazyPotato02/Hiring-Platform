import {useAuth} from "../auth/AuthContect.tsx";
import {Navigate} from "react-router-dom";

export function RequireRole({children}: {children: React.ReactNode}) {
    const { user } = useAuth();
    if (user && user.role !== 'interviewer') {
        return <Navigate to="/" replace />;
    }
    return children;
}

