
"use client";

import { PencilRuler, User, LogOut, MoreVertical, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { ThemeToggleSwitch } from "./ui/theme-toggle-switch";
import { useState } from "react";
import { ProfileCard } from "./profile-card";


type HeaderProps = {
  showDashboardButton?: boolean;
  showAuthButtons?: boolean;
  showUserMenu?: boolean;
};

export default function Header({ 
  showDashboardButton = false, 
  showAuthButtons = false,
  showUserMenu = true 
}: HeaderProps) {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogoutClick = () => {
    router.push('/auth');
  }

  return (
    <>
    {showUserMenu && <ProfileCard open={isProfileOpen} onOpenChange={setIsProfileOpen} />}
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center">
          <PencilRuler className="h-6 w-6 text-primary" />
          <span className="ml-2 text-xl font-bold font-headline">
            SmartForms
          </span>
        </Link>
        
        <div className="flex items-center gap-2">
          {showDashboardButton && (
            <Button variant="ghost" onClick={() => router.push('/dashboard')}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          )}
          
          {showAuthButtons && (
            <>
              <Button variant="ghost" onClick={() => router.push('/auth')}>
                Sign In
              </Button>
              <Button onClick={() => router.push('/auth')}>
                Sign Up
              </Button>
            </>
          )}
          
          {showUserMenu && (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5" />
                        <span className="sr-only">More options</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsProfileOpen(true)}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogoutClick}>
                         <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <div className="flex items-center justify-between w-full">
                           <span>Theme</span>
                           <ThemeToggleSwitch />
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {!showUserMenu && (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5" />
                        <span className="sr-only">More options</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <div className="flex items-center justify-between w-full">
                           <span>Theme</span>
                           <ThemeToggleSwitch />
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
    </>
  );
}
