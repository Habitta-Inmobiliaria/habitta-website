import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/src/config";

interface LogoProps {
  variant?: "image" | "wordmark";
}

export function Logo({ variant = "image" }: LogoProps) {
  return (
    <Link href="/" className="flex items-center" aria-label="Inicio">
      <div className="bg-client-background px-6 py-2 rounded-full h-12 flex items-center justify-center">
        {variant === "wordmark" ? (
          <span className="w-[90px] whitespace-nowrap text-center text-lg font-semibold tracking-tight text-white">
            HABITTA
          </span>
        ) : (
          <Image
            src="/images/logo.webp"
            alt={`Logo de ${BRAND.name}`}
            width={90}
            height={36}
            className="lg:w-auto h-auto object-contain"
          />
        )}
      </div>
    </Link>
  );
}
