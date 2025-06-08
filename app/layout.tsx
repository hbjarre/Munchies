import { Metadata } from 'next';
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from './layout-client';
import favicon from './images/munchies_logo_small.png';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Munchies',
  icons: {
    icon: favicon.src,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} font-sf-pro`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
