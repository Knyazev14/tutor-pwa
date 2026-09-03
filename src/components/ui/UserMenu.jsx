import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom"; // Используем Link из react-router-dom

function UserMenu() {
  const { logout } = useAuth();
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

  return (
    <div className="relative cursor-pointer" ref={menuRef}>
      {/* Аватар пользователя */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold flex items-center justify-center border-2 border-white hover:scale-110 transition-all duration-300 shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
      >
        T
      </button>

      {/* Выпадающее меню */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-100">
          {/* Календарь */}
          <Link 
            to="/" 
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
            <span className="text-lg">📅</span>
            Календарь
          </Link>

          {/* Брони */}
          <Link 
            to="/books" 
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
            <span className="text-lg">📖</span>
            Брони
          </Link>

          {/* Уроки */}
          <Link 
            to="/lessons" 
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
            <span className="text-lg">📝</span>
            Уроки
          </Link>

          {/* Ученики */}
          <Link 
            to="/students" 
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
            <span className="text-lg">👥</span>
            Ученики
          </Link>

          {/* Категории */}
          <Link 
            to="/categories" 
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
            <span className="text-lg">📚</span>
            Категории
          </Link>

          {/* Статусы */}
          <Link 
            to="/statuses" 
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
            <span className="text-lg">📊</span>
            Статусы
          </Link>
    <Link 
            to="/statistic" 
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
            <span className="text-lg">📊</span>
            Статистика (демо)
          </Link>
          {/* Разделитель */}
          <div className="border-t border-gray-100 my-1"></div>

          {/* Выход */}
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center gap-3"
          >
            <span className="text-lg">🚪</span>
            Выйти
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;