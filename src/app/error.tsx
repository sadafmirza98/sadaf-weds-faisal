"use client";

import { useEffect } from "react";

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow">Something went astray</p>
      <h1 className="display-title mt-5 text-5xl italic">The invitation could not load</h1>
      <p className="body-copy mt-5 max-w-sm">Please try again. If it keeps happening, refresh the page.</p>
      <button type="button" onClick={() => retry()} className="btn-luxe mt-10">
        Try again
      </button>
    </main>
  );
}
