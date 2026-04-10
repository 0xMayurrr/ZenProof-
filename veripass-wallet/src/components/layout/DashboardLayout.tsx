import { Link, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "./Navbar";
import { LayoutDashboard, Wallet, Share2, Settings, Building2, FilePlus, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const userLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/credentials", label: "My Credentials", icon: Wallet },
  { to: "/achievements", label: "My Achievements", icon: Trophy },
  { to: "/sharing", label: "Sharing", icon: Share2 },
  { to: "/profile", label: "Settings", icon: Settings },
];

const issuerLinks = [
  { to: "/issuer/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/issuer/issue", label: "Issue Credential", icon: FilePlus },
  { to: "/credentials", label: "All Issued", icon: Wallet },
  { to: "/issuer/profile", label: "Organization", icon: Building2 },
  { to: "/profile", label: "Settings", icon: Settings },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const links = user?.role === "issuer" ? issuerLinks : userLinks;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex pt-16">
        {/* Sidebar - desktop */}
        <aside className="hidden lg:flex w-64 flex-col fixed left-0 top-16 bottom-0 border-r border-border/50 bg-card/30 backdrop-blur-sm p-4">
          <nav className="flex flex-col gap-1 mt-4">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === link.to
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Mobile bottom nav */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border/50 bg-background/90 backdrop-blur-xl">
          <div className="flex justify-around py-2">
            {links.slice(0, 4).map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-1.5 text-xs transition-colors",
                  location.pathname === link.to ? "text-primary" : "text-muted-foreground"
                )}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
