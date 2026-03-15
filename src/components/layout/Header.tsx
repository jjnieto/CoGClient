import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/authStore';
import { getMe } from '../../services/auth';

export function Header() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  useQuery({
    queryKey: ['me'],
    queryFn: () => getMe(token!),
    enabled: !!token,
    select: (data) => {
      setUser(data);
      return data;
    },
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold text-amber-400">
          Chains of Glory
        </Link>

        <nav className="flex items-center gap-6">
          <Link to="/" className="text-gray-300 hover:text-white text-sm">
            Dashboard
          </Link>
          <Link to="/characters" className="text-gray-300 hover:text-white text-sm">
            Characters
          </Link>
          <Link to="/equipment" className="text-gray-300 hover:text-white text-sm">
            Equipment
          </Link>
          <Link to="/quests" className="text-gray-300 hover:text-white text-sm">
            Quests
          </Link>
          <Link to="/store" className="text-gray-300 hover:text-white text-sm">
            Store
          </Link>
          <Link to="/inventory" className="text-gray-300 hover:text-white text-sm">
            Inventory
          </Link>
          <Link to="/crafting" className="text-gray-300 hover:text-white text-sm">
            Crafting
          </Link>
          <Link to="/chests" className="text-gray-300 hover:text-white text-sm">
            Chests
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <span className="text-amber-400 font-medium text-sm">
                {user.cogBalance} COG
              </span>
              <span className="text-gray-400 text-sm">{user.username}</span>
            </>
          )}
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-red-400 text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
