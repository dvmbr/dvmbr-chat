import ClientProviders from "./components/providers/ClientProviders";
import "./globals.css";
import "./styles/animations.css";

export const metadata = {
  title: "dvmbr Chat",
  description: "A real-time chat app built with Next.js",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="h-full">
      <body className="h-full">
        <ClientProviders>
          {/* 모바일: 전체 화면 */}
          {/* PC에서는 auto */}
          {/* PC 전용 max-height: 800px */}
          {/* PC 전용 수직 중앙 정렬 */}
          <div className="fixed inset-0 mx-auto w-full max-w-[430px] md:h-dvh md:max-h-[768px] md:top-1/2 md:-translate-y-1/2">
            {children}
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
