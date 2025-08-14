import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ODO - Think better, organize smarter",
  description: "The only todo app that adapts to your thinking. Clean, fast, and distraction-free. Built for people who care about their productivity.",
  keywords: "todo, productivity, task management, notes, organization, planning",
  authors: [{ name: "ODO Team" }],
  openGraph: {
    title: "ODO - Think better, organize smarter",
    description: "The only todo app that adapts to your thinking. Clean, fast, and distraction-free.",
    type: "website",
    siteName: "ODO"
  },
  twitter: {
    card: "summary_large_image",
    title: "ODO - Think better, organize smarter",
    description: "The only todo app that adapts to your thinking. Clean, fast, and distraction-free."
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
