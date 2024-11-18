// components/serviceProvider/DeactivationNotice.jsx
import React from 'react';
import { AlertTriangle } from 'lucide-react';

const DeactivationNotice = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
              <h3 className="text-xl font-semibold text-gray-900">
                Account Verification Required
              </h3>
            </div>

            <div className="mt-3 text-gray-600">
              <p className="mb-4">
                Your account is currently deactivated pending verification of your documents.
                This process may take up to 24 hours.
              </p>
              <p>
                Please feel free to check your email, as we will notify you of your
                account status as soon as the verification is complete.
              </p>
            </div>

            <div className="mt-6">
              <button
                type="button"
                className="w-full rounded-md bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                onClick={onClose}
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeactivationNotice;