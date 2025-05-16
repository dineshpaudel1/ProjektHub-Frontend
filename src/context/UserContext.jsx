import { createContext, useContext, useState, useEffect } from "react";
import axios from "../utils/axiosInstance";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchUser = async () => {
            if (!token) return;
            try {
                const res = await axios.get("/user/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(res.data);
            } catch (e) {
                console.error("Error fetching user:", e);
            }
        };
        fetchUser();
    }, [token]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
