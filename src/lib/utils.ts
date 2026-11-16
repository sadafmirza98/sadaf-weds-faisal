import { wedding } from "@/config/wedding";

/** Join truthy class names. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const coupleNames = `${wedding.couple.partnerOne.firstName} & ${wedding.couple.partnerTwo.firstName}`;

/** Roman numerals for event ordinals (1–39 is plenty for wedding events). */
export function toRoman(n: number) {
  const map: Array<[number, string]> = [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  let out = "";
  for (const [v, s] of map) while (n >= v) { out += s; n -= v; }
  return out;
}

/** Safe wrappers — storage can throw in private mode or when blocked. */
export const safeStorage = {
  get(store: "local" | "session", key: string): string | null {
    try {
      return (store === "local" ? window.localStorage : window.sessionStorage).getItem(key);
    } catch {
      return null;
    }
  },
  set(store: "local" | "session", key: string, value: string): boolean {
    try {
      (store === "local" ? window.localStorage : window.sessionStorage).setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },
};
