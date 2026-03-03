import React from "react";

export default function LoadingFallback() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-sand-50">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner using brand teal color */}
        <div className="w-10 h-10 rounded-full border-4 border-teal-100 border-t-teal-600 animate-spin" />
        <p className="font-sans text-xs text-teal-500 tracking-widest uppercase">
          Loading…
        </p>
      </div>
    </div>
  );
}
