import { create } from "zustand";
import { persist } from "zustand/middleware";

type Language = "en" | "sv";

type LanguageStore = {
  language: Language;
  setLanguage: (language: string) => void;
};

/**
 * Language preference is persisted and reactive — components re-render and
 * react-query refetches translations via language-keyed query keys.
 */
export const useLanguage = create<LanguageStore>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (language: string) => {
        set({ language: language === "sv" ? "sv" : "en" });
        document.documentElement.lang = language === "sv" ? "sv" : "en";
      },
    }),
    { name: "language-storage" }
  )
);
