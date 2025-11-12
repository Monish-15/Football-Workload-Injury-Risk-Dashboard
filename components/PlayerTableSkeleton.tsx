import React from 'react';

export const PlayerTableSkeleton: React.FC = () => {
  const SkeletonRow = () => (
    <tr className="bg-white border-b border-gray-200">
      <td className="px-4 py-4 text-center">
        <div className="h-4 w-4 bg-gray-200 rounded shimmer-bg mx-auto"></div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="h-4 w-8 bg-gray-200 rounded shimmer-bg mr-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded shimmer-bg"></div>
        </div>
      </td>
      <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-200 rounded shimmer-bg"></div></td>
      <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-200 rounded shimmer-bg"></div></td>
      <td className="px-6 py-4"><div className="h-4 w-full bg-gray-200 rounded shimmer-bg"></div></td>
      <td className="px-6 py-4"><div className="h-6 w-20 bg-gray-200 rounded-full shimmer-bg"></div></td>
    </tr>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 w-12 text-center"></th>
              <th scope="col" className="px-6 py-3">Player</th>
              <th scope="col" className="px-6 py-3">Position</th>
              <th scope="col" className="px-6 py-3">Avg. Mins (Last 5)</th>
              <th scope="col" className="px-6 py-3">Fatigue Index</th>
              <th scope="col" className="px-6 py-3">Injury Risk</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }).map((_, index) => <SkeletonRow key={index} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
};