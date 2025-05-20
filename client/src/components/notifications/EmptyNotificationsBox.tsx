import React from 'react';
import { BellIcon } from 'lucide-react';

export function EmptyNotificationsBox() {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
      <div className="h-12 w-12 rounded-full flex items-center justify-center bg-purple-500/20 text-purple-400 mb-2">
        <BellIcon className="h-6 w-6" />
      </div>
      
      <h3 className="text-lg font-orbitron text-purple-300">No Notifications</h3>
      
      <p className="text-gray-400 text-sm max-w-[280px]">
        Silence is signal. You have no new notifications right now.
      </p>
      
      <p className="text-gray-500 text-xs max-w-[280px] italic">
        Stay present. When the time comes, you'll be notified.
      </p>
    </div>
  );
}