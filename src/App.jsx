import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './pages/Layout/MainLayout';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Ленивая загрузка страниц
const HomePage = lazy(() => import('./pages/HomePage/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage/LoginPage'));
const BookPage = lazy(() => import('./pages/BookPage/BookPage'));
const LessonPage = lazy(() => import('./pages/LessonPage/LessonPage'));

function App() {
  return (
    <BrowserRouter basename="/tutor-pwa">
      <AuthProvider>
        {/* Suspense показывает лоадер пока грузится страница */}
        <Suspense fallback={<LoadingSpinner fullScreen />}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/books" element={<BookPage />} />
              <Route path="/lessons" element={<LessonPage />} />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;