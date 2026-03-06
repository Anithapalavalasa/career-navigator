import { Button } from "@/components/ui/button";
import {
    Bell,
    LayoutDashboard,
    LogOut,
    Shield
} from "lucide-react";
import { Link, useLocation } from "wouter";

export function AdminNav() {
    const [location] = useLocation();
    const adminRole = typeof window !== "undefined" ? localStorage.getItem("adminRole") : null;
    const adminUsername = typeof window !== "undefined" ? localStorage.getItem("adminUsername") : null;
    const isMainAdmin = adminRole === "main_admin";

    const handleLogout = () => {
        localStorage.removeItem("adminRole");
        localStorage.removeItem("adminUsername");
        window.location.href = "/admin/login";
    };

    const navItems = [
        {
            label: "Dashboard",
            icon: <LayoutDashboard className="w-4 h-4" />,
            href: "/admin/dashboard",
            active: location === "/admin/dashboard"
        },
        {
            label: "Notifications",
            icon: <Bell className="w-4 h-4" />,
            href: "/admin/notifications",
            active: location === "/admin/notifications"
        },
    ];

    if (isMainAdmin) {
        navItems.push({
            label: "Account Management",
            icon: <Shield className="w-4 h-4" />,
            href: "/admin/management",
            active: location === "/admin/management"
        });
    }

    return (
        <div className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Left: Navigation Tabs */}
                    <nav className="flex items-center gap-2 h-full">
                        {navItems.map((item) => (
                            <Link key={item.label} href={item.href}>
                                <a className={`relative flex items-center gap-2 px-5 h-full text-xs font-black uppercase tracking-widest transition-all duration-200 group ${item.active
                                    ? "text-blue-700"
                                    : "text-slate-500 hover:text-slate-900"
                                    }`}>
                                    <span className={item.active ? "text-amber-500" : "text-slate-400 group-hover:text-amber-500/70 transition-colors"}>
                                        {item.icon}
                                    </span>
                                    {item.label}
                                    {item.active && (
                                        <div className="absolute bottom-0 left-0 right-0 top-5 h-1 bg-amber-500 shadow-[0_-2px_10px_rgba(245,158,11,0.4)]" />
                                    )}
                                    {!item.active && (
                                        <div className="absolute bottom-0 left-0 right-0 top-5 h-1 bg-transparent group-hover:bg-slate-100 transition-colors" />
                                    )}
                                </a>
                            </Link>
                        ))}
                    </nav>

                    {/* Right: User Info & Actions */}
                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex flex-col text-right">
                            <div className="flex items-center justify-end gap-2 mb-0.5">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">
                                    {adminUsername || "Admin User"}
                                </span>
                            </div>
                            <span className="text-[9px] text-amber-600 font-bold uppercase tracking-tight leading-none opacity-80">
                                {adminRole?.replace("_", " ") || "Administrator"}
                            </span>
                        </div>

                        <Button
                            onClick={handleLogout}
                            variant="ghost"
                            size="sm"
                            className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl px-4 h-10 font-black uppercase text-[10px] tracking-widest transition-all border border-transparent hover:border-red-100"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
}
