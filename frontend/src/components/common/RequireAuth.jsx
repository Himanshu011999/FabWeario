import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/Auth";

export const RequireAuth = ({ children }) => {
    const context = useContext(AuthContext);

    const { user } = context;

    if (!user) {
        return <Navigate to="/account/login" />;
    }

    return children;
};
