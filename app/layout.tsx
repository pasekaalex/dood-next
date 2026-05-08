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
  title: "$DOOD — Just a dood being a dood",
  description: "The official $DOOD token on Solana. A community-driven memecoin with wholesome vibes.",
  openGraph: {
    title: "$DOOD — Just a dood being a dood",
    description: "The official $DOOD token on Solana. A community-driven memecoin with wholesome vibes.",
    images: [{
      url: "https://doodpfp.lol/logo.png",
      width: 512,
      height: 512,
    }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://doodpfp.lol/logo.png"],
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