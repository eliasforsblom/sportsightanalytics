import { create } from "zustand";

type LanguageStore = {
  language: string;
  setLanguage: (language: string) => void;
};

export const useLanguage = create<LanguageStore>((set) => ({
  language: localStorage.getItem("preferred-language") || "en",
  setLanguage: (language: string) => {
    localStorage.setItem("preferred-language", language);
    set({ language });
  },
}));