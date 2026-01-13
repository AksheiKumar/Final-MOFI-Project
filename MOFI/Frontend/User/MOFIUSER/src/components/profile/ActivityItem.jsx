import React from 'react';
import { FiStar, FiMessageSquare, FiList, FiZap } from 'react-icons/fi';

const ActivityItem = ({ type, movie, rating, time }) => {
  let typeColor = 'text-green-400';
  let typeIcon = <FiStar className="w-5 h-5" />;

  if (type === 'Review') {
    typeColor = 'text-yellow-400';
    typeIcon = <FiMessageSquare className="w-5 h-5" />;
  } else if (type === 'Watchlist') {
    typeColor = 'text-blue-400';
    typeIcon = <FiList className="w-5 h-5" />;
  } else if (type === 'Pre-Review') {
    typeColor = 'text-amber-400';
    typeIcon = <FiZap className="w-5 h-5" />;
  }

  return (
    <div className="flex items-start p-2 md:p-3 bg-gray-900 rounded-lg hover:bg-gray-700 transition space-x-3 md:space-x-4">
      <div className={`p-1.5 md:p-2 rounded-full ${typeColor} bg-gray-800 flex-shrink-0`}>
        {typeIcon}
      </div>
      <div className="flex-grow min-w-0">
        <p className="text-white font-medium flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm md:text-base">
          <span className="truncate">
            {type === 'Watchlist' 
              ? `Added "${movie}" to Watchlist`
              : type === 'Pre-Review'
              ? `Gave a Pre-Release Score for "${movie}"`
              : `Posted a Review for "${movie}"`}
          </span>
          
          {rating && (
            <span className="text-sm font-bold text-yellow-400 flex items-center ml-4">
              ⭐ {rating}
            </span>
          )}
        </p>
        <p className="text-gray-400 text-xs mt-0.5">{time}</p>
      </div>
    </div>
  );
};

export default ActivityItem;
