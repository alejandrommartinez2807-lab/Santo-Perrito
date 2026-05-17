import {
  Flame,
  MapPin,
  MessageCircle,
  Star,
  UtensilsCrossed,
} from "lucide-react"

const WHATSAPP_URL = "https://wa.me/584144841618"
const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/qAAHRjoTeYByH2We8"

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-[#d90404] px-4 pb-16 pt-10 sm:pt-16 md:py-24"
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#7a0000_0%,#d90404_38%,#ff1e00_68%,#ffba08_130%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_16%,rgba(255,220,70,0.55),transparent_28%),radial-gradient(circle_at_82%_45%,rgba(255,184,8,0.28),transparent_34%),radial-gradient(circle_at_15%_78%,rgba(0,0,0,0.38),transparent_38%)]" />
      <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[#2b0000]/80 to-transparent" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-8 md:grid-cols-[1fr_0.85fr] md:gap-10">
        <div className="text-center md:text-left">
          <img
            src="/logoremovebg.png"
            alt="Santo Perrito"
            className="mx-auto mb-7 h-80 w-80 object-contain drop-shadow-[0_0_48px_rgba(255,214,10,0.58)] sm:h-96 sm:w-96 md:hidden"
          />

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-yellow-300/30 bg-black/35 px-5 py-3 text-[0.68rem] font-black uppercase tracking-[0.22em] text-yellow-200 shadow-[0_8px_22px_rgba(0,0,0,0.25)] backdrop-blur sm:text-sm">
            <Flame size={16} />
            Tu lugar favorito para unos buenos perros
          </div>

          <h1 className="mx-auto max-w-4xl text-6xl font-black uppercase leading-[0.86] tracking-[-0.08em] text-yellow-300 drop-shadow-[0_6px_0_rgba(70,0,0,0.65)] sm:text-7xl md:mx-0 md:text-8xl lg:text-9xl">
            Santo Perrito
          </h1>

          <p className="mt-5 text-2xl font-black uppercase tracking-[0.22em] text-white sm:text-3xl">
            Perros, delicias y bebidas
          </p>

          <p className="mx-auto mt-6 max-w-2xl text-base font-bold leading-relaxed text-yellow-50 sm:text-lg md:mx-0 md:text-xl">
            Perros calientes cargados, delicias para compartir y bebidas frías.
            Una experiencia rápida, sabrosa y con todo el sabor de Santo
            Perrito.
          </p>

          <div className="mt-9 grid gap-3 sm:grid-cols-2 md:max-w-2xl">
            <a
              href="#menu"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 px-6 py-4 text-sm font-black uppercase tracking-[0.08em] text-[#460000] shadow-[0_0_28px_rgba(255,214,10,0.35)] transition hover:scale-105"
            >
              <UtensilsCrossed size={19} />
              Ver menú
            </a>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-black/75 px-6 py-4 text-sm font-black uppercase tracking-[0.08em] text-yellow-300 shadow-[0_0_22px_rgba(0,0,0,0.35)] transition hover:scale-105"
            >
              <MessageCircle size={19} />
              Pedir ahora
            </a>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 md:max-w-2xl">
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-yellow-300/35 bg-red-950/45 px-6 py-4 text-sm font-black uppercase tracking-[0.08em] text-yellow-100 shadow-[0_0_22px_rgba(0,0,0,0.20)] backdrop-blur transition hover:scale-105 hover:bg-red-900/70"
            >
              <MapPin size={19} />
              Ubicación
            </a>

            <a
              href="#resena"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-yellow-300/35 bg-red-950/45 px-6 py-4 text-sm font-black uppercase tracking-[0.08em] text-yellow-100 shadow-[0_0_22px_rgba(0,0,0,0.20)] backdrop-blur transition hover:scale-105 hover:bg-red-900/70"
            >
              <Star size={19} />
              Agregar reseña
            </a>
          </div>
        </div>

        <div className="relative mx-auto hidden max-w-md items-center justify-center md:flex">
          <div className="absolute h-[28rem] w-[28rem] rounded-full bg-yellow-300/25 blur-3xl" />
          <div className="absolute h-80 w-80 rounded-full bg-red-950/40 blur-2xl" />

          <img
            src="/logoremovebg.png"
            alt="Santo Perrito"
            className="relative w-full max-w-md object-contain drop-shadow-[0_0_50px_rgba(255,214,10,0.48)] lg:max-w-lg"
          />
        </div>
      </div>
    </section>
  )
}