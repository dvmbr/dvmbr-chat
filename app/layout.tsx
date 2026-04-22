import "./global.css";
import { Ubuntu_Sans } from "next/font/google";

import ReactQueryProvider from "@/components/ReactQueryProvider";

import NicknameGate from "@/components/NicknameGate";

import { MantineProviders } from "@/components/MantineProviders";
import LayoutShell from "@/components/ui/LayoutShell";

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
          <MantineProviders>
            <NicknameGate>
              <LayoutShell>{children}</LayoutShell>
            </NicknameGate>
          </MantineProviders>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
