import React from 'react';

/** Renders narrative + optional stats footnote (`\n\n` split) and provider note. */
export function SummaryBlurb({ text, note }: { text: string; note?: string }) {
  const parts = text.split('\n\n').filter(Boolean);
  const main = parts[0] ?? text;
  const foot = parts.slice(1).join('\n\n');
  return (
    <div>
      <p className="text-sm text-gray-700 leading-relaxed">{main}</p>
      {foot ? <p className="text-xs text-gray-500 mt-2">{foot}</p> : null}
      {note ? <p className="text-xs text-amber-800/90 mt-2">{note}</p> : null}
    </div>
  );
}
