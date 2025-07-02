import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import Navbar from "./Navbar";
import { ThemeProvider } from "../providers/theme-provider";
import { SidebarProvider } from "../ui/sidebar";

const Layout = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider defaultOpen={true}>
        {/* <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]"> */}
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 overflow-y-auto">
            <Navbar />
            {/* Все дочерние страницы будут отрендерены здесь */}
            <div className="px-4">
              <Outlet />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default Layout;
