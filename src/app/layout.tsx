import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/src/components/common/providers/Providers";
import { Navbar } from "@/src/components/common/navbar/Navbar";
import { BottomNav } from "@/src/components/common/navbar/BottomNav";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafbfd" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0f17" },
  ],
};

export const metadata: Metadata = {
  title: "Macromate",
  description: "AI-powered macro & nutrition tracker. Log meals, track macros, monitor fitness goals.",
  manifest: "/manifest.json",
  icons: {
    icon: "/macromate_favicon.png",
    apple: "/macromate_logo.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Macromate",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/macromate_logo.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${inter.variable} font-sans antialiased h-full overflow-hidden`}>
        <Providers>
          <div className="h-full flex flex-col">
            <Navbar />
            <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
              {children}
            </main>
            <BottomNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}
