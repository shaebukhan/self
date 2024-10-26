import axios from "axios";
import { useState, useContext, createContext, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        user: null,
        token: ""
    });

    useEffect(() => {
        // Update axios default headers whenever auth.token changes
        axios.defaults.headers.common["Authorization"] = auth?.token;
    }, [auth.token]);

    useEffect(() => {
        // Retrieve auth data from local storage on mount
        const data = localStorage.getItem("auth");
        if (data) {
            const parseData = JSON.parse(data);
            // Update auth state if data exists
            setAuth({
                user: parseData.user,
                token: parseData.token
            });
        }
    }, []); // No dependency to prevent infinite loop

    return (
        <AuthContext.Provider value={[auth, setAuth]}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
