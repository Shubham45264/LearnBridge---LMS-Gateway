import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const MainLayout = () => (
  <div className="min-h-screen flex flex-col bg-mesh">
    <Navbar />
    <main className="flex-1 pt-20">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default MainLayout;
