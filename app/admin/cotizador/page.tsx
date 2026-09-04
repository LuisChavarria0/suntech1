import { redirect } from "next/navigation";
import { getSession } from "@/lib/cotizador/auth";
import { readCotizadorConfig } from "@/lib/cotizador/config";
import { AdminEditor } from "@/components/cotizador/AdminEditor";

export default async function AdminCotizadorPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const config = await readCotizadorConfig();

  return <AdminEditor initialConfig={config} session={session} />;
}
