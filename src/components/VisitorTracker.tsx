"use client";

import { useEffect } from "react";

export default function VisitorTracker() {
  useEffect(() => {
    // Send tracking request on every page load so you can verify it works easily
    fetch("/api/track", {
      method: "POST",
    }).catch(err => console.error("Tracking error:", err));
  }, []);

  return null; // This component does not render anything
}
