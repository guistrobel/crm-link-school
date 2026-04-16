"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Columns3,
  Users,
  UserCheck,
  CalendarCheck,
  Target,
  Bell,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/pipeline", icon: Columns3, label: "Pipeline" },
  { href: "/alunos", icon: Users, label: "Alunos" },
  { href: "/mentores", icon: UserCheck, label: "Mentores" },
  { href: "/mentorias", icon: CalendarCheck, label: "Mentorias" },
  { href: "/alertas", icon: Bell, label: "Alertas" },
];

export function Sidebar({ alertCount = 0 }: { alertCount?: number }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="flex flex-col w-60 bg-white border-r border-slate-200 h-full">
      {/* Logo */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-sm">L</span>
          </div>
          <div>
            <p className="font-bold text-blue-900 text-sm leading-tight">Simplificando</p>
            <p className="text-slate-400 text-xs">a Jornada</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-900"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className={cn("w-4.5 h-4.5", isActive ? "text-blue-700" : "text-slate-400")} size={18} />
              <span className="flex-1">{item.label}</span>
              {item.label === "Alertas" && alertCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {alertCount > 9 ? "9+" : alertCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-slate-100">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">
              {session?.user?.name?.charAt(0)?.toUpperCase() ?? "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{session?.user?.name ?? "Usuário"}</p>
            <p className="text-xs text-slate-400 truncate">{(session?.user as any)?.role ?? "MENTOR"}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-1"
        >
          <LogOut size={15} />
          Sair
        </button>
      </div>
    </aside>
  );
}
