
export interface League {
  id: number;
  name: string;
}

export interface Team {
  id: number;
  name: string;
  position: number;
}

export interface SofaScoreInjury {
  player: {
    id: number;
    name: string;
  };
  injury: {
    type: string;
  };
}

export interface PlayerProfile {
  id: number;
  name: string;
  position: string; // 'G', 'D', 'M', 'F'
  jerseyNumber: number;
  country: string;
  height: number;
  isInjured: boolean;
  injuryType?: string;
  workload: {
    avgMinutes: number;
    fatigueIndex: number; // 0-1
    minutesLast5: number[];
    appearances: number;
    totalMinutes: number;
  };
  risk: {
    level: 'Low' | 'Medium' | 'High';
    score: number; // 0-1
    factors: string[];
  };
  nextMatch?: {
    opponent: string;
    date: string;
    isHome: boolean;
  };
}

// Raw types from data/ files for api service
export interface SofaScoreTeam {
    id: number;
    name: string;
}

export interface SofaScorePlayerStat {
    player: {
        id: number;
        name: string;
        position: string; // 'G', 'D', 'M', 'F'
        jerseyNumber: number;
        country: { name: string };
        height: number;
    };
    statistics: {
        appearances: number;
        minutesPlayed: number;
    };
}

export interface SofaScoreFixture {
    id: number;
    startTimestamp: number;
    homeTeam: { name: string };
    awayTeam: { name: string };
    homeScore: { current?: number };
    awayScore: { current?: number };
}

export interface LeagueData {
    seasonId: number;
    teams: SofaScoreTeam[];
    injuries: SofaScoreInjury[];
    players: Record<string, SofaScorePlayerStat[]>;
    pastFixtures: Record<string, SofaScoreFixture[]>;
    nextFixtures: Record<string, SofaScoreFixture[]>;
}
