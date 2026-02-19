import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Yutira 2026 - Civil Engineering Association',
  description: 'National level technical symposium by Department of Civil Engineering, PSG College of Technology.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="blueprint">
        <Navbar />
        <main className="min-h-[70vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
