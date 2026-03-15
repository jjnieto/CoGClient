import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import StorePage from './pages/StorePage';
import CharactersPage from './pages/CharactersPage';
import CharacterDetailPage from './pages/CharacterDetailPage';
import EquipmentPage from './pages/EquipmentPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <DashboardPage /> },
          { path: '/store', element: <StorePage /> },
          { path: '/characters', element: <CharactersPage /> },
          { path: '/characters/:id', element: <CharacterDetailPage /> },
          { path: '/equipment', element: <EquipmentPage /> },
        ],
      },
    ],
  },
]);
