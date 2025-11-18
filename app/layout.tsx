import "./globals.css";

export const metadata = {
  title: "dvmbr Chat",
  description: "A real-time chat app built with Next.js",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
