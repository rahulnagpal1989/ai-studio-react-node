import './globals.css';

export const metadata = {
  title: 'Modelia AI Studio',
  description: 'Mini AI Studio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
