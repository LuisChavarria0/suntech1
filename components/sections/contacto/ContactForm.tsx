"use client";

import { WhatsAppIcon } from "@/components/ui/icons/WhatsAppIcon";
import { WHATSAPP_NUMBER } from "@/lib/data/company";

export function ContactForm() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const name = (form.elements.namedItem("name") as HTMLInputElement)
          ?.value;
        const service = (
          form.elements.namedItem("service") as HTMLSelectElement
        )?.value;
        const message = (
          form.elements.namedItem("message") as HTMLTextAreaElement
        )?.value;
        const text = encodeURIComponent(
          `Hola, soy ${name}. Me interesa el servicio de ${service}. ${message}`
        );
        window.open(
          `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${text}`,
          "_blank"
        );
      }}
      className="space-y-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="name"
            className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2"
          >
            Nombre
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Tu nombre completo"
            className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm text-navy-900 placeholder:text-slate-400 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all"
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2"
          >
            Teléfono
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Tu número de teléfono"
            className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm text-navy-900 placeholder:text-slate-400 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="service"
          className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2"
        >
          Servicio de interés
        </label>
        <select
          id="service"
          name="service"
          className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm text-navy-900 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all bg-white"
        >
          <option value="Energía Solar">Energía Solar</option>
          <option value="Seguridad Electrónica">Seguridad Electrónica</option>
          <option value="Tecnología">Tecnología</option>
          <option value="otro">Otro / No estoy seguro</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2"
        >
          Mensaje
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          placeholder="Describe tu proyecto o necesidad..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-navy-900 placeholder:text-slate-400 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all resize-none"
        />
      </div>

      <button
        type="submit"
        className="btn-shine w-full h-14 bg-navy-800 hover:bg-navy-700 text-white text-lg font-bold rounded-xl shadow-lg transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
      >
        <WhatsAppIcon className="h-5 w-5" />
        Enviar por WhatsApp
      </button>

      <p className="text-xs text-slate-400 text-center">
        Al enviar, se abrirá WhatsApp con tu mensaje listo para enviar.
      </p>
    </form>
  );
}
