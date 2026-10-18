import { inter } from "@/app/fonts/fonts";
import { Providers } from "@/src/providers";
import type { Metadata } from "next";
import { BRAND } from "@/src/config/brand";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: BRAND.name,
    template: `%s | ${BRAND.name}`,
  },
  description: BRAND.description,
  openGraph: {
    siteName: BRAND.name,
    url: BRAND.appUrl,
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-client-background antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
