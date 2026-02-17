import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Container from '../../components/ui/Container';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <Container>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary-500 mb-4">
          Добро пожаловать в TutorApp
        </h1>
        <p className="text-xl text-gray-600">
          Управляйте своим расписанием легко и удобно
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="text-center hover:scale-105 transition-transform duration-300">
          <div className="text-4xl mb-4">📅</div>
          <h3 className="text-xl font-semibold mb-2">Управление бронями</h3>
          <p className="text-gray-600 mb-4">
            Просматривайте и управляйте всеми бронями в одном месте
          </p>
          <Button to="/books" variant="primary">
            Перейти к броням
          </Button>
        </Card>

        <Card className="text-center hover:scale-105 transition-transform duration-300">
          <div className="text-4xl mb-4">🔐</div>
          <h3 className="text-xl font-semibold mb-2">Безопасный вход</h3>
          <p className="text-gray-600 mb-4">
            JWT аутентификация для защиты ваших данных
          </p>
          {!isAuthenticated && (
            <Button to="/login" variant="outlined">
              Войти в систему
            </Button>
          )}
        </Card>

        <Card className="text-center hover:scale-105 transition-transform duration-300">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-xl font-semibold mb-2">Быстрый доступ</h3>
          <p className="text-gray-600 mb-4">
            PWA приложение работает офлайн и быстро загружается
          </p>
          <Button variant="secondary">Узнать больше</Button>
        </Card>
      </div>
    </Container>
  );
}

export default HomePage;