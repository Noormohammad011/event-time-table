import { createBrowserRouter, Navigate } from 'react-router';
import Home from '../pages/Home';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '*',
        element: <Navigate to="/" replace />,
    },
]);

