import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Plena | Receitas leves para a sua nova fase",
  description:
    "Chat de IA para ideias de receitas, cardápios simples, substituições e listas de compras com acolhimento e praticidade.",
  icons: {
    icon: "/brand/plena-icon.png",
    shortcut: "/brand/plena-icon.png",
    apple: "/brand/plena-icon.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
