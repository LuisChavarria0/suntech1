import { redirect } from "next/navigation";
import { getSession } from "@/lib/cotizador/auth";
import { listUsers } from "@/lib/cotizador/users";
import { listAuditLog } from "@/lib/cotizador/auditLog";
import { UsersAdmin } from "@/components/cotizador/UsersAdmin";

export default async function AdminUsersPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }
  if (session.role !== "super_admin") {
    redirect("/admin/cotizador");
  }

  const [users, logs] = await Promise.all([listUsers(), listAuditLog()]);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="container-tight max-w-4xl">
        <UsersAdmin initialUsers={users} initialLogs={logs} currentUserId={session.userId} />
      </div>
    </div>
  );
}
