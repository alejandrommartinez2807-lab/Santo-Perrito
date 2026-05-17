"use client"

import { Flame, MapPin, MessageCircle } from "lucide-react"

const WHATSAPP_URL = "https://wa.me/584227377486"
const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/qAAHRjoTeYByH2We8"

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-[#fff7e8] px-4 pb-14 pt-6 text-[#220000] sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[2rem] border-4 border-[#a00000] bg-white shadow-[0_12px_0_rgba(160,0,0,0.14)]">
          <div className="h-6 bg-[linear-gradient(45deg,#a00000_25%,transparent_25%),linear-gradient(-45deg,#a00000_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#a00000_75%),linear-gradient(-45deg,transparent_75%,#a00000_75%)] bg-[length:32px_32px] bg-[position:0_0,0_16px,16px_-16px,-16px_0] bg-[#fff7e8]" />

          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="flex min-h-[430px] flex-col justify-center border-b-4 border-[#a00000] bg-[#fffaf0] p-6 sm:p-10 lg:border-b-0 lg:border-r-4">
              <div className="mx-auto flex w-full max-w-[430px] flex-col items-center justify-center">
                <div className="flex min-h-[300px] w-full items-center justify-center rounded-[2rem] border-2 border-[#a00000]/15 bg-white px-8 py-10 shadow-[0_10px_30px_rgba(160,0,0,0.08)] sm:min-h-[360px]">
                  <img
                    src="/logoremovebg.png"
                    alt="Santo Perrito"
                    className="h-[210px] w-[210px] object-contain drop-shadow-[0_14px_18px_rgba(80,0,0,0.12)] sm:h-[270px] sm:w-[270px]"
                  />
                </div>

                <div className="mt-8 flex w-full items-center justify-center gap-3 rounded-full border-2 border-[#a00000] bg-white px-5 py-4 shadow-[0_7px_0_rgba(160,0,0,0.12)]">
                  <Flame size={19} className="shrink-0 text-[#a00000]" />

                  <p className="text-center text-xs font-black uppercase leading-6 tracking-[0.32em] text-[#a00000] sm:text-sm">
                    Tu lugar favorito para unos buenos perros
                  </p>
                </div>
              </div>
            </div>

            <div className="flex min-h-[500px] flex-col justify-center bg-[#fff7e8] p-6 sm:p-10">
              <p className="text-xs font-black uppercase tracking-[0.38em] text-[#a00000]">
                Santo Perrito
              </p>

              <h1 className="mt-4 max-w-3xl text-[4.2rem] font-black uppercase leading-[0.82] tracking-[-0.06em] text-[#a00000] drop-shadow-[0_6px_0_rgba(255,211,0,0.95)] sm:text-8xl lg:text-9xl">
                Santo Perrito
              </h1>

              <p className="mt-7 max-w-2xl text-[1.55rem] font-black uppercase leading-tight tracking-[0.22em] text-[#220000] sm:text-4xl">
                Perritos, raciones y bebidas
              </p>

              <p className="mt-6 max-w-2xl text-base font-bold leading-8 text-[#3a0000]/78 sm:text-lg">
                Perros calientes cargados, salchipapas, raciones y bebidas
                frías para disfrutar en el local o pedir directo por WhatsApp.
              </p>

              <div className="mt-9 grid gap-3 sm:grid-cols-2">
                <a
                  href="#menu"
                  className="inline-flex items-center justify-center rounded-full border-2 border-[#a00000] bg-yellow-300 px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-[#4a0000] shadow-[0_6px_0_rgba(160,0,0,0.18)] transition hover:scale-[1.02] hover:bg-yellow-200"
                >
                  Ver menú
                </a>

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-3 rounded-full border-2 border-[#a00000] bg-[#a00000] px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-white shadow-[0_6px_0_rgba(160,0,0,0.18)] transition hover:scale-[1.02] hover:bg-yellow-300 hover:text-[#4a0000]"
                >
                  <MessageCircle size={19} />
                  WhatsApp
                </a>
              </div>

              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center gap-3 rounded-full border-2 border-[#a00000] bg-white px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-[#a00000] shadow-[0_6px_0_rgba(160,0,0,0.12)] transition hover:scale-[1.02] hover:bg-yellow-100 sm:w-fit"
              >
                <MapPin size={19} />
                Abrir ubicación
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}