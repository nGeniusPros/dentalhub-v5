import type { Theme } from '../types/theme';

export class ThemeService {
  private theme: Theme = 'light';

  constructor() {
    if (typeof window !== 'undefined') {
      this.theme = (localStorage.getItem('theme') as Theme) || 'light';
    }
  }

  getTheme() {
    return this.theme;
  }

  setTheme(theme: Theme) {
    this.theme = theme;
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', this.theme);
    }
    return this.theme;
  }
}