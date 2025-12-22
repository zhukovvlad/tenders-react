import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LogOut, Moon, Settings, Sun, User } from "lucide-react";
import { useTheme } from "../providers/theme-provider";
import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";
import { useAuth } from "../../auth/AuthContext";

const Navbar = () => {
  const { setTheme } = useTheme();
  const { user, logout } = useAuth();
  const nav = useNavigate();

  async function onLogout() {
    await logout();
    nav("/login", { replace: true });
  }

  return (
    <nav className="p-4 flex items-center justify-between">
      {/* LEFT */}
      {/* <div className="text-lg font-bold">My App</div> */}
      <SidebarTrigger className="cursor-pointer" />

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <Link to="/" className="">
          Dashboard
        </Link>

        {/* THEME MENU */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="cursor-pointer">
              <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setTheme("light")}
            >
              Light
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setTheme("dark")}
            >
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setTheme("system")}
            >
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* USER MENU */}
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>
                {(user?.email?.[0] || "U").toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={10}>
            <DropdownMenuLabel>
              {user ? `${user.email} (${user.role})` : "My Account"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="h-[1.2rem] w-[1.2rem] mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link to="settings" className="flex items-center gap-2">
                <Settings className="h-[1.2rem] w-[1.2rem] mr-2" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" variant="destructive" onClick={onLogout}>
              <LogOut className="h-[1.2rem] w-[1.2rem] mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
