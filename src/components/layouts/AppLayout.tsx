import { Outlet } from "react-router-dom";
import { GlobalHeader } from "@/components/GlobalHeader";
import Footer from "@/components/Footer";

interface AppLayoutProps {
  variant?: "default" | "minimal";
}

export const AppLayout = ({ variant = "default" }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <GlobalHeader variant={variant} />
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default AppLayout;
