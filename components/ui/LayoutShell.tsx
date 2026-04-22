"use client";

import { AppShell, Breadcrumbs, Burger, Collapse } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <AppShell header={{ height: 56 }} padding={0}>
      <AppShell.Header
        withBorder={false}
        className="mx-auto flex max-w-3xl items-center"
      >
        <Burger
          opened={opened}
          onClick={toggle}
          aria-label="Toggle navigation"
        ></Burger>
        <Breadcrumbs separator="/">{["abc", "def", "ghi"]}</Breadcrumbs>
        <Collapse expanded={opened} orientation="horizontal">
          hello
        </Collapse>
      </AppShell.Header>

      {/* <AppShell.Navbar p="md">
        <AppShell.Section grow component={ScrollArea}>
          <nav className="flex flex-col gap-2">
            <Text size="sm" fw={700}>
              Navigation
            </Text>
          </nav>
        </AppShell.Section>
      </AppShell.Navbar> */}

      <AppShell.Main>
        <div className="mx-auto w-full max-w-3xl px-4 py-4">{children}</div>
      </AppShell.Main>
    </AppShell>
  );
}
