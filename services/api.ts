
import type { Team, PlayerProfile, SofaScoreInjury, LeagueData, SofaScorePlayerStat } from '../types';

import data17 from '../data/17.ts';
import data8 from '../data/8.ts';
import data23 from '../data/23.ts';
import data35 from '../data/35.ts';
import data34 from '../data/34.ts';

const leagueDataMap: Record<number, any> = {
    17: data17,
    8: data8,
    23: data23,
    35: data35,
    34: data34,
};


// Helper to dynamically import league data
const getLeagueData = async (leagueId: number): Promise<LeagueData | null> => {
    try {
        const data = leagueDataMap[leagueId];
        if (data) {
            return data;
        }
        console.error(`No data for league ${leagueId}`);
        return null;
    } catch (e) {
        console.error(`Failed to load data for league ${leagueId}`, e);
        return null;
    }
};

export const getSeasons = async (leagueId: number): Promise<number | null> => {
    const data = await getLeagueData(leagueId);
    return data ? data.seasonId : null;
};

export const getTeams = async (leagueId: number, seasonId: number): Promise<Team[]> => {
    const data = await getLeagueData(leagueId);
    if (!data || data.seasonId !== seasonId) return [];

    // Assuming the teams are already sorted by league position. Add the position index.
    return data.teams.map((team, index) => ({
        ...team,
        position: index + 1,
    }));
};

// --- Data Processing Logic ---
// This is where we simulate the complex analysis to generate our PlayerProfile

const calculateRisk = (player: SofaScorePlayerStat, isInjured: boolean, totalMinutes: number, appearances: number): PlayerProfile['risk'] => {
    const factors: string[] = [];
    let score = 0;

    // High minutes per appearance
    const minsPerAppearance = appearances > 0 ? totalMinutes / appearances : 0;
    if (minsPerAppearance > 80) {
        score += 0.3;
        factors.push("High average minutes per match.");
    }

    // High total minutes
    if (totalMinutes > 2500) {
        score += 0.2;
        factors.push("High cumulative minutes this season.");
    }
    
    // Injury history
    if (isInjured) {
        score += 0.5;
        factors.push("Currently on the injury list.");
    }
    
    // Positional risk (example: Forwards and Midfielders are higher risk)
    if (['F', 'M'].includes(player.player.position)) {
        score += 0.1;
    }

    // Randomness to make it look more real
    score += (player.player.id % 10) * 0.01;

    score = Math.min(score, 1);

    let level: 'Low' | 'Medium' | 'High' = 'Low';
    if (score > 0.6) level = 'High';
    else if (score > 0.3) level = 'Medium';
    
    if (factors.length === 0) {
        factors.push("No significant risk factors identified.");
    }

    return { score, level, factors };
};


const calculateWorkload = (player: SofaScorePlayerStat): PlayerProfile['workload'] => {
    const { minutesPlayed, appearances } = player.statistics;
    const avgMinutes = appearances > 0 ? minutesPlayed / appearances : 0;
    
    // Simulate minutes in last 5 games. We'll generate some plausible random data.
    const minutesLast5 = Array.from({ length: 5 }, () => {
        if (appearances === 0) return 0;
        // Generate a value around the average, with some variance.
        const base = Math.min(avgMinutes, 90);
        return Math.max(0, Math.min(90, Math.round(base + (Math.random() - 0.5) * 40)));
    });

    // Fatigue is a function of recent and total minutes
    const recentAvg = minutesLast5.reduce((a, b) => a + b, 0) / 5;
    const fatigueIndex = Math.min(
        0.2 * (minutesPlayed / 3500) + 0.8 * (recentAvg / 90),
        1.0
    );

    return {
        totalMinutes: minutesPlayed,
        appearances,
        avgMinutes,
        minutesLast5,
        fatigueIndex: Math.max(0, fatigueIndex)
    };
};


export const processTeamData = async (teamId: number, leagueId: number, teamName: string): Promise<{ teamData: PlayerProfile[], injuries: SofaScoreInjury[] }> => {
    const data = await getLeagueData(leagueId);
    if (!data) {
        return { teamData: [], injuries: [] };
    }

    const teamPlayersRaw = data.players[teamId] || [];
    const leagueInjuries = data.injuries || [];

    const teamData = teamPlayersRaw.map((p): PlayerProfile => {
        const injuryInfo = leagueInjuries.find(i => i.player.id === p.player.id);
        const isInjured = !!injuryInfo;
        const workload = calculateWorkload(p);
        const risk = calculateRisk(p, isInjured, workload.totalMinutes, workload.appearances);

        // Find next match
        const nextFixture = data.nextFixtures?.[teamId]?.[0];
        let nextMatch: PlayerProfile['nextMatch'] | undefined = undefined;
        if (nextFixture) {
            const isHome = nextFixture.homeTeam.name === teamName;
            nextMatch = {
                opponent: isHome ? nextFixture.awayTeam.name : nextFixture.homeTeam.name,
                date: new Date(nextFixture.startTimestamp * 1000).toLocaleDateString(),
                isHome
            };
        }

        return {
            id: p.player.id,
            name: p.player.name,
            position: p.player.position,
            jerseyNumber: p.player.jerseyNumber,
            country: p.player.country.name,
            height: p.player.height,
            isInjured,
            injuryType: injuryInfo?.injury.type,
            workload,
            risk,
            nextMatch,
        };
    });

    return { teamData, injuries: leagueInjuries };
};