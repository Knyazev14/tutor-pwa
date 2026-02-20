import Navigation from "../../components/navigation/Navigation";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div className="wrapper">
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
