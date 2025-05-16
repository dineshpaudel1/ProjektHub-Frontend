import { Navigate } from "react-router-dom";

const SellerPrivateRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

    const getRoles = () => {
        try {
            if (!token) return [];
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload.roles || [];
        } catch {
            return [];
        }
    };

    const roles = getRoles();

    if (!isAuthenticated || !roles.includes("SELLER")) {
        return <Navigate to="/seller/login" replace />;
    }

    return children;
};

export default SellerPrivateRoute;
