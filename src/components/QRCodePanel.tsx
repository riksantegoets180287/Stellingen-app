import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodePanelProps {
  statementId: string;
}

export default function QRCodePanel({ statementId }: QRCodePanelProps) {
  const voteUrl = `${window.location.origin}/vote/${statementId}`;

  return (
    <div className="summa-card p-6 bg-summa-white border-2 border-summa-indigo/10 text-center">
      <h3 className="text-xl text-summa-indigo mb-4">Scan om te stemmen</h3>

      <div className="flex justify-center mb-4">
        <div className="p-4 bg-white rounded-2xl shadow-lg">
          <QRCodeSVG value={voteUrl} size={200} />
        </div>
      </div>

      <p className="text-sm text-summa-dark/60 mb-2">
        Je mag 1 keer per dag stemmen.
      </p>

      <div className="mt-4 p-3 bg-summa-gray rounded-xl">
        <p className="text-xs text-summa-dark/60 break-all">
          {voteUrl}
        </p>
      </div>
    </div>
  );
}
