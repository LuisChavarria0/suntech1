import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CotizadorCalculator } from "@/components/cotizador/CotizadorCalculator";
import { COMPANY_INFO } from "@/lib/data/company";

export const metadata: Metadata = {
  title: "Calcular el ahorro | Grupo Suntech",
};

export default function CotizadorPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-navy-100">
        <div className="container-tight py-4">
          <Link href="/">
            <Image
              src={COMPANY_INFO.logoUrl}
              alt="Grupo Suntech"
              width={280}
              height={84}
              className="h-11 w-auto object-contain"
              priority
            />
          </Link>
        </div>
      </header>

      <main className="container-tight py-10 md:py-14">
        <h1 className="text-2xl md:text-3xl font-bold text-navy-900 mb-2 text-center">
          Calcula el ahorro de tu sistema solar
        </h1>
        <p className="text-slate-500 text-center max-w-xl mx-auto mb-10">
          Ingresa el consumo promedio de tu factura eléctrica y te mostramos una propuesta estimada al instante.
        </p>
        <CotizadorCalculator />
      </main>
    </div>
  );
}
