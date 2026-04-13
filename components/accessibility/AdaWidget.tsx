"use client";

import Script from "next/script";

/**
 * UserWay accessibility widget (free tier).
 * Renders a floating button bottom-left for screen reader,
 * contrast, font size, and other accessibility adjustments.
 */
export function AdaWidget() {
  return (
    <Script
      src="https://cdn.userway.org/widget.js"
      data-account="REPLACE_WITH_USERWAY_ACCOUNT_ID"
      strategy="lazyOnload"
    />
  );
}
