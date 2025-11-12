import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { PlayerProfile } from '../../types';

interface ComparisonWorkloadChartProps {
  players: [PlayerProfile, PlayerProfile];
}

export const ComparisonWorkloadChart: React.FC<ComparisonWorkloadChartProps> = ({ players }) => {
  const [player1, player2] = players;

  const data = player1.workload.minutesLast5.map((_, i) => ({
    name: `Match ${i + 1}`,
    [player1.name]: player1.workload.minutesLast5[i],
    [player2.name]: player2.workload.minutesLast5[i],
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="name" tick={{ fill: '#6b7281', fontSize: 12 }} />
        <YAxis tick={{ fill: '#6b7281', fontSize: 12 }} domain={[0, 90]} />
        <Tooltip
          contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          labelStyle={{ color: '#374151' }}
        />
        <Legend wrapperStyle={{ fontSize: '12px', color: '#4b5563', paddingTop: '10px' }} />
        <Bar dataKey={player1.name} fill="#3b82f6" barSize={20} />
        <Bar dataKey={player2.name} fill="#84a9f5" barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
};