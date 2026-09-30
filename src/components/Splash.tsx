"use client";

import { useEffect } from "react";

export default function Splash() {
  useEffect(() => {
    const splash = document.getElementById("splash");
    if (splash) {
      splash.style.display = "none";
      splash.setAttribute("aria-hidden", "true");
    }
  }, []);
  return null;
}
