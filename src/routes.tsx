import { createBrowserRouter } from 'react-router-dom';

// Placeholder pages — will be replaced as each phase is implemented
function Placeholder({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold text-gray-400">{name} — Coming Soon</h1>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Placeholder name="Login" />,
  },
  {
    path: '/register',
    element: <Placeholder name="Register" />,
  },
  {
    path: '/',
    element: <Placeholder name="Dashboard" />,
  },
]);
