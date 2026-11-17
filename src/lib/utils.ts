import { wedding } from "@/config/wedding";

/** Join truthy class names. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const coupleNames = `${wedding.couple.partnerOne.firstName} & ${wedding.couple.partnerTwo.firstName}`;

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

/** ["Nikah", "Reception", "Walima"] → "Nikah, Reception and Walima". */
export function joinNames(names: string[], last = " and ") {
  return names.length <= 1 ? names.join("") : `${names.slice(0, -1).join(", ")}${last}${names[names.length - 1]}`;
}
