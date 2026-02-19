import { useAuth } from '../../context/AuthContext';
import Container from '../../components/ui/Container';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import CalendarComponent from '../../components/ui/Calendar';

function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <Container>
      <CalendarComponent />
    </Container>
  );
}

export default HomePage;