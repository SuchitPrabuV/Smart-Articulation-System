import { phonemeInfo } from '../data/loadContent';

export default function ClipFallback({ phoneme }) {
  const info = phonemeInfo(phoneme);
  const src = `/clips/${String(phoneme || 'sil').toLowerCase()}.mp4`;

  return (
    <div>
      <div className="aspect-video rounded-[10px] overflow-hidden bg-paper border border-line grid place-items-center">
        <video
          key={src}
          src={src}
          controls
          playsInline
          muted
          className="w-full h-full object-contain"
          onError={(event) => {
            event.currentTarget.style.display = 'none';
          }}
        />
      </div>
      <p className="mt-3 mono text-xs text-muted">
        {info.ipa} · {info.place}
      </p>
    </div>
  );
}
