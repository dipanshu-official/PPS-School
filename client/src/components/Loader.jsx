import React from 'react';
import { useSelector } from 'react-redux';


const Loader = ({ text = "Loading...", color = "blue-500" }) => {
  
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50">
      <div
        className={`w-16 h-16 border-4 border-${color} border-t-transparent rounded-full animate-spin`}
      ></div>
      <p className="mt-4 text-white text-lg">{text}</p>
    </div>
  );
};

export default Loader;
