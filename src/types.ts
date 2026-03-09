export type AccentColor = 'indigo' | 'blue' | 'yellow' | 'green' | 'red';

export interface ClassVoting {
  enabled: boolean;
  liveResults: boolean;
  closed: boolean;
  votes: {
    accept: number;
    unsure: number;
    no: number;
  };
}

export interface TileContent {
  id: string;
  title: string;
  statement: string;
  image?: string;
  schoolStandpoint: string;
  accentColor: AccentColor;
  isVisible: boolean;
  classVoting?: ClassVoting;
}

export type Page = 'home' | 'statement' | 'admin-login' | 'admin-dashboard' | 'vote';
