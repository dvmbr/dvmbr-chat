import "./global.css";
import { Ubuntu_Sans } from "next/font/google";

import ReactQueryProvider from "@/components/ReactQueryProvider";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import MainSidebar from "@/components/ui/MainSidebar";
import MainBreadCrumb from "@/components/ui/MainBreadCrumb";
import EntryGate from "@/components/EntryGate";

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
            <SidebarInset className="relative flex min-h-dvh flex-col">
              <div className="sticky top-0 z-50 backdrop-blur">
                <div className="mx-auto flex h-14 max-w-3xl items-center gap-3 px-4">
                  <SidebarTrigger />
                  <MainBreadCrumb />
                </div>
              </div>

              <div className="mx-auto w-full max-w-3xl flex-1 px-4">
                <EntryGate />
              </div>
            </SidebarInset>
          </SidebarProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
