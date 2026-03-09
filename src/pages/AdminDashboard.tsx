import React from 'react';
import { TileContent } from '../types';
import { Plus, CreditCard as Edit2, Trash2, Copy, Eye, EyeOff, LogOut, LayoutGrid } from 'lucide-react';
import TileEditor from '../admin/TileEditor';

interface AdminDashboardProps {
  tiles: TileContent[];
  onUpdateTiles: (tiles: TileContent[]) => void;
  onLogout: () => void;
  onGoToHome: () => void;
}

export default function AdminDashboard({ tiles, onUpdateTiles, onLogout, onGoToHome }: AdminDashboardProps) {
  const [editingTile, setEditingTile] = React.useState<TileContent | null>(null);
  const [isAdding, setIsAdding] = React.useState(false);

  const handleSave = (tile: TileContent) => {
    if (isAdding) {
      onUpdateTiles([...tiles, tile]);
    } else {
      onUpdateTiles(tiles.map(t => t.id === tile.id ? tile : t));
    }
    setIsAdding(false);
    setEditingTile(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Weet je zeker dat je deze tegel wilt verwijderen?')) {
      onUpdateTiles(tiles.filter(t => t.id !== id));
    }
  };

  const handleToggleVisibility = (id: string) => {
    onUpdateTiles(tiles.map(t => t.id === id ? { ...t, isVisible: !t.isVisible } : t));
  };

  const handleDuplicate = (tile: TileContent) => {
    const newTile = {
      ...tile,
      id: crypto.randomUUID(),
      title: `${tile.title} (Kopie)`,
    };
    onUpdateTiles([...tiles, newTile]);
  };

  return (
    <div className="min-h-screen bg-summa-gray p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl text-summa-indigo">Admin Dashboard</h1>
            <p className="text-summa-dark/60 font-semibold">Beheer alle stellingen en tegels</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={onGoToHome}
              className="flex items-center gap-2 summa-button bg-summa-white text-summa-indigo"
            >
              <LayoutGrid size={20} />
              Bekijk App
            </button>
            <button 
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 summa-button bg-summa-indigo text-summa-white"
            >
              <Plus size={20} />
              Nieuwe Tegel
            </button>
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 summa-button bg-summa-red text-summa-white"
            >
              <LogOut size={20} />
              Uitloggen
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4">
          {tiles.map(tile => (
            <div key={tile.id} className={`summa-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-8 ${tile.isVisible ? 'border-summa-green' : 'border-summa-dark/20 opacity-75'}`}>
              <div className="flex items-center gap-6 flex-1">
                <div className="w-16 h-16 rounded-lg bg-summa-gray overflow-hidden flex-shrink-0">
                  {tile.image ? (
                    <img src={tile.image} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-summa-dark/20">
                      <LayoutGrid size={24} />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl text-summa-indigo">{tile.title}</h3>
                  <p className="text-sm text-summa-dark/60 line-clamp-1">{tile.statement}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleVisibility(tile.id)}
                  className={`p-3 rounded-xl transition-colors ${tile.isVisible ? 'bg-summa-green/10 text-summa-green hover:bg-summa-green/20' : 'bg-summa-dark/10 text-summa-dark/40 hover:bg-summa-dark/20'}`}
                  title={tile.isVisible ? 'Verbergen' : 'Zichtbaar maken'}
                >
                  {tile.isVisible ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
                <button
                  onClick={() => setEditingTile(tile)}
                  className="p-3 bg-summa-blue/10 text-summa-blue rounded-xl hover:bg-summa-blue/20 transition-colors"
                  title="Bewerken"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDuplicate(tile)}
                  className="p-3 bg-summa-yellow/10 text-summa-yellow rounded-xl hover:bg-summa-yellow/20 transition-colors"
                  title="Dupliceren"
                >
                  <Copy size={20} />
                </button>
                <button
                  onClick={() => handleDelete(tile.id)}
                  className="p-3 bg-summa-red/10 text-summa-red rounded-xl hover:bg-summa-red/20 transition-colors"
                  title="Verwijderen"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}

          {tiles.length === 0 && (
            <div className="text-center py-20 summa-card border-2 border-dashed border-summa-dark/10 bg-transparent shadow-none">
              <p className="text-xl text-summa-dark/40">Geen tegels gevonden. Maak er een aan!</p>
            </div>
          )}
        </div>
      </div>

      {(isAdding || editingTile) && (
        <TileEditor
          tile={editingTile || undefined}
          onSave={handleSave}
          onCancel={() => {
            setIsAdding(false);
            setEditingTile(null);
          }}
        />
      )}
    </div>
  );
}
