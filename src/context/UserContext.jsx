import { createContext, useContext, useState, useEffect } from "react";
import axios from "../utils/axiosInstance";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [roles, setRoles] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchUser = async () => {
            if (!token) {
                setUser(null);
                setRoles([]);
                return;
            }

            try {
                const res = await axios.get("/user/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(res.data);

                // ✅ Decode token and extract roles
                const decoded = JSON.parse(atob(token.split(".")[1]));
                setRoles(decoded.roles || []);
            } catch (error) {
                console.error("Error fetching user:", error);
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                setUser(null);
                setRoles([]);
            }
        };

        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, roles, setRoles }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
