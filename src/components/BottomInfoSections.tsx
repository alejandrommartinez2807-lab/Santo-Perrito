import {
  Camera,
  MapPin,
  MessageCircle,
  Star,
  Clock,
  Smartphone,
} from "lucide-react"

const WHATSAPP_URL = "https://wa.me/584227377486"
const INSTAGRAM_URL = "https://www.instagram.com/santoperritoval/"
const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/qAAHRjoTeYByH2We8"

export default function BottomInfoSections() {
  return (
    <section className="relative overflow-hidden bg-[#fff7e8] px-4 py-16 text-[#220000] sm:px-6 sm:py-24">
      <div className="absolute inset-x-0 top-0 h-8 bg-[linear-gradient(45deg,#a00000_25%,transparent_25%),linear-gradient(-45deg,#a00000_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#a00000_75%),linear-gradient(-45deg,transparent_75%,#a00000_75%)] bg-[length:32px_32px] bg-[position:0_0,0_16px,16px_-16px,-16px_0] bg-[#fff7e8]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,211,0,0.24),transparent_32%),radial-gradient(circle_at_right,rgba(160,0,0,0.08),transparent_34%)]" />

      <div className="relative mx-auto max-w-7xl">
        <div
          id="ubicacion"
          className="overflow-hidden rounded-[2rem] border-4 border-[#a00000] bg-white shadow-[0_12px_0_rgba(160,0,0,0.14),0_24px_38px_rgba(80,0,0,0.12)]"
        >
          <div className="h-6 bg-[linear-gradient(45deg,#a00000_25%,transparent_25%),linear-gradient(-45deg,#a00000_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#a00000_75%),linear-gradient(-45deg,transparent_75%,#a00000_75%)] bg-[length:32px_32px] bg-[position:0_0,0_16px,16px_-16px,-16px_0] bg-[#fff7e8]" />

          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-7 sm:p-10 lg:p-12">
              <div className="mb-6 inline-flex rounded-[0.55rem] bg-[#a00000] px-5 py-2 shadow-[0_6px_0_rgba(90,0,0,0.18)]">
                <p className="text-xl font-black uppercase tracking-[-0.02em] text-yellow-300 sm:text-3xl">
                  Encuéntranos
                </p>
              </div>

              <h2 className="max-w-3xl text-5xl font-black uppercase leading-[0.88] tracking-[-0.07em] text-[#a00000] drop-shadow-[0_4px_0_rgba(255,211,0,0.75)] sm:text-6xl lg:text-7xl">
                Visita Santo Perrito
              </h2>

              <p className="mt-6 max-w-2xl text-base font-bold leading-relaxed text-[#3a0000]/82 sm:text-lg">
                Estamos listos para recibirte con perritos, salchipapas,
                raciones y bebidas frías. Abre nuestra ubicación en Google Maps
                y ven por tu antojo.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-3 rounded-full border-2 border-[#a00000] bg-[#a00000] px-6 py-4 text-sm font-black uppercase tracking-[0.1em] text-white shadow-[0_7px_0_rgba(90,0,0,0.22)] transition hover:scale-105"
                >
                  <MapPin size={20} />
                  Abrir ubicación
                </a>

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-3 rounded-full border-2 border-[#a00000] bg-yellow-300 px-6 py-4 text-sm font-black uppercase tracking-[0.1em] text-[#4a0000] shadow-[0_7px_0_rgba(160,0,0,0.16)] transition hover:scale-105"
                >
                  <MessageCircle size={20} />
                  WhatsApp
                </a>
              </div>
            </div>

            <div className="border-t-4 border-[#a00000] bg-[#fff7e8] p-7 sm:p-10 lg:border-l-4 lg:border-t-0 lg:p-12">
              <div className="grid gap-4">
                <article className="rounded-[1.6rem] border-2 border-[#a00000] bg-white p-5 shadow-[0_7px_0_rgba(160,0,0,0.12)]">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#a00000] bg-yellow-300 text-[#4a0000]">
                      <Clock size={22} />
                    </div>

                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#a00000]">
                        Horario
                      </p>

                      <p className="mt-2 text-lg font-black text-[#220000]">
                        Lunes a jueves: 6:00 p.m a 11:00 p.m
                      </p>

                      <p className="mt-1 text-lg font-black text-[#220000]">
                        Viernes a domingo: 6:00 p.m a 12:30 a.m
                      </p>
                    </div>
                  </div>
                </article>

                <article
                  id="resena"
                  className="rounded-[1.6rem] border-2 border-[#a00000] bg-white p-5 shadow-[0_7px_0_rgba(160,0,0,0.12)]"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#a00000] bg-yellow-300 text-[#4a0000]">
                      <Star size={22} />
                    </div>

                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#a00000]">
                        Reseñas
                      </p>

                      <p className="mt-2 text-base font-bold leading-6 text-[#3a0000]/78">
                        Después de probar tu pedido, puedes apoyar el negocio
                        dejando tu reseña o compartiendo la página.
                      </p>
                    </div>
                  </div>
                </article>

                <article className="rounded-[1.6rem] border-2 border-[#a00000] bg-white p-5 shadow-[0_7px_0_rgba(160,0,0,0.12)]">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#a00000] bg-yellow-300 text-[#4a0000]">
                      <Smartphone size={22} />
                    </div>

                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#a00000]">
                        Pedido rápido
                      </p>

                      <p className="mt-2 text-base font-bold leading-6 text-[#3a0000]/78">
                        Agrega productos al carrito y registra el pedido en el
                        local o envíalo directamente por WhatsApp.
                      </p>
                    </div>
                  </div>
                </article>

                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-3 rounded-full border-2 border-[#a00000] bg-white px-6 py-4 text-sm font-black uppercase tracking-[0.1em] text-[#a00000] shadow-[0_7px_0_rgba(160,0,0,0.12)] transition hover:scale-105 hover:bg-yellow-100"
                >
                  <Camera size={20} />
                  @santoperritoval
                </a>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-12 rounded-[1.6rem] border-2 border-[#a00000] bg-white px-5 py-6 text-center shadow-[0_8px_0_rgba(160,0,0,0.12)]">
          <img
            src="/logoremovebg.png"
            alt="Santo Perrito"
            className="mx-auto h-20 w-20 object-contain"
          />

          <p className="mt-4 text-sm font-black uppercase tracking-[0.28em] text-[#a00000]">
            Santo Perrito
          </p>

          <p className="mt-2 text-sm font-bold text-[#3a0000]/70">
            Perritos, salchipapas, raciones y bebidas.
          </p>
        </footer>
      </div>
    </section>
  )
}