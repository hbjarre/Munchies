'use client';

import Image from 'next/image';
import logoImage from './images/munchies_logo_big.png';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <nav className="mb-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
              <div className="flex items-center mt-8">
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
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
} 