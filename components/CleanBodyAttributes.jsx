"use client";
import { useEffect } from "react";

// Removes known extension-injected data attributes from the document body
// (for example Grammarly adds data-gr-ext-installed and data-new-gr-c-s-check-loaded)
export default function CleanBodyAttributes() {
  useEffect(() => {
    try {
      if (typeof document === "undefined") return;
      const attrs = Array.from(document.body.attributes || []);
      attrs.forEach((attr) => {
        if (/^data-gr-/i.test(attr.name) || attr.name === "data-new-gr-c-s-check-loaded") {
          document.body.removeAttribute(attr.name);
        }
      });
    } catch (e) {
      // ignore - defensive
    }
  }, []);

  return null;
}
