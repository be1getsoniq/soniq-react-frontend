import React from "react";

export default function BottomNav() {
  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-50
        px-6 py-3
        rounded-t-2xl
        bg-black/70 text-white
        backdrop-blur-md
        flex items-center justify-around
        [padding-bottom:calc(env(safe-area-inset-bottom)+0.5rem)]
      "
    >
      <button className="text-sm">Music</button>
      <button className="text-sm font-semibold text-amber-400">For You</button>
      <button className="text-sm">Settings</button>
    </nav>
  );
}
