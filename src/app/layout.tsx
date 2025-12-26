import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Property Jobs",
  description: "Job-centric property management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
