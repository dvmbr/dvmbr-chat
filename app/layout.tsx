import "./global.css";
import { Ubuntu_Sans } from "next/font/google";

import ReactQueryProvider from "@/components/ReactQueryProvider";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import MainSidebar from "@/components/custom/MainSidebar";

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
          <SidebarProvider defaultOpen={false}>
            <MainSidebar />
            <SidebarInset className="relative flex h-dvh flex-col">
              <SidebarTrigger className="sticky top-4 left-4 z-50" />
              <div className="grow">{children}</div>
            </SidebarInset>
          </SidebarProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
