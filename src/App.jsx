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
const StudentPage = lazy(() => import('./pages/StudentPage/StudentPage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage/CategoryPage'));
const StatusPage = lazy(() => import('./pages/StatusPage/StatusPage'));
const  StatisticsPage = lazy(() => import('./pages/StatisticsPage/StatisticsPage'));

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
              <Route path="/students" element={<StudentPage />} />
              <Route path="/categories" element={<CategoryPage />} />
              <Route path="/statuses" element={<StatusPage />} />
                <Route path="/statistic" element={<StatisticsPage />} />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;