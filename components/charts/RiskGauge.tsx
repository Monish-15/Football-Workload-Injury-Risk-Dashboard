import React from 'react';

interface RiskGaugeProps {
  score: number;
  level: 'Low' | 'Medium' | 'High';
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score, level }) => {
  const percentage = Math.min(Math.max(score, 0), 1);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage * circumference * 0.75); // 0.75 for 3/4 circle
  
  const colorClasses = {
    Low: 'text-green-500',
    Medium: 'text-yellow-500',
    High: 'text-red-500',
  };

  return (
    <div className="relative w-40 h-40">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Background track */}
        <path
          d="M 10,50 A 40,40 0 1,1 90,50"
          fill="none"
          stroke="#e5e7eb" // gray-200
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* Filled arc */}
        <path
          d="M 10,50 A 40,40 0 1,1 90,50"
          fill="none"
          stroke="currentColor"
          className={colorClasses[level]}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference * 0.75}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-bold ${colorClasses[level]}`}>
          {Math.round(score * 100)}
        </span>
        <span className="text-sm text-gray-500">{level} Risk</span>
      </div>
    </div>
  );
};
