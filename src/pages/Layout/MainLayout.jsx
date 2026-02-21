import Navigation from "../../components/navigation/Navigation";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

function MainLayout() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Функция для проверки открытых модалок
    const checkModals = () => {
      const modals = document.querySelectorAll('.fixed.inset-0');
      setIsModalOpen(modals.length > 0);
    };

    // Создаем наблюдатель за изменениями в DOM
    const observer = new MutationObserver(checkModals);
    observer.observe(document.body, { childList: true, subtree: true });

    // Проверяем при монтировании
    checkModals();

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`wrapper ${isModalOpen ? 'overflow-hidden h-screen' : ''}`}>
      <Navigation />
      <main className="main">
        <div className="container mx-auto px-1 py-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default MainLayout;