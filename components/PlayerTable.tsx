import React from 'react';
import type { PlayerProfile } from '../types';

type SortableKey = 'name' | 'position' | 'avgMinutes' | 'fatigueIndex' | 'risk';

interface PlayerTableProps {
  players: PlayerProfile[];
  onPlayerSelect: (player: PlayerProfile) => void;
  onToggleCompare: (player: PlayerProfile) => void;
  comparisonList: number[];
  onSort: (key: SortableKey) => void;
  sortConfig: { key: SortableKey; direction: 'asc' | 'desc' };
}

const RiskBadge: React.FC<{ level: 'Low' | 'Medium' | 'High' }> = ({ level }) => {
  const colorClasses = {
    Low: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    High: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClasses[level]}`}>
      {level}
    </span>
  );
};

export const PlayerTable: React.FC<PlayerTableProps> = ({ players, onPlayerSelect, onToggleCompare, comparisonList, onSort, sortConfig }) => {
  const isMaxSelected = comparisonList.length >= 2;

  const renderSortableHeader = (title: string, key: SortableKey) => (
    <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => onSort(key)}>
        <div className="flex items-center">
            {title}
            {sortConfig.key === key && (
                <span className="ml-2 text-xs text-gray-500">
                    {sortConfig.direction === 'asc' ? '▲' : '▼'}
                </span>
            )}
        </div>
    </th>
  );
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 w-12 text-center"></th>
              {renderSortableHeader('Player', 'name')}
              {renderSortableHeader('Position', 'position')}
              {renderSortableHeader('Avg. Mins (Last 5)', 'avgMinutes')}
              {renderSortableHeader('Fatigue Index', 'fatigueIndex')}
              {renderSortableHeader('Injury Risk', 'risk')}
            </tr>
          </thead>
          <tbody>
            {players.map((player) => {
              const isSelectedForCompare = comparisonList.includes(player.id);
              return (
              <tr
                key={player.id}
                className="bg-white border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-4 py-4 text-center">
                    <input 
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-200"
                      checked={isSelectedForCompare}
                      onChange={() => onToggleCompare(player)}
                      disabled={!isSelectedForCompare && isMaxSelected}
                      aria-label={`Select ${player.name} for comparison`}
                    />
                  </td>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap cursor-pointer" onClick={() => onPlayerSelect(player)}>
                  <div className="flex items-center">
                    <span className="font-bold text-gray-400 w-8">#{player.jerseyNumber}</span>
                    <span>{player.name}</span>
                    {player.isInjured && <span className="ml-2 text-red-600 text-xs font-semibold">(Injured)</span>}
                  </div>
                </td>
                <td className="px-6 py-4 cursor-pointer" onClick={() => onPlayerSelect(player)}>{player.position}</td>
                <td className="px-6 py-4 cursor-pointer" onClick={() => onPlayerSelect(player)}>{player.workload.avgMinutes.toFixed(0)}</td>
                <td className="px-6 py-4 cursor-pointer" onClick={() => onPlayerSelect(player)}>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full"
                      style={{ width: `${player.workload.fatigueIndex * 100}%` }}
                    ></div>
                  </div>
                </td>
                <td className="px-6 py-4 cursor-pointer" onClick={() => onPlayerSelect(player)}>
                  <RiskBadge level={player.risk.level} />
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
};