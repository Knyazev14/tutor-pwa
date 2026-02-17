import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Link from "../ui/Link";

function UserMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getUserInitials = () => {
    if (!user?.username) return "?";
    return user.username.charAt(0).toUpperCase();
  };

  return (
    <div className="relative cursor-pointer" ref={menuRef}>
      {/* Аватар пользователя */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white font-bold flex items-center justify-center border-2 border-white hover:scale-110 transition-all duration-300 shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer"
      >
        {getUserInitials()}
      </button>

      {/* Выпадающее меню */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 animate-fade-in border border-gray-100">
          {/* Информация о пользователе */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Вы вошли как</p>
            <p className="text-primary-600 font-semibold truncate">
              {user?.username || "Пользователь"}
            </p>
            {user?.email && (
              <p className="text-xs text-gray-500 mt-1 truncate">
                {user.email}
              </p>
            )}
          </div>
          <Link to="/books" variant="navAside">
            <span className="text-lg">📖</span> {/* Книга/брони */}
            Брони
          </Link>

          <Link to="/lessons" variant="navAside">
            <span className="text-lg">📝</span> {/* Уроки/задания */}
            Уроки
          </Link>

          <Link to="/students" variant="navAside">
            <span className="text-lg">👥</span> {/* Ученики/группа */}
            Ученики
          </Link>
          {/* Меню пункты */}
          <div className="py-1">
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center gap-3 border-t border-gray-100 mt-1 pt-2"
            >
              <span className="text-lg">🚪</span>
              Выйти
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
