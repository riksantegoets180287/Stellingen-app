import { supabase } from '../supabaseClient';

export type VoteType = 'accept' | 'unsure' | 'no';

export interface VoteData {
  accept: number;
  unsure: number;
  no: number;
}

const getTodayKey = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

export const hasVotedToday = (statementId: string): boolean => {
  const todayKey = getTodayKey();
  const storageKey = `voted_${statementId}_${todayKey}`;
  return localStorage.getItem(storageKey) === 'true';
};

const markAsVoted = (statementId: string): void => {
  const todayKey = getTodayKey();
  const storageKey = `voted_${statementId}_${todayKey}`;
  localStorage.setItem(storageKey, 'true');
};

export const getVotes = async (statementId: string): Promise<VoteData | null> => {
  const { data, error } = await supabase
    .from('stellingen')
    .select('votes_accept, votes_unsure, votes_no')
    .eq('id', statementId)
    .maybeSingle();

  if (error || !data) {
    console.error('Error fetching votes:', error);
    return null;
  }

  return {
    accept: data.votes_accept || 0,
    unsure: data.votes_unsure || 0,
    no: data.votes_no || 0,
  };
};

export const addVote = async (statementId: string, voteType: VoteType): Promise<boolean> => {
  if (hasVotedToday(statementId)) {
    return false;
  }

  const currentVotes = await getVotes(statementId);
  if (!currentVotes) {
    return false;
  }

  const updates: any = {};
  if (voteType === 'accept') {
    updates.votes_accept = currentVotes.accept + 1;
  } else if (voteType === 'unsure') {
    updates.votes_unsure = currentVotes.unsure + 1;
  } else if (voteType === 'no') {
    updates.votes_no = currentVotes.no + 1;
  }

  const { error } = await supabase
    .from('stellingen')
    .update(updates)
    .eq('id', statementId);

  if (error) {
    console.error('Error adding vote:', error);
    return false;
  }

  markAsVoted(statementId);
  return true;
};

export const resetVotes = async (statementId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('stellingen')
    .update({
      votes_accept: 0,
      votes_unsure: 0,
      votes_no: 0,
    })
    .eq('id', statementId);

  if (error) {
    console.error('Error resetting votes:', error);
    return false;
  }

  return true;
};

export const clearLocalVoteFlags = (statementId?: string): void => {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('voted_')) {
      if (statementId) {
        if (key.startsWith(`voted_${statementId}_`)) {
          localStorage.removeItem(key);
        }
      } else {
        localStorage.removeItem(key);
      }
    }
  });
};
