import "./global.css";
import { Ubuntu_Sans } from "next/font/google";

import { cn } from "@/lib/utils/cn";
import ReactQueryProvider from "@/components/ReactQueryProvider";

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
    <html lang="en" className={cn("dark font-sans", ubuntuSans.variable)}>
      <body>
        <ReactQueryProvider>
          <main>{children}</main>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
