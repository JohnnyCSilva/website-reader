import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/components/utils";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Website Reader",
  description: "A website reader powered by Rag Chat",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "min-h-screen antialiased")}>
        <Providers>
          <main className="h-screen dark text-foreground bg-background">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
