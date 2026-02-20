import { useAuth } from '../../context/AuthContext';
import Link from '../ui/Link';
import Button from '../ui/Button';
import UserMenu from '../ui/UserMenu';

function Navigation() {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-primary-600 to-secondary-500 shadow-lg mb-6 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between flex-wrap py-3">
          {/* Logo */}
          <Link 
            to="/" 
            variant="nav" 
            className="text-xl font-bold hover:scale-105 transition-transform duration-300"
          >
            <span className="mr-2 text-2xl">📅</span>
            <span className="">TutorApp</span>
          </Link>

          {/* Навигационные ссылки */}
          <div className="flex items-center gap-1 sm:gap-2">
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <Button
                to="/login"
                variant="buttonOutlined"
                size="sm"
                className="ml-2 border-white text-white hover:bg-white hover:text-primary-600"
                icon={<span>🔐</span>}
              >
                <span className="hidden sm:inline">Войти</span>
              </Button>
            )}
          </div>
        </div>
      </div>


    </nav>
  );
}

export default Navigation;