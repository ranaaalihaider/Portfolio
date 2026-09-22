"use client";

import { useEffect } from "react";

export default function VisitorTracker() {
  useEffect(() => {
    // Check if we've already tracked this visit in the current browser session
    const hasTracked = sessionStorage.getItem("visitor_tracked");
    
    if (!hasTracked) {
      // Send tracking request
      fetch("/api/track", {
        method: "POST",
      }).catch(err => console.error("Tracking error:", err));
      
      // Mark as tracked for this session
      sessionStorage.setItem("visitor_tracked", "true");
    }
  }, []);

  return null; // This component does not render anything
}
