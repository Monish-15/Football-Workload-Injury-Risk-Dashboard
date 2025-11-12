
import React from 'react';
import type { PlayerProfile } from '../types';
import { RiskGauge } from './charts/RiskGauge';
import { WorkloadChart } from './charts/WorkloadChart';

interface PlayerDetailModalProps {
  player: PlayerProfile;
  onClose: () => void;
}

export const PlayerDetailModal: React.FC<PlayerDetailModalProps> = ({ player, onClose }) => {
  const workloadChartData = player.workload.minutesLast5.map((minutes, index) => ({
    name: `Match ${index + 1}`,
    minutes,
  }));

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{player.name}</h2>
            <p className="text-sm text-gray-500">#{player.jerseyNumber} | {player.position} | {player.country}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto bg-gray-50 space-y-6">
          {player.isInjured && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <p className="font-bold">Currently Injured</p>
              <p>Reason: {player.injuryType || 'Not specified'}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Injury Risk</h3>
              <RiskGauge score={player.risk.score} level={player.risk.level} />
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Risk Factors</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    {player.risk.factors.map((factor, i) => <li key={i}>{factor}</li>)}
                </ul>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Workload Analysis</h3>
             <div className="grid grid-cols-2 gap-4 text-center mb-4">
                <div>
                    <div className="text-2xl font-bold text-blue-600">{player.workload.totalMinutes}</div>
                    <div className="text-xs text-gray-500">Total Minutes Played</div>
                </div>
                 <div>
                    <div className="text-2xl font-bold text-blue-600">{player.workload.appearances}</div>
                    <div className="text-xs text-gray-500">Appearances</div>
                </div>
            </div>
            <h4 className="text-md font-semibold text-gray-700 mb-2 text-center">Minutes in Last 5 Matches</h4>
            <WorkloadChart data={workloadChartData} />
          </div>

          {player.nextMatch && (
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Next Match</h3>
                <p>vs <span className="font-bold">{player.nextMatch.opponent}</span> on <span className="font-bold">{player.nextMatch.date}</span></p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
