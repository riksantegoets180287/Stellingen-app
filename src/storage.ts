import { TileContent } from './types';
import { supabase } from './supabaseClient';

interface DbTile {
  id: string;
  title: string;
  statement: string;
  school_standpoint: string;
  accent_color: string;
  image: string | null;
  is_visible: boolean;
  display_order: number;
  class_voting_enabled: boolean;
  class_voting_live_results: boolean;
  class_voting_closed: boolean;
  votes_accept: number;
  votes_unsure: number;
  votes_no: number;
}

const generateDemoTiles = (): TileContent[] => {
  const colors: TileContent['accentColor'][] = ['indigo', 'blue', 'yellow', 'green', 'red'];
  const tiles: TileContent[] = [];

  for (let i = 1; i <= 50; i++) {
    tiles.push({
      id: `tile-${i}`,
      title: `Stelling ${i}`,
      statement: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      schoolStandpoint: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      accentColor: colors[(i - 1) % colors.length],
      isVisible: false,
      image: `https://picsum.photos/seed/tile${i}/800/600`
    });
  }

  return tiles;
};

const demoData: TileContent[] = generateDemoTiles();

const mapDbToTile = (db: DbTile): TileContent => ({
  id: db.id,
  title: db.title,
  statement: db.statement,
  schoolStandpoint: db.school_standpoint,
  accentColor: db.accent_color as TileContent['accentColor'],
  image: db.image || undefined,
  isVisible: db.is_visible,
  classVoting: {
    enabled: db.class_voting_enabled || false,
    liveResults: db.class_voting_live_results !== false,
    closed: db.class_voting_closed || false,
    votes: {
      accept: db.votes_accept || 0,
      unsure: db.votes_unsure || 0,
      no: db.votes_no || 0,
    }
  }
});

const mapTileToDb = (tile: TileContent, displayOrder: number) => ({
  id: tile.id,
  title: tile.title,
  statement: tile.statement,
  school_standpoint: tile.schoolStandpoint,
  accent_color: tile.accentColor,
  image: tile.image || null,
  is_visible: tile.isVisible,
  display_order: displayOrder,
  class_voting_enabled: tile.classVoting?.enabled || false,
  class_voting_live_results: tile.classVoting?.liveResults !== false,
  class_voting_closed: tile.classVoting?.closed || false,
  votes_accept: tile.classVoting?.votes.accept || 0,
  votes_unsure: tile.classVoting?.votes.unsure || 0,
  votes_no: tile.classVoting?.votes.no || 0,
});

export const getTiles = async (): Promise<TileContent[]> => {
  const { data, error } = await supabase
    .from('stellingen')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching tiles:', error);
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  return data.map(mapDbToTile);
};

export const saveTiles = async (tiles: TileContent[]): Promise<void> => {
  console.log('Saving tiles:', tiles.length);

  const { data: existingTiles, error: fetchError } = await supabase
    .from('stellingen')
    .select('id');

  if (fetchError) {
    console.error('Error fetching existing tiles:', fetchError);
    throw fetchError;
  }

  const existingIds = new Set((existingTiles || []).map(t => t.id));
  const currentIds = new Set(tiles.map(t => t.id));

  const tilesToDelete = Array.from(existingIds).filter(id => !currentIds.has(id));
  console.log('Tiles to delete:', tilesToDelete.length);

  if (tilesToDelete.length > 0) {
    const { error: deleteError } = await supabase
      .from('stellingen')
      .delete()
      .in('id', tilesToDelete);

    if (deleteError) {
      console.error('Error deleting tiles:', deleteError);
      throw deleteError;
    }
  }

  for (let index = 0; index < tiles.length; index++) {
    const tile = tiles[index];
    const dbTile = mapTileToDb(tile, index);

    console.log(`Upserting tile ${index + 1}/${tiles.length}:`, tile.title);

    const { error } = await supabase
      .from('stellingen')
      .upsert(dbTile, { onConflict: 'id' });

    if (error) {
      console.error('Error upserting tile:', tile.title, error);
      throw error;
    }
  }

  console.log('All tiles saved successfully!');
};

export const initializeDemoData = async (): Promise<void> => {
  const { data } = await supabase
    .from('stellingen')
    .select('id')
    .limit(1)
    .maybeSingle();

  if (!data) {
    console.log('No data found, initializing with demo data');
    await saveTiles(demoData);
  } else {
    console.log('Database already has data, skipping initialization');
  }
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
