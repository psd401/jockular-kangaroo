import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { AuthenticatorWrapper } from "@/components/AuthenticatorWrapper";
import { SignOutButton } from "@/components/SignOutButton";

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
      <body className={`${inter.className} bg-background min-h-screen flex flex-col`}>
        <Providers>
          <AuthenticatorWrapper>
            <div>
              <main className="container mx-auto p-8 flex-grow">
                {children}
              </main>
              <footer className="container mx-auto p-4 border-t">
                <div className="flex justify-end">
                  <SignOutButton />
                </div>
              </footer>
            </div>
          </AuthenticatorWrapper>
        </Providers>
      </body>
    </html>
  );
}
