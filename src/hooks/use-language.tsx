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
      setLanguage: (language: string) => set({ language }),
    }),
    {
      name: "language-storage",
    }
  )
);