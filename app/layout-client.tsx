'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import Image from 'next/image';
import logoImage from './images/munchies_logo_big.png';

const inter = Inter({ subsets: ["latin"] });

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <body className={inter.className}>
      <div className="min-h-screen bg-[rgb(250,250,250)]">
        <div className="px-4 sm:px-6 lg:px-8">
          <nav className="mb-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center">
                <div className="flex items-center mt-8 md:mt-14">
                  <a href="/" className="flex items-center">
                    <Image
                      src={logoImage}
                      alt="Munchies"
                      width={274}
                      height={40}
                      className="w-[167px] md:w-[274px] h-auto"
                      priority
                    />
                  </a>
                </div>
              </div>
            </div>
          </nav>
          <main className="max-w-7xl mx-auto pb-12">
            {children}
          </main>
        </div>
      </div>
    </body>
  );
} 