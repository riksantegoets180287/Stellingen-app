import React, { useState, useEffect } from 'react';
import { useParams } from './Vote';
import { supabase } from '../supabaseClient';
import { hasVotedToday, addVote } from '../voting/votingStorage';

interface Statement {
  id: string;
  title: string;
  statement: string;
  class_voting_closed: boolean;
}

export default function Vote() {
  const statementId = window.location.pathname.split('/vote/')[1];
  const [statement, setStatement] = useState<Statement | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (statementId) {
      loadStatement();
      setHasVoted(hasVotedToday(statementId));
    }
  }, [statementId]);

  const loadStatement = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('stellingen')
      .select('id, title, statement, class_voting_closed')
      .eq('id', statementId)
      .maybeSingle();

    if (error || !data) {
      console.error('Error loading statement:', error);
      setMessage('Deze stelling bestaat niet.');
    } else {
      setStatement(data);
    }
    setLoading(false);
  };

  const handleVote = async (voteType: 'accept' | 'unsure' | 'no') => {
    if (!statementId || hasVoted || isSubmitting) return;

    setIsSubmitting(true);
    const success = await addVote(statementId, voteType);

    if (success) {
      setHasVoted(true);
      setMessage('Dank je voor je stem.');
    } else {
      setMessage('Er ging iets mis. Probeer opnieuw.');
    }
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-summa-gray flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-2xl text-summa-indigo">Laden...</div>
        </div>
      </div>
    );
  }

  if (!statement) {
    return (
      <div className="min-h-screen bg-summa-gray flex items-center justify-center p-6">
        <div className="summa-card p-8 text-center max-w-md">
          <div className="text-2xl text-summa-red mb-4">⚠️</div>
          <div className="text-xl text-summa-indigo">{message || 'Stelling niet gevonden.'}</div>
        </div>
      </div>
    );
  }

  const isClosed = statement.class_voting_closed;
  const canVote = !hasVoted && !isClosed && !isSubmitting;

  return (
    <div className="min-h-screen bg-summa-gray flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="summa-card p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl text-summa-indigo mb-4 text-center">
            {statement.title}
          </h1>

          {statement.statement && (
            <p className="text-lg text-summa-dark/80 mb-8 text-center">
              {statement.statement}
            </p>
          )}

          {message && (
            <div className="mb-6 p-4 bg-summa-indigo/10 rounded-xl text-center">
              <p className="text-lg text-summa-indigo">{message}</p>
            </div>
          )}

          {isClosed && !message && (
            <div className="mb-6 p-4 bg-summa-red/10 rounded-xl text-center">
              <p className="text-lg text-summa-red">Stemmen is gesloten.</p>
            </div>
          )}

          {hasVoted && !isClosed && !message && (
            <div className="mb-6 p-4 bg-summa-blue/10 rounded-xl text-center">
              <p className="text-lg text-summa-blue">Je hebt vandaag al gestemd.</p>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={() => handleVote('accept')}
              disabled={!canVote}
              className={`w-full p-6 rounded-2xl text-xl md:text-2xl font-bold transition-all ${
                canVote
                  ? 'bg-summa-green text-white hover:scale-105 hover:shadow-xl'
                  : 'bg-summa-dark/10 text-summa-dark/30 cursor-not-allowed'
              }`}
            >
              🟢 Acceptabel 🙂✅
            </button>

            <button
              onClick={() => handleVote('unsure')}
              disabled={!canVote}
              className={`w-full p-6 rounded-2xl text-xl md:text-2xl font-bold transition-all ${
                canVote
                  ? 'bg-summa-blue text-white hover:scale-105 hover:shadow-xl'
                  : 'bg-summa-dark/10 text-summa-dark/30 cursor-not-allowed'
              }`}
            >
              🔵 ? 🤔❓
            </button>

            <button
              onClick={() => handleVote('no')}
              disabled={!canVote}
              className={`w-full p-6 rounded-2xl text-xl md:text-2xl font-bold transition-all ${
                canVote
                  ? 'bg-summa-red text-white hover:scale-105 hover:shadow-xl'
                  : 'bg-summa-dark/10 text-summa-dark/30 cursor-not-allowed'
              }`}
            >
              🔴 Onacceptabel ⚠️⛔
            </button>
          </div>

          <p className="text-sm text-summa-dark/40 text-center mt-8">
            Dit is anoniem. We zien geen namen.
          </p>
        </div>
      </div>
    </div>
  );
}
