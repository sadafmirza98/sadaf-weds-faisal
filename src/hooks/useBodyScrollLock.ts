"use client";

import { useEffect } from "react";

/** Locks page scroll while `locked` is true, compensating for scrollbar width. */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const { body, documentElement } = document;
    const scrollbar = window.innerWidth - documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
    };
  }, [locked]);
}
