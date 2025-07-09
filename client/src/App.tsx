import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, createContext, useContext } from "react";
import NotFound from "@/pages/not-found";
import LoginStandalone from "@/pages/login-standalone";
import AdminDashboard from "@/pages/admin/dashboard";
import ResponsibleDashboard from "@/pages/responsible/dashboard";
import Category from "@/pages/responsible/category";
import Indicator from "@/pages/responsible/indicator";

// Simple auth context
interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  fullName: string;
}

interface AuthContext {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContext | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

// Safe version of useAuth that doesn't throw
export function useAuthSafe() {
  const context = useContext(AuthContext);
  return context;
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (user: User) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function Router() {
  const { user } = useAuth();

  return (
    <Switch>
      {user?.role === "admin" ? (
        <>
          <Route path="/" component={AdminDashboard} />
          <Route path="/admin" component={AdminDashboard} />
        </>
      ) : (
        <>
          <Route path="/" component={ResponsibleDashboard} />
          <Route path="/category/:category" component={Category} />
          <Route path="/indicator/:code" component={Indicator} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <AppContent />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function AppContent() {
  const { user, login } = useAuth();

  if (!user) {
    return <LoginStandalone onLogin={login} />;
  }

  return <Router />;
}

export default App;
