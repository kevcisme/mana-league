"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Calendar, Trophy, Settings, Home, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo from "@/assets/images/logo.png";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Schedule", href: "/schedule", icon: Calendar },
  { name: "Standings", href: "/standings", icon: TrendingUp },
  { name: "Game Recaps", href: "/recaps", icon: Trophy },
 
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b-4 border-primary bg-secondary shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative h-16 w-16 transition-transform group-hover:scale-105">
                <Image
                  src={logo}
                  alt="Mana League Logo"
                  fill
                  className="object-contain drop-shadow-lg"
                  priority
                />
              </div>
              <span className="font-display font-bold text-2xl text-primary-foreground tracking-tight">MANA LEAGUE</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Button
                    key={item.name}
                    variant={isActive ? "default" : "ghost"}
                    asChild
                    className={cn(
                      "flex items-center space-x-2 font-display font-bold tracking-wide",
                      isActive ? "shadow-md" : "text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary/20"
                    )}
                  >
                    <Link href={item.href}>
                      <Icon className="h-5 w-5" />
                      <span>{item.name.toUpperCase()}</span>
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden pb-3">
          <div className="flex items-center gap-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  asChild
                  className={cn(
                    "flex-1 flex items-center justify-center space-x-1 font-display font-bold",
                    !isActive && "text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary/20"
                  )}
                >
                  <Link href={item.href}>
                    <Icon className="h-4 w-4" />
                    <span className="text-xs">{item.name.toUpperCase()}</span>
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}