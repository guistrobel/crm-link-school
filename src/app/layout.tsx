import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CRM — Simplificando a Jornada",
  description: "CRM do cursinho preparatório para a Link School of Business",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="h-full bg-slate-50 antialiased">{children}</body>
    </html>
  );
}
