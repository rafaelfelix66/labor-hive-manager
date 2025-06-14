import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { getCurrentLanguage } from "@/utils/translations";

const SimpleLanguageSwitcher = () => {
  const changeLanguage = (lng: string) => {
    localStorage.setItem('i18nextLng', lng);
    window.location.reload();
  };

  const currentLang = getCurrentLanguage();

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-white" />
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-white hover:text-[#e74a3e] hover:bg-white/10 font-bold"
        onClick={() => changeLanguage(currentLang === 'en' ? 'es' : 'en')}
      >
        <span 
          style={{
            fontSize: '16px',
            fontFamily: 'system-ui, -apple-system, "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
{currentLang === 'en' ? 'ES' : 'EN'}
        </span>
      </Button>
    </div>
  );
};

export default SimpleLanguageSwitcher;