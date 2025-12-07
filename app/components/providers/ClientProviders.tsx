"use client";

import {usePathname} from "next/navigation";
import {GlobalLoadingProvider} from "./GlobalLoadingProvider";
import StoreProvider from "./StoreProvider";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <StoreProvider>
      {/* pathname을 key로 써서 라우트 바뀔 때마다 remount */}
      <GlobalLoadingProvider key={pathname}>{children}</GlobalLoadingProvider>
    </StoreProvider>
  );
}
