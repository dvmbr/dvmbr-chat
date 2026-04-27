import "@/app/styles/global.css";
import { Ubuntu_Sans } from "next/font/google";

import ReactQueryProvider from "@/components/ReactQueryProvider";

import AppGate from "@/components/server/AppGate";

const ubuntuSans = Ubuntu_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${ubuntuSans.variable}`}>
      <body>
        <ReactQueryProvider>
          <AppGate>{children}</AppGate>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
