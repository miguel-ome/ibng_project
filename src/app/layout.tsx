// app/layout.tsx
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { CookiesWrapper } from "./cookies-wrapper"; // Criaremos este componente

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Reflexão Pessoal",
  description: "Um formulário de reflexão pessoal.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={montserrat.className}>
        <CookiesWrapper>{children}</CookiesWrapper>
      </body>
    </html>
  );
}
