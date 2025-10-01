import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BarChart3, ChevronLeft, ChevronRight, Home, Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";

export function ProviderComponent({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/" },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 h-screen",
          "bg-card border-r border-border",
          "transition-all duration-300 ease-in-out",
          isOpen ? "w-64" : "w-20",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {isOpen && (
            <h1 className="text-xl font-bold text-foreground truncate">
              Dashboard
            </h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="hidden lg:flex ml-auto h-8 w-8"
          >
            {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden ml-auto h-8 w-8"
          >
            <X size={18} />
          </Button>
        </div>

        {/* Menu Items */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setActiveMenu(item.label)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md",
                "text-sm font-medium transition-colors duration-200",
                !isOpen && "justify-center",
                activeMenu === item.label
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
              title={!isOpen ? item.label : ""}
            >
              <item.icon size={20} className="flex-shrink-0" />
              {isOpen && (
                <span className="truncate">{item.label}</span>
              )}
            </a>
          ))}
        </nav>

       
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-card border-b border-border p-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileOpen(true)}
          >
            <Menu size={24} />
          </Button>
          <h1 className="text-lg font-bold text-foreground">Dashboard</h1>
          <div className="w-10" /> {/* Spacer */}
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}