import Link from "next/link";
import { Moon } from "@/components/art/Moon";
import { coupleNames } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-6 text-center">
      <Moon idPrefix="nf-moon" className="w-28" />
      <p className="eyebrow mt-12">Lost beneath the moon</p>
      <h1 className="display-title mt-5 text-5xl italic sm:text-6xl">This page drifted away</h1>
      <p className="body-copy mt-5 max-w-sm">The invitation you are looking for lives on the home page.</p>
      <Link href="/" className="btn-luxe mt-10">
        Return to {coupleNames}
      </Link>
    </main>
  );
}
