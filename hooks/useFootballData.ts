
import { useState, useEffect, useCallback } from 'react';
import type { Team, PlayerProfile, SofaScoreInjury } from '../types';
import { getTeams, processTeamData, getSeasons } from '../services/api';

interface LoadingState {
  teams: boolean;
  teamData: boolean;
}

export const useFootballData = (leagueId: number, teamId: number | null) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamData, setTeamData] = useState<PlayerProfile[]>([]);
  const [injuries, setInjuries] = useState<SofaScoreInjury[]>([]);
  const [loading, setLoading] = useState<LoadingState>({ teams: true, teamData: false });
  const [error, setError] = useState<string | null>(null);
  
  const fetchTeams = useCallback(async (currentLeagueId: number) => {
    try {
      setLoading(prev => ({ ...prev, teams: true }));
      setError(null);
      const seasonId = await getSeasons(currentLeagueId);
      if(seasonId) {
        const fetchedTeams = await getTeams(currentLeagueId, seasonId);
        setTeams(fetchedTeams);
      } else {
        setTeams([]);
        throw new Error('No seasons found for this league.');
      }
    } catch (e) {
      setError('Failed to fetch teams. The API might be unavailable.');
      setTeams([]);
    } finally {
      setLoading(prev => ({ ...prev, teams: false }));
    }
  }, []);

  const fetchTeamData = useCallback(async (currentTeamId: number, currentLeagueId: number) => {
    const team = teams.find(t => t.id === currentTeamId);
    if (!team) return;

    try {
      setLoading(prev => ({ ...prev, teamData: true }));
      setError(null);
      const { teamData: processedData, injuries: leagueInjuries } = await processTeamData(currentTeamId, currentLeagueId, team.name);
      setTeamData(processedData);
      setInjuries(leagueInjuries);
    } catch (e) {
      setError('Failed to fetch player data. Please try again later.');
      setTeamData([]);
      setInjuries([]);
    } finally {
      setLoading(prev => ({ ...prev, teamData: false }));
    }
  }, [teams]);


  useEffect(() => {
    fetchTeams(leagueId);
  }, [leagueId, fetchTeams]);

  useEffect(() => {
    if (teamId) {
      fetchTeamData(teamId, leagueId);
    } else {
      setTeamData([]);
      setInjuries([]);
    }
  }, [teamId, leagueId, fetchTeamData]);

  return { teams, teamData, injuries, loading, error };
};
