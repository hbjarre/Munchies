import { Metadata } from 'next';
import ClientLayout from './layout-client';
import favicon from './images/munchies_logo_small.png';

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
      <ClientLayout>
        {children}
      </ClientLayout>
    </html>
  );
}
