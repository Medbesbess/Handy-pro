// DeactivationTicker.jsx
import React from 'react';
import { AlertTriangle } from 'lucide-react';

const DeactivationTicker = () => {
  const isAvailable = localStorage.getItem("isAvailable") === "true";

  // Don't render anything if the account is available
  if (isAvailable) return null;

  return (
    <div className="bg-yellow-50 border-y border-yellow-100">
      <div className="relative overflow-hidden h-10">
        <div className="absolute whitespace-nowrap animate-marquee flex items-center h-full">
          <div className="flex items-center px-4 gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="text-yellow-800">
              Your account is currently deactivated pending verification of your documents.
              This process may take up to 24 hours. Please check your email for updates.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeactivationTicker;