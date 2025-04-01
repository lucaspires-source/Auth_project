import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import Dashboard from "./Components/Dashboard";
import { ThemeProvider } from "./ThemeContext";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";


 const RedirectIfAuthenticated = ({ children }: { children: React.ReactElement }) => {
     const { token } = useAuth();
    const location = useLocation();
  
     if (token) {
       return <Navigate to="/" state={{ from: location }} replace />;
     }
  
     return children;
   };

function App() {
  return (
    <AuthProvider>
      <ThemeProvider >
      <BrowserRouter>
        <Routes>
           <Route 
             path="/login" 
             element={
               <RedirectIfAuthenticated>
                 <SignIn />
               </RedirectIfAuthenticated>
             } 
           />
           <Route 
             path="/register" 
             element={
               <RedirectIfAuthenticated>
                 <SignUp />
               </RedirectIfAuthenticated>
             } 
           />
          <Route
            path="/"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
      </ThemeProvider>

    </AuthProvider>
  );
}

export default App

const RequireAuth = ({ children }: { children: React.ReactElement  }) => {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
