import {useAuth} from "../auth/AuthContect.tsx";
import {Navigate} from "react-router-dom";
import type {ReactNode} from "react";

type Props = {
    children: ReactNode;
};


export function LoggedGuard({children}: Props) {
    const {user} = useAuth();

    if (user) {
        return <Navigate to="/" replace/>;
    }

    return children;
}