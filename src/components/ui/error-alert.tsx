import React from "react";

export function ErrorAlert({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss?: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
      <div className="flex items-center gap-2">
        <span className="font-bold text-rose-600">!</span>
        <span>{message}</span>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-rose-500 hover:text-rose-700 text-xs font-semibold"
        >
          Dismiss
        </button>
      )}
    </div>
  );
}
