import "./globals.css";
import "katex/dist/katex.min.css";
import Navbar from "../components/Navbar";
import { Inter } from "next/font/google";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Plataforma Educativa",
  description: "Simuladores y cursos para ingreso a universidades",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`
          ${inter.className}
          min-h-screen
          text-gray-900
          bg-gradient-to-b from-white via-gray-100 to-gray-200
          backdrop-blur-xl
        `}
      >
        <Providers>
          <Navbar />
          <main className="max-w-6xl mx-auto px-6 py-12">{children}</main>
        </Providers>
      </body>
    </html>
  );
}