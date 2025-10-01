import  { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

type AuthContextType = {
    user: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: { username: string; password: string }) => boolean;
    logout: () => void;
}

const dataUsers = [
    {
        username: "wahid",
        password: "wahid134"
    },
    {
        username: "admin", 
        password: "admin123"
    }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Cek localStorage saat app start
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        
        if (savedUser && isLoggedIn === 'true') {
            setUser(savedUser);
        }
        setIsLoading(false);
    }, []);

    const login = (credentials: { username: string; password: string }): boolean => {
        // Cek apakah user ada di data
        const validUser = dataUsers.find(
            user => user.username === credentials.username && user.password === credentials.password
        );

        if (validUser) {
            // Set user dan simpan ke localStorage
            setUser(validUser.username);
            localStorage.setItem('user', validUser.username);
            localStorage.setItem('isLoggedIn', 'true');
            return true;
        } else {
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
    };

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Protected Route Component - cek localStorage
export function ProtectedRoute({ children }: { children: ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Double check dengan localStorage
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        
        if (!isLoading && (!isAuthenticated || isLoggedIn !== 'true')) {
            navigate('/login', { 
                state: { from: location.pathname },
                replace: true 
            });
        }
    }, [isAuthenticated, isLoading, navigate, location.pathname]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
                <p className="ml-4 text-gray-600">Loading...</p>
            </div>
        );
    }

    // Cek localStorage juga
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isAuthenticated || isLoggedIn !== 'true') {
        return null; // Will redirect via useEffect
    }

    return <>{children}</>;
}

// Hook untuk auto redirect setelah login
export function useLoginRedirect() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        
        if (isAuthenticated && isLoggedIn === 'true') {
            const from = (location.state as any)?.from || '/';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location.state]);
}