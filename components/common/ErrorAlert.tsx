'use client';

import React, { useState } from 'react';
import { RefreshCw, ChevronDown, ChevronUp, WifiOff, Info } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onRetry?: () => void;
  isUsingFallback?: boolean;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onRetry, isUsingFallback }) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleRetry = async () => {
    if (!onRetry) return;
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setTimeout(() => setIsRetrying(false), 1500);
    }
  };

  return (
    <div className="bg-[#FEE2E2] border border-red-200 rounded-[16px] p-5 mb-6 shadow-xs animate-fadeIn">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="p-2.5 rounded-xl bg-white text-[#DC2626] shrink-0 border border-red-200">
          <WifiOff className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-semibold text-[#991B1B] mb-1">Connection Error</h4>
          <p className="text-sm text-[#991B1B] leading-[1.6] font-normal">{message}</p>

          {isUsingFallback && (
            <p className="text-xs text-[#92400E] mt-2.5 flex items-center gap-1.5 font-semibold bg-[#FEF3C7] px-3 py-1.5 rounded-lg border border-amber-200 w-fit">
              <Info className="w-4 h-4 shrink-0 text-[#F59E0B]" />
              Platform has engaged the Wrench Wise Offline Demonstration Dataset.
            </p>
          )}

          {/* Expandable technical details */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="mt-3 flex items-center gap-1 text-xs text-[#991B1B] hover:text-black transition-colors font-semibold"
          >
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            Technical Details
          </button>

          {showDetails && (
            <div className="mt-2 p-3 bg-white border border-red-200 rounded-xl text-xs text-[#374151] space-y-1 font-mono animate-fadeIn">
              <p>• Source: Zoho Sheet CSV API</p>
              <p>• Error: {message}</p>
              <p>• Timestamp: {new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
              <p className="pt-1 font-sans text-[#6B7280]">
                <strong>Troubleshooting:</strong> Check your internet connection or Zoho Sheet access permissions.
              </p>
            </div>
          )}
        </div>

        {/* Danger button (#DC2626) */}
        {onRetry && (
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="btn-danger flex items-center gap-1.5 disabled:opacity-50 shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
            {isRetrying ? 'Retrying...' : 'Retry'}
          </button>
        )}
      </div>
    </div>
  );
};
