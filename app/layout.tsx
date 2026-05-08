import type { Metadata } from "next";
import { Bangers, Nunito } from "next/font/google";
import "./globals.css";

const bangers = Bangers({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bangers",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dood",
  description: "Dood on Solana",
  openGraph: {
    title: "Dood",
    description: "Dood on Solana",
    images: [{
      url: "https://doodpfp.lol/logo-trim.png",
      width: 512,
      height: 512,
    }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://doodpfp.lol/logo-trim.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bangers.variable} ${nunito.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        {children}
        <audio id="jazz-bg" src="/dood-jazz.mp3" autoPlay loop muted />
      </body>
    </html>
  );
}