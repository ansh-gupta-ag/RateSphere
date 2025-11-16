import { useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../services/auth';

const NavBar = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-700">Store Ratings</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-gray-600">Welcome, </span>
              <span className="font-medium">{user?.name}</span>
              <span className="ml-2 px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-700">
                {user?.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
