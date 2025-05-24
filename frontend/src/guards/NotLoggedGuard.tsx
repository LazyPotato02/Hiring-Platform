import {useAuth} from "../auth/AuthContect.tsx";
import {Navigate} from "react-router-dom";
import type {ReactNode} from "react";

type Props = {
    children: ReactNode;
};


export function NotLoggedGuard({children}: Props) {
    const {user} = useAuth();

    if (!user) {
        return <Navigate to="/login" replace/>;
    }

    return children;
}