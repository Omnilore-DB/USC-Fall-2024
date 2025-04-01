"use client";

import { useIsClient } from "@uidotdev/usehooks";

export function ClientOnly({ children }: { children: React.ReactNode }) {
  const isClient = useIsClient();

  if (isClient === false) {
    return null;
  }

  return children;
}
