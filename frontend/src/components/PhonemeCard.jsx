import { phonemeInfo, lookAlikeNote } from '../data/loadContent';

export default function PhonemeCard({ symbol, text, level, recording, micLevel = 0 }) {
  const info = phonemeInfo(symbol);
  const note = lookAlikeNote(symbol);
  const display = level === 'sound' ? info.label : text;

  return (
    <div className="card p-8">
      <div className="flex items-baseline gap-4">
        <span className="glyph">{display}</span>
        <span className="mono text-muted text-lg">{info.ipa}</span>
        <span className="ml-auto text-xs uppercase tracking-widest text-muted">
          {info.place}
        </span>
      </div>

      {/* live level bar — the one animated thing on this screen */}
      <div className="mt-6 h-1.5 w-full bg-line rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-75"
          style={{
            width: recording ? `${Math.round(micLevel * 100)}%` : '0%',
            background: 'var(--signal)',
          }}
        />
      </div>

      <p className="mt-6 text-ink/90 leading-relaxed">{info.cue}</p>

      {note && (
        <p className="mt-4 text-sm text-muted border-l-2 border-line pl-3">{note}</p>
      )}
    </div>
  );
}
