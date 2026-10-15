"use client";

import { useEffect } from "react";

/**
 * Puts the night theme on <body> while mounted. Dialogs and popovers render in a portal outside the
 * page's own tree, so without this they would show in the app's light theme on top of a dark page.
 */
export function NightBody() {
  useEffect(() => {
    const classes = ["dark", "theme-night"];
    document.body.classList.add(...classes);
    return () => document.body.classList.remove(...classes);
  }, []);
  return null;
}
