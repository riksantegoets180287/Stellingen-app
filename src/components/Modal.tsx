import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl overflow-hidden summa-card"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between p-6 border-b border-summa-gray">
              <h2 className="text-2xl text-summa-indigo">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 transition-colors rounded-full hover:bg-summa-gray"
                aria-label="Sluiten"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-8 overflow-y-auto max-h-[70vh] text-lg leading-relaxed">
              {children}
            </div>
            <div className="flex justify-end p-6 bg-summa-gray/30">
              <button
                onClick={onClose}
                className="summa-button bg-summa-indigo text-summa-white hover:bg-opacity-90"
              >
                Sluiten
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
