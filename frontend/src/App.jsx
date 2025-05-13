import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AuthForm from "./components/AuthForm";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPage from "./pages/AdminPage";
import GuruPage from "./pages/GuruPage";
import TamuPage from "./pages/TamuPage";

import "./index.css";

function App() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const debug = import.meta.env.MODE !== 'production';

  useEffect(() => {
    fetch("http://localhost:3001/api/users")
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        console.log("Data dari API:", data);
        setUsers(data.users || []); 
      })
      .catch((err) => {
        console.error("Gagal fetching:", err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route
              path="/login"
              element={
                <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                  <AuthForm />
                  {debug && !isLoading && (
                    <div className="mt-4">
                      <h2 className="text-lg font-semibold">Debug Data dari Backend:</h2>
                      <pre className="bg-gray-100 p-2 rounded text-sm text-left max-w-xl overflow-x-auto">
                        {JSON.stringify(users, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/guru"
              element={
                <ProtectedRoute role="guru">
                  <GuruPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tamu"
              element={
                // <ProtectedRoute role="tamu">
                <ProtectedRoute role="operator">
                  <TamuPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
