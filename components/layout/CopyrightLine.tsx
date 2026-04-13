"use client";

import { getMlsCopyright, getSiteCopyright } from "@/lib/compliance/copyright";

export function CopyrightLine() {
  const year = new Date().getFullYear();
  return (
    <p className="text-xs text-primary-foreground/40">
      {getSiteCopyright(year)} &middot; {getMlsCopyright(year)}
    </p>
  );
}
