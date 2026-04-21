"use client";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

export function MantineProviders({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider
      defaultColorScheme="dark"
      theme={{
        primaryColor: "brandMint",
        colors: {
          brandRed: [
            "#fff5f5",
            "#ffe3e3",
            "#ffc9c9",
            "#ffa8a8",
            "#ff8787",
            "#ff6b6b",
            "#ff3131",
            "#fa5252",
            "#f03e3e",
            "#e03131",
          ],
          brandMint: [
            "#e6fffd",

            "#ccfff9",

            "#99fff3",

            "#66ffec",

            "#33ffe6",

            "#00ffe0",

            "#67fff0",

            "#33f0e0",

            "#00e6d6",

            "#00ccc0",
          ],
        },
      }}
    >
      <Notifications position="bottom-right" />
      {children}
    </MantineProvider>
  );
}
