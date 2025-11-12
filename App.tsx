import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardHeader } from './components/DashboardHeader';
import { PlayerTable } from './components/PlayerTable';
import { PlayerDetailModal } from './components/PlayerDetailModal';
import { useFootballData } from './hooks/useFootballData';
import type { PlayerProfile } from './types';
import { LEAGUES } from './constants';
import { PlayerTableSkeleton } from './components/PlayerTableSkeleton';
import { PlayerComparisonModal } from './components/PlayerComparisonModal';

type SortableKey = 'name' | 'position' | 'avgMinutes' | 'fatigueIndex' | 'risk';

const App: React.FC = () => {
  const [selectedLeagueId, setSelectedLeagueId] = useState<number>(LEAGUES[0].id);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerProfile | null>(null);
  const [comparisonPlayers, setComparisonPlayers] = useState<PlayerProfile[]>([]);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: SortableKey; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });

  const { teams, teamData, injuries, loading, error } = useFootballData(selectedLeagueId, selectedTeamId);

  // Reset team, player, and comparison selection when league changes
  useEffect(() => {
    setSelectedTeamId(null);
    setSelectedPlayer(null);
    setComparisonPlayers([]);
  }, [selectedLeagueId]);
  
  // Reset comparison selection when team changes
  useEffect(() => {
    setComparisonPlayers([]);
  }, [selectedTeamId]);

  // Set a default team once teams are loaded
  useEffect(() => {
    if (teams.length > 0 && !selectedTeamId) {
      setSelectedTeamId(teams[0].id);
    }
  }, [teams, selectedTeamId]);


  const summaryStats = useMemo(() => {
    const totalPlayers = teamData.length;
    const injuredPlayers = teamData.filter(p => p.isInjured).length;
    const highRiskCount = teamData.filter(p => p.risk.level === 'High').length;
    
    const avgFatigue = totalPlayers > 0 
      ? teamData.reduce((acc, p) => acc + p.workload.fatigueIndex, 0) / totalPlayers
      : 0;

    return {
      totalPlayers,
      injuredPlayers,
      highRiskCount,
      avgFatigue: Math.round(avgFatigue * 100),
    };
  }, [teamData]);

  const sortedPlayers = useMemo(() => {
    const sortableItems = [...teamData];
    if (sortConfig) {
        sortableItems.sort((a, b) => {
            let aValue: string | number;
            let bValue: string | number;

            switch (sortConfig.key) {
                case 'avgMinutes':
                    aValue = a.workload.avgMinutes;
                    bValue = b.workload.avgMinutes;
                    break;
                case 'fatigueIndex':
                    aValue = a.workload.fatigueIndex;
                    bValue = b.workload.fatigueIndex;
                    break;
                case 'risk':
                    const riskOrder = { 'Low': 1, 'Medium': 2, 'High': 3 };
                    aValue = riskOrder[a.risk.level];
                    bValue = riskOrder[b.risk.level];
                    break;
                case 'name':
                case 'position':
                    aValue = a[sortConfig.key];
                    bValue = b[sortConfig.key];
                    break;
            }

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }
    return sortableItems;
  }, [teamData, sortConfig]);

  const handleSort = (key: SortableKey) => {
      let direction: 'asc' | 'desc' = 'asc';
      if (sortConfig.key === key && sortConfig.direction === 'asc') {
          direction = 'desc';
      }
      setSortConfig({ key, direction });
  };


  const handleToggleComparePlayer = (player: PlayerProfile) => {
    setComparisonPlayers(prev => {
      const isSelected = prev.find(p => p.id === player.id);
      if (isSelected) {
        return prev.filter(p => p.id !== player.id);
      }
      if (prev.length < 2) {
        return [...prev, player];
      }
      return prev; // Don't add more than 2
    });
  };

  const handleClearComparison = () => {
    setComparisonPlayers([]);
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 font-sans">
      <Sidebar
        leagues={LEAGUES}
        teams={teams}
        selectedLeagueId={selectedLeagueId}
        selectedTeamId={selectedTeamId}
        onSelectLeague={setSelectedLeagueId}
        onSelectTeam={setSelectedTeamId}
        loadingTeams={loading.teams}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">Football Workload & Injury Risk Dashboard</h1>
          <p className="text-gray-600">Analysis of player condition in Europe's top leagues.</p>
        </div>
        <div className="flex-1 flex flex-col p-6 overflow-y-auto">
          <div className="fade-in">
            <DashboardHeader stats={summaryStats} injuries={injuries} teamData={teamData}/>
          </div>
          <div className="mt-6 flex-1">
            {loading.teamData ? (
              <PlayerTableSkeleton />
            ) : error ? (
              <div className="text-red-500 text-center fade-in">{error}</div>
            ) : teamData.length > 0 ? (
              <div className="fade-in">
                 <div className="flex justify-end items-center mb-4 space-x-4">
                    <span className="text-sm text-gray-600">
                        Selected for comparison: {comparisonPlayers.length}/2
                    </span>
                    <button
                        onClick={() => setIsComparisonModalOpen(true)}
                        disabled={comparisonPlayers.length !== 2}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        Compare Players
                    </button>
                    <button
                        onClick={handleClearComparison}
                        disabled={comparisonPlayers.length === 0}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        Clear
                    </button>
                </div>
                <PlayerTable
                  players={sortedPlayers}
                  onPlayerSelect={setSelectedPlayer}
                  onToggleCompare={handleToggleComparePlayer}
                  comparisonList={comparisonPlayers.map(p => p.id)}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                />
              </div>
            ) : (
              <div className="text-center text-gray-600 mt-10 fade-in">
                 <h3 className="text-lg font-semibold">No Player Data</h3>
                 <p>Select a team from the sidebar to view player workload and injury analysis.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      {selectedPlayer && (
        <PlayerDetailModal player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
      )}
      {isComparisonModalOpen && comparisonPlayers.length === 2 && (
        <PlayerComparisonModal 
            players={comparisonPlayers as [PlayerProfile, PlayerProfile]} 
            onClose={() => setIsComparisonModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default App;