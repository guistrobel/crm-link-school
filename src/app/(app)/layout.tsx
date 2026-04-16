import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SessionProvider } from "@/components/SessionProvider";
import { Sidebar } from "@/components/layout/Sidebar";
import { prisma } from "@/lib/prisma";

async function getAlertCount() {
  try {
    return await prisma.alerta.count({ where: { status: "PENDENTE" } });
  } catch {
    return 0;
  }
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const alertCount = await getAlertCount();

  return (
    <SessionProvider>
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        <Sidebar alertCount={alertCount} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </SessionProvider>
  );
}
