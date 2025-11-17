import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./providers/ConvexClientProvider";
import {
  ClerkProvider,
  SignedIn,
  UserButton,
} from '@clerk/nextjs';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Code Golf - Challenge Your Coding Skills",
  description: "Write the shortest code possible to solve programming challenges and compete with developers worldwide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" data-theme="light">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          style={{ backgroundColor: 'var(--background-100)', color: 'var(--text-900)' }}
        >
          <ConvexClientProvider>
            <SignedIn>
              <div className="fixed top-4 right-4 z-50">
                <UserButton afterSignOutUrl="/auth" />
              </div>
            </SignedIn>
            {children}
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
