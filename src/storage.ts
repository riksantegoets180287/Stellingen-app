import { TileContent } from './types';

const STORAGE_KEY = 'stellingen_content_v1';

const demoData: TileContent[] = [
  {
    id: '1',
    title: 'Mobieltjes in de klas',
    statement: 'Mobiele telefoons moeten volledig verboden worden tijdens alle lessen, ook als ze niet gebruikt worden.',
    schoolStandpoint: 'Wij geloven in een focus-rijke omgeving. Mobieltjes gaan in de telefoontas aan het begin van de les.',
    accentColor: 'indigo',
    isVisible: true,
    image: 'https://picsum.photos/seed/phone/800/600'
  },
  {
    id: '2',
    title: 'Huiswerkbeleid',
    statement: 'Al het huiswerk moet op school afgerond kunnen worden, zodat leerlingen thuis echt vrij zijn.',
    schoolStandpoint: 'Zelfstudie is een belangrijk onderdeel van het leerproces, maar we proberen de belasting in balans te houden.',
    accentColor: 'blue',
    isVisible: true,
    image: 'https://picsum.photos/seed/homework/800/600'
  },
  {
    id: '3',
    title: 'Gezonde Kantine',
    statement: 'De schoolkantine mag alleen nog maar gezonde, onbewerkte producten verkopen.',
    schoolStandpoint: 'Gezondheid staat voorop. We faseren ongezonde snacks uit en bieden meer fruit en volkoren producten aan.',
    accentColor: 'green',
    isVisible: true,
    image: 'https://picsum.photos/seed/food/800/600'
  },
  {
    id: '4',
    title: 'Kledingvoorschriften',
    statement: 'Er moeten duidelijke kledingvoorschriften komen om een professionele sfeer te waarborgen.',
    schoolStandpoint: 'We stimuleren zelfexpressie, maar verwachten wel dat kleding passend is voor een onderwijsomgeving.',
    accentColor: 'red',
    isVisible: true,
    image: 'https://picsum.photos/seed/clothes/800/600'
  },
  {
    id: '5',
    title: 'AI in het Onderwijs',
    statement: 'Het gebruik van ChatGPT en andere AI-tools moet verplicht worden opgenomen in het curriculum.',
    schoolStandpoint: 'AI is de toekomst. We leren leerlingen hoe ze deze tools ethisch en effectief kunnen inzetten.',
    accentColor: 'yellow',
    isVisible: true,
    image: 'https://picsum.photos/seed/ai/800/600'
  },
  {
    id: '6',
    title: 'Lestijden',
    statement: 'De schooldag moet later beginnen (bijv. 10:00 uur) om beter aan te sluiten bij het ritme van jongeren.',
    schoolStandpoint: 'We onderzoeken de mogelijkheden, maar moeten ook rekening houden met logistiek en stages.',
    accentColor: 'indigo',
    isVisible: true,
    image: 'https://picsum.photos/seed/sleep/800/600'
  }
];

export const getTiles = (): TileContent[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoData));
    return demoData;
  }
  return JSON.parse(stored);
};

export const saveTiles = (tiles: TileContent[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tiles));
};

export const isAdminLoggedIn = (): boolean => {
  return sessionStorage.getItem('admin_session') === 'true';
};

export const loginAdmin = () => {
  sessionStorage.setItem('admin_session', 'true');
};

export const logoutAdmin = () => {
  sessionStorage.removeItem('admin_session');
};
