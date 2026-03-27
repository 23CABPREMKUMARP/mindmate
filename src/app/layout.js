import { Geist, Geist_Mono } from "next/font/google";
import AuthWrapper from "@/components/AuthWrapper";
import ClientLayout from "@/components/ClientLayout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "EMOAI PRO • Neural Mental Health Interface",
  description: "Advanced biometric emotional diagnostics and AI-driven cognitive support.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-full flex bg-transparent text-gray-100 font-sans relative overflow-x-hidden`}>
        <AuthWrapper>
          <ClientLayout>{children}</ClientLayout>
        </AuthWrapper>
      </body>
    </html>
  );
}
