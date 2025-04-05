
export function initializeTheme() {
  // Verificar preferência armazenada
  const storedTheme = localStorage.getItem('theme-preference') as 'light' | 'dark' | 'system' | null;
  
  // Se não tiver preferência, usar a preferência do sistema
  if (!storedTheme || storedTheme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', prefersDark);
    
    // Monitorar mudanças na preferência do sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (localStorage.getItem('theme-preference') === 'system') {
        document.documentElement.classList.toggle('dark', e.matches);
      }
    });
  } 
  // Se tiver preferência, aplicá-la
  else if (storedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

export function getLanguagePreference(): string {
  const storedLanguage = localStorage.getItem('language-preference');
  
  if (storedLanguage) {
    return storedLanguage;
  }
  
  // Auto-detecção baseada no navegador
  const browserLang = navigator.language;
  
  if (browserLang.startsWith('pt')) {
    return 'pt-BR';
  } else if (browserLang.startsWith('es')) {
    return 'es';
  } else {
    return 'en';
  }
}
