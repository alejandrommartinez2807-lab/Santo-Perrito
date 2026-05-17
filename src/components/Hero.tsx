import {
  Flame,
  MapPin,
  MessageCircle,
  Star,
  UtensilsCrossed,
} from "lucide-react"

const WHATSAPP_URL = "https://wa.me/584227377486"
const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/qAAHRjoTeYByH2We8"

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-[#fff7e8] px-4 pb-16 pt-10 sm:pt-16 md:py-24"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_50%,rgba(180,0,0,0.08),transparent_34%),radial-gradient(circle_at_15%_75%,rgba(160,0,0,0.06),transparent_34%)]" />

      <div className="absolute left-0 top-0 h-full w-4 bg-[#a00000]" />
      <div className="absolute right-0 top-0 h-full w-4 bg-[#a00000]" />

      <div className="absolute inset-x-0 bottom-0 h-8 bg-[linear-gradient(45deg,#a00000_25%,transparent_25%),linear-gradient(-45deg,#a00000_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#a00000_75%),linear-gradient(-45deg,transparent_75%,#a00000_75%)] bg-[length:32px_32px] bg-[position:0_0,0_16px,16px_-16px,-16px_0] bg-[#fff7e8]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[1fr_0.9fr]">
        <div className="text-center md:text-left">
          <img
            src="/logoremovebg.png"
            alt="Santo Perrito"
            className="mx-auto mb-7 h-72 w-72 object-contain drop-shadow-[0_14px_24px_rgba(160,0,0,0.18)] sm:h-96 sm:w-96 md:hidden"
          />

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-[#a00000] bg-white px-5 py-3 text-[0.68rem] font-black uppercase tracking-[0.22em] text-[#a00000] shadow-[0_8px_0_rgba(160,0,0,0.12)] sm:text-sm">
            <Flame size={16} />
            Tu lugar favorito para unos buenos perros
          </div>

          <h1 className="mx-auto max-w-4xl text-6xl font-black uppercase leading-[0.86] tracking-[-0.08em] text-[#a00000] drop-shadow-[0_5px_0_rgba(255,211,0,0.8)] sm:text-7xl md:mx-0 md:text-8xl lg:text-9xl">
            Santo Perrito
          </h1>

          <p className="mt-5 text-2xl font-black uppercase tracking-[0.22em] text-[#220000] sm:text-3xl">
            Perritos, raciones y bebidas
          </p>

          <p className="mx-auto mt-6 max-w-2xl text-base font-bold leading-relaxed text-[#3a0000] sm:text-lg md:mx-0 md:text-xl">
            Perros calientes cargados, salchipapas, raciones y bebidas frías
            con el sabor original de Santo Perrito.
          </p>

          <div className="mt-9 grid gap-3 sm:grid-cols-2 md:max-w-2xl">
            <a
              href="#menu"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#a00000] bg-[#a00000] px-6 py-4 text-sm font-black uppercase tracking-[0.08em] text-white shadow-[0_8px_0_rgba(90,0,0,0.22)] transition hover:scale-105"
            >
              <UtensilsCrossed size={19} />
              Ver menú
            </a>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#a00000] bg-yellow-300 px-6 py-4 text-sm font-black uppercase tracking-[0.08em] text-[#4a0000] shadow-[0_8px_0_rgba(160,0,0,0.16)] transition hover:scale-105"
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
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#a00000] bg-white px-6 py-4 text-sm font-black uppercase tracking-[0.08em] text-[#a00000] shadow-[0_8px_0_rgba(160,0,0,0.10)] transition hover:scale-105 hover:bg-yellow-100"
            >
              <MapPin size={19} />
              Ubicación
            </a>

            <a
              href="#resena"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#a00000] bg-white px-6 py-4 text-sm font-black uppercase tracking-[0.08em] text-[#a00000] shadow-[0_8px_0_rgba(160,0,0,0.10)] transition hover:scale-105 hover:bg-yellow-100"
            >
              <Star size={19} />
              Agregar reseña
            </a>
          </div>
        </div>

        <div className="relative mx-auto hidden max-w-md items-center justify-center md:flex">
          <div className="absolute h-[28rem] w-[28rem] rounded-full bg-white/85 blur-3xl" />
          <div className="absolute h-[24rem] w-[24rem] rounded-full border-[18px] border-[#a00000]/10" />

          <div className="relative rounded-[2rem] border-4 border-[#a00000] bg-white p-8 shadow-[0_18px_0_rgba(160,0,0,0.14)]">
            <img
              src="/logoremovebg.png"
              alt="Santo Perrito"
              className="relative w-full max-w-md object-contain drop-shadow-[0_16px_18px_rgba(160,0,0,0.16)] lg:max-w-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}