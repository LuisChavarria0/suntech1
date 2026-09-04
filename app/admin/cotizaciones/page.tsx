import { redirect } from "next/navigation";
import { getSession } from "@/lib/cotizador/auth";
import { listQuoteLog } from "@/lib/cotizador/quotesLog";
import { QuotesLog } from "@/components/cotizador/QuotesLog";

export default async function AdminQuotesPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const { entries, availableMonths } = await listQuoteLog();

  return (
    <QuotesLog initialQuotes={entries} availableMonths={availableMonths} session={session} />
  );
}
