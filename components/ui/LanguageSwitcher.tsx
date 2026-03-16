"use client";

import { motion } from "framer-motion";
import { useLangStore } from "@/app/playground/store";
import { LANG_LABELS, LANG_NAMES, type Lang } from "@/lib/i18n";

const LANGS: Lang[] = ["en", "uz", "ru"];

export function LanguageSwitcher() {
  const { lang, setLang } = useLangStore();

  return (
    <div className="flex items-center gap-0.5 bg-surface-2 rounded-xl border border-border p-0.5">
      {LANGS.map((l) => (
        <motion.button
          key={l}
          onClick={() => setLang(l)}
          whileTap={{ scale: 0.95 }}
          title={LANG_NAMES[l]}
          className={`
            relative px-2.5 py-1 rounded-lg text-xs font-bold font-mono
            transition-all duration-200 cursor-pointer
            ${lang === l
              ? "text-white"
              : "text-gray-500 hover:text-gray-300"
            }
          `}
        >
          {lang === l && (
            <motion.div
              layoutId="lang-pill"
              className="absolute inset-0 bg-primary rounded-lg"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative z-10">{LANG_LABELS[l]}</span>
        </motion.button>
      ))}
    </div>
  );
}
