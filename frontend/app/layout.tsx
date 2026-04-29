import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { UserSettingsProvider } from "@/components/settings/UserSettingsProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Simcine",
  description: "Find what feels similar.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={inter.className}>
        <ThemeProvider>
          <UserSettingsProvider>
            <div className="min-h-screen bg-background text-foreground">
              <SiteHeader />
              <main>{children}</main>
              <SiteFooter />
            </div>
          </UserSettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
