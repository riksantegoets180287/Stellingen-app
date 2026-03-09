import { TileContent } from '../types';
import Tile from '../components/Tile';

interface HomeProps {
  tiles: TileContent[];
  onSelectTile: (id: string) => void;
}

export default function Home({ tiles, onSelectTile }: HomeProps) {
  const visibleTiles = tiles.filter(t => t.isVisible);

  return (
    <div className="h-screen overflow-hidden flex flex-col p-2 md:p-4 max-w-[1600px] mx-auto">
      <header className="mb-4 text-center shrink-0">
        <h1 className="text-xl md:text-3xl text-summa-indigo mb-0.5">Stellingen Tegels</h1>
        <p className="text-xs md:text-sm text-summa-dark/60 font-semibold">Kies een tegel om de stelling te bekijken.</p>
      </header>
      
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {visibleTiles.map(tile => (
            <Tile key={tile.id} tile={tile} onClick={() => onSelectTile(tile.id)} />
          ))}
        </div>

        {visibleTiles.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-summa-dark/40 italic">Geen zichtbare stellingen gevonden.</p>
          </div>
        )}
      </div>
    </div>
  );
}
