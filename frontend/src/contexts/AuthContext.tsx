import { createContext, useState, useEffect, ReactNode } from "react";

interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
}

interface AuthContextType {
    token: string | null;
    user: User | null;
    loading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(
    undefined,
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("access_token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }

        setLoading(false);
    }, []);

    const login = (newToken: string, newUser: User) => {
        localStorage.setItem("access_token", newToken);
        localStorage.setItem("user", JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
