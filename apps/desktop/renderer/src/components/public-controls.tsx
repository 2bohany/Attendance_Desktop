import { Languages, Moon, Sun } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { t } from '@/lib/i18n';
import { Button } from '@/components/ui/button';

/** Language and theme switches for signed-out pages. */
export function PublicControls() {
  const { locale, resolvedTheme, setLocale, setTheme } = useAppStore();
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
        aria-label={t(locale, 'topbar.toggleLanguage')}
      >
        <Languages />
        <span className="hidden sm:inline">{locale === 'en' ? 'العربية' : 'English'}</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        aria-label={t(locale, 'topbar.toggleTheme')}
      >
        {resolvedTheme === 'dark' ? (
          <Sun className="h-[18px] w-[18px]" />
        ) : (
          <Moon className="h-[18px] w-[18px]" />
        )}
      </Button>
    </div>
  );
}
