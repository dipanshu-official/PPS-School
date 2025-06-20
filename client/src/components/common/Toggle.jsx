import React from 'react';

const Toggle = ({ checked, onChange, disabled = false, label, description, color = 'blue' }) => {
  const colorClasses = {
    blue: 'peer-focus:ring-blue-300 peer-checked:bg-blue-600',
    green: 'peer-focus:ring-green-300 peer-checked:bg-green-600',
    red: 'peer-focus:ring-red-300 peer-checked:bg-red-600'
  };

  return (
    <div className="flex items-center justify-between">
      {(label || description) && (
        <div>
          {label && <div className="font-medium text-gray-900">{label}</div>}
          {description && <div className="text-sm text-gray-500">{description}</div>}
        </div>
      )}
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only peer"
        />
        <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 ${colorClasses[color]} rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
      </label>
    </div>
  );
};

export default Toggle;