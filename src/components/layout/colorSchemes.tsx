"use client";

import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { Sun, Moon } from "lucide-react";

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const origError = console.error;
  console.error = (...args: unknown[]) => {
    if (
      args.some(
        (arg) =>
          typeof arg === "string" &&
          arg.includes(
            "Encountered a script tag while rendering React component",
          ),
      )
    ) {
      return;
    }
    origError(...args);
  };
}

function ColorSchemes() {
  const { toggleColorScheme } = useMantineColorScheme();

  return (
    <ActionIcon
      onClick={toggleColorScheme}
      variant="transparent"
      size="xl"
      aria-label="Toggle color scheme"
    >
      <Sun className="icon-sun link transition-colors duration-200" />
      <Moon className="icon-moon link transition-colors duration-200" />
    </ActionIcon>
  );
}

export default ColorSchemes;
