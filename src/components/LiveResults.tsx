import React, { useEffect, useState } from 'react';
import { getVotes, VoteData } from '../voting/votingStorage';

interface LiveResultsProps {
  statementId: string;
}

export default function LiveResults({ statementId }: LiveResultsProps) {
  const [votes, setVotes] = useState<VoteData>({ accept: 0, unsure: 0, no: 0 });

  const loadVotes = async () => {
    const data = await getVotes(statementId);
    if (data) {
      setVotes(data);
    }
  };

  useEffect(() => {
    loadVotes();

    const interval = setInterval(() => {
      loadVotes();
    }, 1000);

    const handleStorageChange = () => {
      loadVotes();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [statementId]);

  const total = votes.accept + votes.unsure + votes.no;
  const acceptPercent = total > 0 ? Math.round((votes.accept / total) * 100) : 0;
  const unsurePercent = total > 0 ? Math.round((votes.unsure / total) * 100) : 0;
  const noPercent = total > 0 ? Math.round((votes.no / total) * 100) : 0;

  return (
    <div className="summa-card p-6 bg-summa-white border-2 border-summa-indigo/10">
      <h3 className="text-xl text-summa-indigo mb-4">Live Resultaten</h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-summa-green/10 rounded-xl">
          <span className="text-summa-green font-bold">🟢 Acceptabel</span>
          <span className="text-summa-green font-bold">
            {votes.accept} ({acceptPercent}%)
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-summa-blue/10 rounded-xl">
          <span className="text-summa-blue font-bold">🔵 ?</span>
          <span className="text-summa-blue font-bold">
            {votes.unsure} ({unsurePercent}%)
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-summa-red/10 rounded-xl">
          <span className="text-summa-red font-bold">🔴 Onacceptabel</span>
          <span className="text-summa-red font-bold">
            {votes.no} ({noPercent}%)
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-summa-dark/10">
        <div className="flex items-center justify-between">
          <span className="text-summa-dark/60 text-sm">Totaal stemmen</span>
          <span className="text-summa-indigo font-bold">{total}</span>
        </div>
      </div>

      <p className="text-xs text-summa-dark/40 mt-4 text-center">
        Stemmen is anoniem. We zien geen namen.
      </p>
    </div>
  );
}
