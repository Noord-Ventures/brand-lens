import type { Metadata } from "next";
import "@noorddev/vlak-react/css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brand Lens",
  description: "Find a starting point for your brand. Eight choices, one direction to explore with your designer.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
