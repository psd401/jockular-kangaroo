import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Intervention Tracking System",
  description: "Track student interventions and progress",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className='light'>
      <body className={`${inter.className} bg-background min-h-screen`}>
        <Providers>
          <main className="container mx-auto p-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
