import {
  Clock,
  MapPin,
  MessageCircle,
  Navigation,
  Smartphone,
  Star,
} from "lucide-react"

const WHATSAPP_URL = "https://wa.me/584227377486"
const INSTAGRAM_URL = "https://www.instagram.com/santoperritoval/"
const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/qAAHRjoTeYByH2We8"

export default function BottomInfoSections() {
  return (
    <section className="bg-[#fff7e8] px-4 py-14 text-[#220000] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border-4 border-[#a00000] bg-white shadow-[0_12px_0_rgba(160,0,0,0.14)]">
        <div className="h-6 bg-[linear-gradient(45deg,#a00000_25%,transparent_25%),linear-gradient(-45deg,#a00000_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#a00000_75%),linear-gradient(-45deg,transparent_75%,#a00000_75%)] bg-[length:32px_32px] bg-[position:0_0,0_16px,16px_-16px,-16px_0] bg-[#fff7e8]" />

        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div
            id="ubicacion"
            className="border-b-4 border-[#a00000] p-6 sm:p-10 lg:border-b-0 lg:border-r-4"
          >
            <div className="inline-flex rounded-lg bg-[#a00000] px-5 py-3 shadow-[0_6px_0_rgba(160,0,0,0.18)]">
              <p className="text-2xl font-black uppercase tracking-tight text-yellow-300 sm:text-3xl">
                Encuéntranos
              </p>
            </div>

            <h2 className="mt-7 max-w-2xl text-5xl font-black uppercase leading-[0.9] tracking-[-0.05em] text-[#a00000] drop-shadow-[0_5px_0_rgba(255,211,0,0.9)] sm:text-7xl">
              Visita Santo Perrito
            </h2>

            <p className="mt-6 max-w-2xl text-base font-bold leading-8 text-[#3a0000]/85 sm:text-lg">
              Estamos listos para recibirte con perritos, salchipapas, raciones
              y bebidas frías. Abre nuestra ubicación en Google Maps y ven por
              tu antojo.
            </p>

            <div className="mt-9 grid gap-3 sm:grid-cols-2">
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-full border-2 border-[#a00000] bg-[#a00000] px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-white shadow-[0_6px_0_rgba(160,0,0,0.18)] transition hover:scale-[1.02] hover:bg-[#c00000]"
              >
                <MapPin size={19} />
                Abrir ubicación
              </a>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-full border-2 border-[#a00000] bg-yellow-300 px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-[#4a0000] shadow-[0_6px_0_rgba(160,0,0,0.18)] transition hover:scale-[1.02] hover:bg-yellow-200"
              >
                <MessageCircle size={19} />
                WhatsApp
              </a>
            </div>
          </div>

          <div className="space-y-5 p-6 sm:p-10">
            <article className="rounded-[1.6rem] border-2 border-[#a00000] bg-[#fff7e8] p-5 shadow-[0_8px_0_rgba(160,0,0,0.12)]">
              <div className="flex gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[#a00000] bg-yellow-300 text-[#4a0000]">
                  <Clock size={27} />
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-[#a00000]">
                    Horario
                  </p>

                  <div className="mt-3 space-y-2 text-base font-black leading-7 text-[#220000] sm:text-lg">
                    <p>Lunes a jueves: 6:00 p.m. a 12:00 a.m.</p>
                    <p>Viernes a domingo: 6:00 p.m. a 1:00 a.m.</p>
                  </div>
                </div>
              </div>
            </article>

            <article id="reseña" className="rounded-[1.6rem] border-2 border-[#a00000] bg-[#fff7e8] p-5 shadow-[0_8px_0_rgba(160,0,0,0.12)]">
              <div className="flex gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[#a00000] bg-yellow-300 text-[#4a0000]">
                  <Star size={27} />
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-[#a00000]">
                    Reseñas
                  </p>

                  <p className="mt-3 text-base font-bold leading-7 text-[#3a0000]/85">
                    Después de probar tu pedido, puedes apoyar el negocio
                    dejando tu reseña o compartiendo la página.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-[1.6rem] border-2 border-[#a00000] bg-[#fff7e8] p-5 shadow-[0_8px_0_rgba(160,0,0,0.12)]">
              <div className="flex gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[#a00000] bg-yellow-300 text-[#4a0000]">
                  <Smartphone size={27} />
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-[#a00000]">
                    Pedido rápido
                  </p>

                  <p className="mt-3 text-base font-bold leading-7 text-[#3a0000]/85">
                    Agrega productos al carrito y registra el pedido en el local
                    o envíalo directamente por WhatsApp.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-[1.6rem] border-2 border-[#a00000] bg-[#fff7e8] p-5 shadow-[0_8px_0_rgba(160,0,0,0.12)]">
              <div className="flex gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[#a00000] bg-yellow-300 text-[#4a0000]">
                  <Navigation size={27} />
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-[#a00000]">
                    Redes
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <a
                      href={INSTAGRAM_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full border-2 border-[#a00000] bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-[#a00000] transition hover:bg-yellow-300 hover:text-[#4a0000]"
                    >
                      Instagram
                    </a>

                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full border-2 border-[#a00000] bg-[#a00000] px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:bg-yellow-300 hover:text-[#4a0000]"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}