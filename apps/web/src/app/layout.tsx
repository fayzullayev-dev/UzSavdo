import "./globals.css";
import { LanguageProvider } from "../lib/language";
import { AuthProvider } from "../lib/auth";

export const metadata = {
  title: "UzSavdo — Oʻzbekiston boʻylab ulgurji savdo maydonchasi",
  description: "Mahsulotlarni joylashtiring, xaridor toping, rasmiy shartnoma tuzing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <body className="antialiased min-h-screen">
        <LanguageProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
