import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WorkloadChartProps {
  data: { name: string; minutes: number }[];
}

export const WorkloadChart: React.FC<WorkloadChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 20,
          left: -10,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="name" tick={{ fill: '#6b7281', fontSize: 12 }} />
        <YAxis tick={{ fill: '#6b7281', fontSize: 12 }} domain={[0, 90]} />
        <Tooltip
          contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          itemStyle={{ color: '#3b82f6' }}
          labelStyle={{ color: '#374151' }}
        />
        <Bar dataKey="minutes" fill="#3b82f6" barSize={30} />
      </BarChart>
    </ResponsiveContainer>
  );
};
