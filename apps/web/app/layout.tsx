import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Product Factory",
  description: "Turn a business idea into an implementation-ready MVP blueprint.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
