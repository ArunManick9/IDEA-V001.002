import React from 'react';

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full border-white border-t-transparent"></div>
        <p className="mt-4 text-white text-lg">Loading, please wait...</p>
      </div>
    </div>
  );
};

export default Loading;
