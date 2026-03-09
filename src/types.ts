export type AccentColor = 'indigo' | 'blue' | 'yellow' | 'green' | 'red';

export interface TileContent {
  id: string;
  title: string;
  statement: string;
  image?: string; // Base64 or URL
  schoolStandpoint: string;
  accentColor: AccentColor;
  isVisible: boolean;
}

export type Page = 'home' | 'statement' | 'admin-login' | 'admin-dashboard';
