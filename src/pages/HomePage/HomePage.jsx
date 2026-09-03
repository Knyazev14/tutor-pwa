
import CalendarComponent from '../../components/ui/Calendar';
import LoginPage from '../../pages/LoginPage/LoginPage'
import { useAuth } from '../../context/AuthContext';

function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <>
     {isAuthenticated ? <CalendarComponent /> : <LoginPage />}
    </>
  );
}

export default HomePage;