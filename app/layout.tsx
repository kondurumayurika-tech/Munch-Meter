import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ludhiana Burrito â€” Munch Meter",
  description: "A small place for honest restaurant reviews.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

