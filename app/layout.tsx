import "./global.css";
import { Ubuntu_Sans } from "next/font/google";

import ReactQueryProvider from "@/components/ReactQueryProvider";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import MainSidebar from "@/components/ui/MainSidebar";
import NicknameGate from "@/components/NicknameGate";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import MainBreadCrumb from "@/components/ui/MainBreadCrumb";

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
          <NicknameGate>
            <SidebarProvider defaultOpen={false}>
              <MainSidebar />
              <SidebarInset className="relative flex h-dvh flex-col">
                <SidebarTrigger className="sticky top-4 left-4 z-50" />
                <div className="mx-auto mt-4 w-full max-w-3xl px-4">
                  <MainBreadCrumb />
                </div>
                <div className="grow">{children}</div>
              </SidebarInset>
            </SidebarProvider>
          </NicknameGate>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
