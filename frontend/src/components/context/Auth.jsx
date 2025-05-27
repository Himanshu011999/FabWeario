import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const storedInfo = localStorage.getItem('userInfo');
    const [user, setUser] = useState(storedInfo ? JSON.parse(storedInfo) : null);

    const login = (user) => {
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
