import React from 'react';
import { TileContent } from '../types';
import { ArrowLeft, Info } from 'lucide-react';
import StandpointButtons from '../components/StandpointButtons';
import Modal from '../components/Modal';
import LiveResults from '../components/LiveResults';
import QRCodePanel from '../components/QRCodePanel';

interface StatementProps {
  tile: TileContent;
  onBack: () => void;
}

export default function Statement({ tile, onBack }: StatementProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden bg-summa-white">
      {/* Left Panel (2/3) */}
      <div className="flex-[2] flex flex-col h-full relative border-r border-summa-gray">
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 z-10 p-3 bg-summa-white/80 backdrop-blur rounded-full shadow-md hover:bg-summa-white transition-colors"
        >
          <ArrowLeft size={24} className="text-summa-indigo" />
        </button>

        <div className="flex-1 p-4 md:p-8 flex flex-col items-center justify-center">
          <div className="max-w-4xl w-full flex flex-col items-center gap-6">
            <h2 className="text-2xl md:text-4xl text-summa-indigo text-center font-serif font-bold leading-tight">
              {tile.title}
            </h2>
            
            <p className="text-lg md:text-xl text-summa-dark/70 text-center font-sans max-w-2xl">
              {tile.statement}
            </p>
            
            {tile.image && (
              <div className="rounded-xl overflow-hidden shadow-lg bg-summa-gray max-w-md w-full max-h-[30vh]">
                <img 
                  src={tile.image} 
                  alt={tile.title}
                  className="w-full h-full object-contain bg-summa-gray/50"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </div>
        </div>

        <div className="p-6 bg-summa-gray/20 border-t border-summa-gray sticky bottom-0">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full max-w-md mx-auto flex items-center justify-center gap-3 summa-button bg-summa-indigo text-summa-white text-xl shadow-lg hover:scale-[1.02]"
          >
            <Info size={24} />
            Standpunt school
          </button>
        </div>
      </div>

      {/* Right Panel (1/3) */}
      <div className="flex-1 h-full bg-summa-gray/30 overflow-y-auto">
        <div className="p-6 space-y-6">
          <StandpointButtons />

          {tile.classVoting?.enabled && (
            <>
              <QRCodePanel statementId={tile.id} />

              {tile.classVoting.liveResults && (
                <LiveResults statementId={tile.id} />
              )}
            </>
          )}
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Standpunt school"
      >
        <p className="whitespace-pre-wrap">{tile.schoolStandpoint}</p>
      </Modal>
    </div>
  );
}
