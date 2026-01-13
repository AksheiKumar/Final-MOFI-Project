import React from 'react';

const MetricCard = ({ icon: Icon, label, value, unit, isText, color = 'text-amber-500' }) => (
  <div className="bg-gray-900 p-3 md:p-4 rounded-xl text-center border border-gray-700 hover:border-amber-500 hover:shadow-lg hover:shadow-amber-900/20 transition-all duration-300">
    <Icon className={`w-5 h-5 md:w-6 md:h-6 mx-auto mb-2 ${color}`} />
    <p className="text-gray-400 text-xs uppercase font-medium truncate">{label}</p>
    {isText ? (
      <p className="text-white text-sm md:text-md font-bold truncate mt-1">{value}</p>
    ) : (
      <p className="text-white text-xl md:text-2xl font-extrabold mt-1">
        {value}<span className="text-xs md:text-sm font-semibold ml-1 text-gray-400">{unit}</span>
      </p>
    )}
  </div>
);

export default MetricCard;
