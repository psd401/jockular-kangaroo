import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { AuthenticatorWrapper } from "@/components/AuthenticatorWrapper";
import { SignOutButton } from "@/components/SignOutButton";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Intervention Tracking System",
  description: "Track student interventions and progress",
};

function Footer() {
  'use client';
  
  return (
    <footer className="px-4">
      <div className="max-w-[1400px] w-full mx-auto p-4 text-center">
        <div className="flex items-center justify-center gap-3 text-gray-600">
          <Image 
            src="/kangaroo.jpg" 
            alt="Jockular Kangaroo" 
            width={32} 
            height={32}
            unoptimized
          />
          <span>
            Jockular Kangaroo © {new Date().getFullYear()} Peninsula School District
          </span>
        </div>
        <div className="mt-4 flex justify-end">
          <SignOutButton />
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className='light'>
      <body className={inter.className}>
        <Providers>
          <AuthenticatorWrapper>
            <div className="min-h-screen flex flex-col bg-[#D7CDBE]">
              <main className="flex-grow w-full">
                <div className="w-[95%] max-w-[1400px] mx-auto my-8">
                  <div className="bg-white rounded-lg shadow-lg p-8">
                    {children}
                  </div>
                </div>
              </main>
              <Footer />
            </div>
          </AuthenticatorWrapper>
        </Providers>
      </body>
    </html>
  );
}
