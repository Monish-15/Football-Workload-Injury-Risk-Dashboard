import React from 'react';
import type { League, Team } from '../types';
import { Spinner } from './Spinner';

interface SidebarProps {
  leagues: League[];
  teams: Team[];
  selectedLeagueId: number;
  selectedTeamId: number | null;
  onSelectLeague: (id: number) => void;
  onSelectTeam: (id: number) => void;
  loadingTeams: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  leagues,
  teams,
  selectedLeagueId,
  selectedTeamId,
  onSelectLeague,
  onSelectTeam,
  loadingTeams
}) => {
  return (
    <aside className="w-72 bg-white p-4 flex flex-col border-r border-gray-200 h-full overflow-y-auto">
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">Leagues</h2>
        <ul className="space-y-1">
          {leagues.map((league) => (
            <li key={league.id}>
              <button
                onClick={() => onSelectLeague(league.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                  selectedLeagueId === league.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {league.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 flex-1">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">Teams</h2>
        {loadingTeams ? (
          <div className="flex justify-center items-center h-32">
            <Spinner />
          </div>
        ) : (
          <ul className="space-y-1">
            {teams.map((team) => (
              <li key={team.id}>
                <button
                  onClick={() => onSelectTeam(team.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-150 flex items-center ${
                    selectedTeamId === team.id
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="w-6 text-xs text-gray-400">{team.position}.</span>
                  <span>{team.name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
};
