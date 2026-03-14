import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { Button } from './button';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <div className="relative group">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center space-x-2 hover:bg-accent"
      >
        <Globe className="h-4 w-4" />
        <span className="text-sm">{currentLanguage.flag}</span>
        <span className="text-sm font-medium">{currentLanguage.name}</span>
      </Button>

      {/* Dropdown menu */}
      <div className="absolute right-0 mt-1 w-32 bg-popover border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-1">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors flex items-center space-x-2 ${
                i18n.language === language.code
                  ? 'bg-accent text-accent-foreground'
                  : 'text-foreground'
              }`}
            >
              <span>{language.flag}</span>
              <span>{language.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}