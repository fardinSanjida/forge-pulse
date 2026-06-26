"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function GlobalLoader() {
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const countRef = useRef(0);
  const timerRef = useRef(null);
  const pathname = usePathname();

  // Show bar on route change
  useEffect(() => {
    start();
    const t = setTimeout(stop, 400);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  function start() {
    countRef.current += 1;
    if (countRef.current === 1) {
      setVisible(true);
      setWidth(20);
      clearTimeout(timerRef.current);
      // Animate width toward 85% while loading
      timerRef.current = setInterval(() => {
        setWidth((w) => {
          if (w >= 85) { clearInterval(timerRef.current); return 85; }
          return w + (85 - w) * 0.08;
        });
      }, 100);
    }
  }

  function stop() {
    countRef.current = Math.max(0, countRef.current - 1);
    if (countRef.current === 0) {
      clearInterval(timerRef.current);
      setWidth(100);
      setTimeout(() => {
        setVisible(false);
        setWidth(0);
      }, 300);
    }
  }

  // Patch global fetch to intercept API calls
  useEffect(() => {
    const original = globalThis.fetch;

    globalThis.fetch = async function patchedFetch(input, init) {
      const url = typeof input === "string" ? input : input instanceof URL ? input.href : input?.url ?? "";
      const isApi = url.startsWith(API_ORIGIN);

      if (isApi) start();
      try {
        return await original.call(this, input, init);
      } finally {
        if (isApi) stop();
      }
    };

    return () => {
      globalThis.fetch = original;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* Top progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] bg-transparent">
        <div
          className="h-full bg-orange-500 shadow-[0_0_8px_2px_rgba(249,115,22,0.6)] transition-[width] duration-200 ease-out"
          style={{ width: `${width}%` }}
        />
      </div>

      {/* Spinner dot */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0c151d] shadow-lg shadow-black/40 ring-1 ring-white/10">
          <svg
            className="h-5 w-5 animate-spin text-orange-500"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      </div>
    </>
  );
}
