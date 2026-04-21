"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";

export default function MainBreadCrumb() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);

  const getLabel = (segment: string) => {
    if (segment === "rooms") return "Room List";
    return segment;
  };

  return (
    <>
      {pathname !== "/" && (
        <Breadcrumb>
          <BreadcrumbList>
            {segments.map((segment, index) => {
              const href = "/" + segments.slice(0, index + 1).join("/");
              const isLast = index === segments.length - 1;

              return (
                <>
                  <BreadcrumbItem key={"item-" + href}>
                    {isLast ? (
                      <BreadcrumbPage>{getLabel(segment)}</BreadcrumbPage>
                    ) : (
                      <>
                        <BreadcrumbLink asChild>
                          <Link href={href}>{getLabel(segment)}</Link>
                        </BreadcrumbLink>
                      </>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator key={"sep-" + href} />}
                </>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      )}
    </>
  );
}
