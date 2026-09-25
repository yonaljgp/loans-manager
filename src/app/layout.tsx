import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  ColorSchemeScript,
  MantineProvider,
  createTheme,
  mantineHtmlProps,
} from "@mantine/core";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Loans Manager",
  description: "Sistema de gestión de préstamos",
};

const theme = createTheme({
  fontFamily: "var(--font-geist-sans), sans-serif",
  fontFamilyMonospace: "var(--font-geist-mono), monospace",
  primaryColor: "blue",
  defaultRadius: "md",
});

/*Evitar en desarrollo mensaje de error de inyeccion de script de mantine */
if (process.env.NODE_ENV === "development") {
  const origError = console.error;
  console.error = (...args: unknown[]) => {
    if (
      args.some(
        (arg) =>
          typeof arg === "string" &&
          arg.includes(
            "Encountered a script tag while rendering React component",
          ),
      )
    ) {
      return;
    }
    origError.apply(console, args);
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      {...mantineHtmlProps}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <ColorSchemeScript />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <MantineProvider theme={theme} defaultColorScheme="auto">
          <ToastContainer
            position="top-right"
            autoClose={5000}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />

          <Navbar />
          <main className="flex-1 flex flex-col w-full pb-20 md:pb-6">
            {children}
          </main>
        </MantineProvider>
      </body>
    </html>
  );
}
