import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/navigation/Navigation';
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import BookPage from "./pages/BookPage/BookPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navigation />
        <Routes>
          <Route path="/tutor-pwa" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/books" element={<BookPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;