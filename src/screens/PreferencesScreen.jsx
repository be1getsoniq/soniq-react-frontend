import React, { useState } from 'react';
import PreferenceOption from '../components/PreferencesOption';

export default function PreferencesScreen() {
  const [selected, setSelected] = useState('Trending');

  const options = ['New & Familiar', 'House & Umbrella', 'Trending', 'Time Machine', 'India'];

  return (
    <div className="h-screen w-full bg-gradient-dark text-white p-6">
      <h1 className="text-center text-2xl font-semibold mb-8">Select Your Preference</h1>

      <div className="space-y-4">
        {options.map((option) => (
          <PreferenceOption
            key={option}
            label={option}
            selected={selected === option}
            onClick={() => setSelected(option)}
          />
        ))}
      </div>
    </div>
  );
}
