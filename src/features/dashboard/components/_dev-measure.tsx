"use client";

import { useEffect } from "react";

export function DevMeasure() {
  useEffect(() => {
    const run = () => {
      const d = document.documentElement;
      const main = document.querySelector("main");
      const aside = document.querySelector("aside");
      const out = {
        inner: window.innerWidth,
        docScroll: d.scrollWidth,
        bodyScroll: document.body.scrollWidth,
        mainW: main ? Math.round(main.getBoundingClientRect().width) : -1,
        mainX: main ? Math.round(main.getBoundingClientRect().left) : -1,
        asidePos: aside ? getComputedStyle(aside).position : "none",
        asideW: aside ? Math.round(aside.getBoundingClientRect().width) : -1,
        asideX: aside ? Math.round(aside.getBoundingClientRect().left) : -1,
      };
      document.title = "MEASURE " + JSON.stringify(out);
    };
    const id = setTimeout(run, 1200);
    return () => clearTimeout(id);
  }, []);

  return null;
}
