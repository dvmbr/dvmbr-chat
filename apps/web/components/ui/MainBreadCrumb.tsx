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
import { Fragment } from "react/jsx-runtime";

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
                <Fragment key={href}>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{getLabel(segment)}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={href}>{getLabel(segment)}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      )}
    </>
  );
}
