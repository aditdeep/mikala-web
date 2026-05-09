import type { Metadata } from "next";
import "@mikala/ui/src/styles/globals.css";

export const metadata: Metadata = {
  title: "Mikala Garda Medika - Home Care Services",
  description: "Layanan perawatan kesehatan profesional di rumah Anda",
  keywords: ["home care", "perawat", "kesehatan", "lansia", "pasien"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
