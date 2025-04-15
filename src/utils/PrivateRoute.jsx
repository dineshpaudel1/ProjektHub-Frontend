import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, role }) => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const currentRole = localStorage.getItem("role");

    if (!isAuthenticated || currentRole !== role) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default PrivateRoute;
