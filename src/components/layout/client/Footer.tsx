import Link from "next/link";
import { BRAND } from "@/src/config";
import { InstagramIcon } from "@/src/components/shared/icons/InstagramIcon";
import { TikTokIcon } from "@/src/components/shared/icons/TikTokIcon";
import { WhatsAppIcon } from "@/src/components/shared/icons/WhatsAppIcon";
import { XIcon } from "@/src/components/shared/icons/XIcon";
import { YouTubeIcon } from "@/src/components/shared/icons/YouTubeIcon";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-client-backgroundAlt text-client-textPlaceholder pt-10 pb-4">
      <div className="max-w-7xl mx-auto grid grid-cols-2 gap-8 px-10 md:grid-cols-4">
        <div>
          <h3 className="mb-2 text-base font-semibold text-client-text">
            Compañia
          </h3>

          <ul className="space-y-1 text-sm">
            <li>
              <Link
                href="/nosotros"
                className="hover:text-client-text transition"
              >
                Quienes somos
              </Link>
            </li>

            <li>
              <Link
                href="/proyectos"
                className="hover:text-client-text transition"
              >
                Portafolio
              </Link>
            </li>

            <li>
              <Link
                href="/membresias"
                className="hover:text-client-text transition"
              >
                Nuestros planes
              </Link>
            </li>

            <li>
              <Link
                href="/contactanos"
                className="hover:text-client-text transition"
              >
                Contáctanos
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-2 text-base font-semibold text-client-text">
            Sobre nosotros
          </h3>

          <ul className="space-y-1 text-sm">
            <li>
              <Link
                href="/nosotros#mision-vision"
                className="hover:text-client-text transition"
              >
                Misión
              </Link>
            </li>

            <li>
              <Link
                href="/nosotros#mision-vision"
                className="hover:text-client-text transition"
              >
                Visión
              </Link>
            </li>

            {/*
            <li>
              <Link
                href="/nosotros/#nuestro-equipo"
                className="hover:text-client-text transition"
              >
                Nuestro Equipo
              </Link>
            </li>
            */}
          </ul>
        </div>

        <div>
          <h3 className="mb-2 text-base font-semibold text-client-text">
            Contacto
          </h3>

          <p className="text-sm">+57 {process.env.NEXT_PUBLIC_COMPANY_PHONE}</p>
          <p className="text-sm">{process.env.NEXT_PUBLIC_COMPANY_EMAIL}</p>
        </div>

        <div className="flex flex-col items-start gap-2">
          <h3 className="text-base font-semibold text-client-text">
            Contáctanos
          </h3>

          <Link
            href={`https://wa.me/${process.env.NEXT_PUBLIC_COMPANY_PHONE}`}
            target="_blank"
            aria-label="WhatsApp"
            className="bg-transparent border border-green-500 text-green-500 px-4 py-2 rounded-full shadow-md text-sm font-medium hover:bg-green-500 hover:text-white transition whitespace-nowrap"
          >
            WhatsApp ↗
          </Link>
        </div>
      </div>

      <hr className="border-client-textPlaceholder mx-10 my-4" />

      <div className="flex justify-between items-center text-sm mx-10">
        <span>
          &copy; {currentYear} {BRAND.name} - Todos los derechos reservados.
        </span>

        <div className="flex space-x-4">
          <Link
            href={`https://wa.me/${process.env.NEXT_PUBLIC_COMPANY_PHONE}`}
            target="_blank"
            aria-label="WhatsApp"
            className="hover:scale-105"
          >
            <WhatsAppIcon className="h-6 w-6 hover:text-client-text transition" />
          </Link>

          <Link
            href="https://x.com/tuUsuario"
            target="_blank"
            aria-label="X (Twitter)"
            className="hover:scale-105"
          >
            <XIcon className="h-6 w-6 hover:text-client-text transition" />
          </Link>

          <Link
            href="https://instagram.com/tuUsuario"
            target="_blank"
            aria-label="Instagram"
            className="hover:scale-105"
          >
            <InstagramIcon className="h-6 w-6 hover:text-client-text transition" />
          </Link>

          <Link
            href="https://tiktok.com/tuUsuario"
            target="_blank"
            aria-label="Instagram"
            className="hover:scale-105"
          >
            <TikTokIcon className="h-6 w-6 hover:text-client-text transition" />
          </Link>

          <Link
            href="https://youtube.com/tuUsuario"
            target="_blank"
            aria-label="Instagram"
            className="hover:scale-105"
          >
            <YouTubeIcon className="h-6 w-6 hover:text-client-text transition" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
