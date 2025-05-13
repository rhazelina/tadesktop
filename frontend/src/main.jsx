import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import AdminPage from './pages/AdminPage';
import GuruPage from './pages/GuruPage';
import TamuPage from './pages/TamuPage';
import ProtectedRoute from './components/ProtectedRoute';
import NotFund from './pages/NotFund';
import GuestData from './components/GuestData';
// import AdminSettings from './components/AdminSettings'; // Create for settings
// import AdminReviews from './components/AdminReviews'; // Create for reviews

const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/authform',
    element: <AuthForm />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute role="admin">
        <AdminPage />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminPage />,
      },
      {
        index: true,
        path: 'guest-data',
        element: <GuestData />,
      },
      // {
      //   path: 'settings',
      //   element: <AdminSettings />,
      // },
      // {
      //   path: 'reviews',
      //   element: <AdminReviews />,
      // },
    ],
  },
  {
    path: '/guru',
    element: (
      <ProtectedRoute role="guru">
        <GuruPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/tamu',
    element: (
      <ProtectedRoute role="tamu">
        <TamuPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <NotFund />,
  },
]);

function AppWrapper() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);