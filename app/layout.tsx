import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NBA CBA AI",
  description: "Use AI to ask questions about the new 676-page NBA CBA."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      className="bg-neutral-900"
      lang="en"
    >
      <body className={inter.className}>{children}</body>
    </html>
  );
}
