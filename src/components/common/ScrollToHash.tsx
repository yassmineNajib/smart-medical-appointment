import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    window.setTimeout(() => {
      document.querySelector(location.hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }, [location.pathname, location.hash]);

  return null;
}
