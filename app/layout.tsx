import type { Metadata } from "next";
import "@noorddev/vlak-react/css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brand Lens",
  description: "Eight choices. One direction you could hand to a designer.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
