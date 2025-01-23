import { create } from "zustand";
import { persist } from "zustand/middleware";

type LanguageStore = {
  language: string;
  setLanguage: (language: string) => void;
};

export const useLanguage = create<LanguageStore>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (language: string) => {
        set({ language });
        // Force a page reload to ensure all components update
        window.location.reload();
      },
    }),
    {
      name: "language-storage",
    }
  )
);