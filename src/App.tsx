import React from 'react';
import { Page, TileContent } from './types';
import { getTiles, saveTiles, isAdminLoggedIn, loginAdmin, logoutAdmin, initializeDemoData } from './storage';
import Home from './pages/Home';
import Statement from './pages/Statement';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const [page, setPage] = React.useState<Page>('home');
  const [tiles, setTiles] = React.useState<TileContent[]>([]);
  const [selectedTileId, setSelectedTileId] = React.useState<string | null>(null);
  const [showAdminLogin, setShowAdminLogin] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const keyPresses = React.useRef<{ key: string; time: number }[]>([]);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        await initializeDemoData();
        const data = await getTiles();
        setTiles(data);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '9') {
        const now = Date.now();
        keyPresses.current.push({ key: '9', time: now });
        
        // Keep only last 5 presses within 5 seconds
        keyPresses.current = keyPresses.current.filter(p => now - p.time < 5000);
        
        if (keyPresses.current.length >= 5) {
          keyPresses.current = [];
          if (isAdminLoggedIn()) {
            setPage('admin-dashboard');
          } else {
            setShowAdminLogin(true);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleUpdateTiles = async (newTiles: TileContent[]) => {
    setTiles(newTiles);
    await saveTiles(newTiles);
  };

  const handleAdminLogin = () => {
    loginAdmin();
    setShowAdminLogin(false);
    setPage('admin-dashboard');
  };

  const handleLogout = () => {
    logoutAdmin();
    setPage('home');
  };

  const selectedTile = tiles.find(t => t.id === selectedTileId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-summa-dark/60">Laden...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {page === 'home' && (
        <Home 
          tiles={tiles} 
          onSelectTile={(id) => {
            setSelectedTileId(id);
            setPage('statement');
          }} 
        />
      )}

      {page === 'statement' && selectedTile && (
        <Statement 
          tile={selectedTile} 
          onBack={() => setPage('home')} 
        />
      )}

      {page === 'admin-dashboard' && (
        <AdminDashboard 
          tiles={tiles}
          onUpdateTiles={handleUpdateTiles}
          onLogout={handleLogout}
          onGoToHome={() => setPage('home')}
        />
      )}

      {showAdminLogin && (
        <AdminLogin 
          onLogin={handleAdminLogin}
          onCancel={() => setShowAdminLogin(false)}
        />
      )}
    </div>
  );
}
