import React, { useMemo } from 'react';
import { InjuryPieChart } from './charts/InjuryPieChart';
import type { PlayerProfile, SofaScoreInjury } from '../types';

interface DashboardHeaderProps {
  stats: {
    totalPlayers: number;
    injuredPlayers: number;
    highRiskCount: number;
    avgFatigue: number;
  };
  injuries: SofaScoreInjury[];
  teamData: PlayerProfile[];
}

const StatCard: React.FC<{ title: string; value: string | number; subtext?: string; color: string }> = ({ title, value, subtext, color }) => (
  <div className="bg-white p-5 rounded-lg shadow-sm flex-1 border border-gray-200">
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
    {subtext && <p className="text-xs text-gray-400">{subtext}</p>}
  </div>
);

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ stats, injuries, teamData }) => {
  const pieChartData = useMemo(() => {
    if (!injuries.length || !teamData.length) return [];
    
    const injuredPlayerPositions = injuries.reduce((acc, injury) => {
      const player = teamData.find(p => p.id === injury.player.id);
      if (player) {
        acc[player.position] = (acc[player.position] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(injuredPlayerPositions).map(([name, value]) => ({ name, value }));
  }, [injuries, teamData]);


  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard title="Total Players" value={stats.totalPlayers} color="text-blue-600" />
        <StatCard title="Currently Injured" value={stats.injuredPlayers} color="text-yellow-500" />
        <StatCard title="High Risk Players" value={stats.highRiskCount} color="text-red-500" />
        <StatCard title="Avg. Fatigue Index" value={`${stats.avgFatigue}%`} color="text-green-500" />
      </div>
      <div className="lg:col-span-2 bg-white p-5 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 mb-2 text-center">Injuries by Position</h3>
        {pieChartData.length > 0 ? (
            <InjuryPieChart data={pieChartData} />
        ) : (
            <div className="flex items-center justify-center h-full text-gray-400">No injury data to display.</div>
        )}
      </div>
    </div>
  );
};
