import React from 'react';

export default function PreferenceOption({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl text-lg font-semibold transition-all
        ${selected ? 'bg-white text-black' : 'bg-black/40 text-white'} 
        hover:bg-white hover:text-black`}
    >
      <span>{label}</span>
      <span>{selected ? '✓' : ''}</span>
    </button>
  );
}
