import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { GlobalHeader } from "./components/GlobalHeader";
import PageWrapper from "./components/PageWrapper";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Plattera",
  description: "Your favorite restaurant menu platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-full`}
        style={{ backgroundColor: "var(--background)" }}
      >
        <AuthProvider>
          <ThemeProvider>
            <GlobalHeader />
            <PageWrapper>{children}</PageWrapper>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
