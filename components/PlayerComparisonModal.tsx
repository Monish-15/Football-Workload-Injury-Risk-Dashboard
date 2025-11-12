import React from 'react';
import type { PlayerProfile } from '../types';
import { RiskGauge } from './charts/RiskGauge';
import { ComparisonWorkloadChart } from './charts/ComparisonWorkloadChart';

interface PlayerComparisonModalProps {
  players: [PlayerProfile, PlayerProfile];
  onClose: () => void;
}

const PlayerInfoCard: React.FC<{player: PlayerProfile}> = ({ player }) => (
    <div className="flex flex-col items-center text-center p-4 rounded-lg bg-gray-50 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">{player.name}</h3>
        <p className="text-sm text-gray-500">#{player.jerseyNumber} | {player.position}</p>
        <div className="my-4">
             <RiskGauge score={player.risk.score} level={player.risk.level} />
        </div>
        {player.isInjured && (
            <p className="mt-2 text-xs text-center font-semibold text-red-600">INJURED: {player.injuryType}</p>
        )}
    </div>
);

const StatsTable: React.FC<{ players: [PlayerProfile, PlayerProfile] }> = ({ players }) => {
    const [p1, p2] = players;
    const stats = [
        { label: 'Avg. Mins (Last 5)', value1: p1.workload.avgMinutes.toFixed(0), value2: p2.workload.avgMinutes.toFixed(0) },
        { label: 'Fatigue Index', value1: `${(p1.workload.fatigueIndex * 100).toFixed(0)}%`, value2: `${(p2.workload.fatigueIndex * 100).toFixed(0)}%` },
        { label: 'Risk Score', value1: (p1.risk.score * 100).toFixed(0), value2: (p2.risk.score * 100).toFixed(0) },
        { label: 'Risk Level', value1: p1.risk.level, value2: p2.risk.level },
    ];

    return (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">Key Metrics Comparison</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="py-2 px-2 font-medium text-gray-500">Metric</th>
                            <th className="py-2 px-2 font-semibold text-gray-800 text-center">{p1.name}</th>
                            <th className="py-2 px-2 font-semibold text-gray-800 text-center">{p2.name}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.map(stat => (
                            <tr key={stat.label} className="border-b border-gray-100 last:border-b-0">
                                <td className="py-3 px-2 font-medium text-gray-600">{stat.label}</td>
                                <td className="py-3 px-2 text-center text-gray-800">{stat.value1}</td>
                                <td className="py-3 px-2 text-center text-gray-800">{stat.value2}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const PlayerComparisonModal: React.FC<PlayerComparisonModalProps> = ({ players, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Player Comparison</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto bg-gray-50 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PlayerInfoCard player={players[0]} />
                <PlayerInfoCard player={players[1]} />
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Workload Comparison (Last 5 Matches)</h3>
                <ComparisonWorkloadChart players={players} />
            </div>

            <StatsTable players={players} />
        </div>
      </div>
    </div>
  );
};