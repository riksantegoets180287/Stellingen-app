import React from 'react';
import { TileContent } from '../types';
import { motion } from 'motion/react';

interface TileProps {
  tile: TileContent;
  onClick: () => void;
}

const colorMap = {
  indigo: 'border-summa-indigo text-summa-indigo',
  blue: 'border-summa-blue text-summa-blue',
  yellow: 'border-summa-yellow text-summa-yellow',
  green: 'border-summa-green text-summa-green',
  red: 'border-summa-red text-summa-red',
};

const Tile: React.FC<TileProps> = ({ tile, onClick }) => {
  return (
    <motion.button
      whileHover={{ y: -3, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`summa-card w-full overflow-hidden flex flex-col text-center border-t-4 ${colorMap[tile.accentColor]} hover:shadow-lg cursor-pointer bg-summa-white`}
    >
      <div className="w-full aspect-video bg-summa-gray relative overflow-hidden">
        {tile.image ? (
          <img 
            src={tile.image} 
            alt={tile.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center bg-current opacity-10`} />
        )}
      </div>
      <div className="p-2 flex-1 flex items-center justify-center">
        <h3 className="text-[10px] md:text-xs font-bold leading-tight line-clamp-2 text-summa-indigo">
          {tile.title}
        </h3>
      </div>
    </motion.button>
  );
};

export default Tile;
