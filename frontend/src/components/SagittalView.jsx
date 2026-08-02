import { useEffect, useRef } from 'react';
import { frameAt } from '../animation/timeline';

/**
 * Kid-friendly mid-sagittal ("inside the mouth") cross-section, styled after a
 * classic anatomy diagram: a soft head profile with nasal cavity, hard/soft
 * palate, teeth, lips, throat and a big friendly tongue. The tongue is driven
 * by the SAME playRef/timeline as the 3D avatar, so it moves in lock-step with
 * the lips and the spoken audio. Scoped to the S phoneme for now.
 */

// ── Tongue rig: fixed anchors + movable surface points (front → back) ──
// A thin muscle sitting up in the lips region (not a jaw-filling blob): the
// bottom edge is kept close to the top surface so the tongue reads as slim.
const FRONT_BOTTOM = { x: 72, y: 200 };
const BACK_ROOT = { x: 204, y: 204 };

// Neutral rest: thin tongue lying up between the lips.
const REST = [
  { x: 64, y: 182 }, // tip — up in the gap between the lips
  { x: 112, y: 186 }, // blade
  { x: 156, y: 189 }, // front
  { x: 196, y: 188 }, // dorsum
];

// S: tip lifts toward the alveolar ridge (~116,170), leaving a narrow channel
// for the air to hiss through — not a full closure.
const S = [
  { x: 108, y: 174 }, // tip
  { x: 150, y: 184 }, // blade
  { x: 184, y: 188 }, // front
  { x: 198, y: 189 }, // dorsum
];

const isS = (arpa) => String(arpa || '').toUpperCase() === 'S';
const tongueFor = (arpa) => (isS(arpa) ? S : REST);

const lerp = (a, b, w) => a + (b - a) * w;
const lerpPts = (from, to, w) =>
  from.map((p, i) => ({ x: lerp(p.x, to[i].x, w), y: lerp(p.y, to[i].y, w) }));

// Smooth closed path through points via a Catmull-Rom → cubic-bezier spline.
function smoothClosedPath(pts, tension = 1) {
  const n = pts.length;
  if (n < 3) return '';
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)} `;
  for (let i = 0; i < n; i += 1) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1x = p1.x + ((p2.x - p0.x) / 6) * tension;
    const c1y = p1.y + ((p2.y - p0.y) / 6) * tension;
    const c2x = p2.x - ((p3.x - p1.x) / 6) * tension;
    const c2y = p2.y - ((p3.y - p1.y) / 6) * tension;
    d += `C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)} `;
  }
  return `${d}Z`;
}

const tonguePath = (movable) => smoothClosedPath([FRONT_BOTTOM, ...movable, BACK_ROOT]);

export default function SagittalView({ playRef, currentArpa = 'sil' }) {
  const tongueRef = useRef(null);
  const airflowRef = useRef(null);
  const ridgeRef = useRef(null);

  useEffect(() => {
    let raf = 0;
    const render = () => {
      const st = playRef?.current;
      let pts = REST;
      let wS = 0;

      if (st && st.playing && st.timeline?.length) {
        const t = (performance.now() - st.startedAt) * (st.mapScale || st.speed || 1);
        const { frame, next, progress } = frameAt(st.timeline, t);
        // Hold the current posture, crossfade to the next only in the last 35%
        // — mirrors the avatar's viseme blending so the tongue reaches the S
        // shape and holds it while the sound sustains.
        const FADE = 0.35;
        if (next && progress > 1 - FADE) {
          const k = (progress - (1 - FADE)) / FADE;
          pts = lerpPts(tongueFor(frame?.arpa), tongueFor(next?.arpa), k);
          wS = (isS(frame?.arpa) ? 1 - k : 0) + (isS(next?.arpa) ? k : 0);
        } else {
          pts = tongueFor(frame?.arpa);
          wS = isS(frame?.arpa) ? 1 : 0;
        }
        wS = Math.max(0, Math.min(1, wS));
      }

      if (tongueRef.current) tongueRef.current.setAttribute('d', tonguePath(pts));
      if (airflowRef.current) airflowRef.current.setAttribute('opacity', (wS * 0.95).toFixed(2));
      if (ridgeRef.current) ridgeRef.current.setAttribute('opacity', (0.2 + wS * 0.8).toFixed(2));

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [playRef]);

  return (
    <div style={{ color: 'var(--text-primary)' }}>
      <svg viewBox="0 0 360 340" style={{ width: '75%', maxWidth: '300px', margin: '0 auto', display: 'block' }} role="img" aria-label="Cross-section of the mouth showing tongue position for S">
        <defs>
          <linearGradient id="tongueFill" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0" stopColor="#EF938E" />
            <stop offset="1" stopColor="#D66A66" />
          </linearGradient>
          <radialGradient id="fleshFill" cx="0.55" cy="0.4" r="0.8">
            <stop offset="0" stopColor="#F7C4B5" />
            <stop offset="1" stopColor="#EDA895" />
          </radialGradient>
        </defs>

        {/* ── Head / face profile (skin) ── */}
        <path
          d="M 168 16
             C 226 12, 286 34, 316 86
             C 338 124, 334 176, 320 210
             C 312 250, 312 292, 316 330
             L 190 330
             C 188 292, 184 260, 172 244
             C 140 248, 106 244, 90 220
             C 80 206, 82 192, 90 184
             C 76 178, 72 166, 82 158
             C 72 152, 70 140, 80 132
             C 64 126, 50 130, 48 120
             C 44 110, 58 96, 72 92
             C 90 84, 104 78, 112 62
             C 122 40, 138 20, 168 16 Z"
          fill="url(#fleshFill)" stroke="#CE7C6B" strokeWidth="2.5" strokeLinejoin="round"
        />

        {/* ── Air cavities (open space) ── */}
        {/* Nasal cavity */}
        <path
          d="M 86 158 C 106 128, 168 120, 214 140 C 220 148, 220 156, 216 162
             C 168 150, 108 152, 90 166 Z"
          fill="#FCF1EC" stroke="#E0A899" strokeWidth="1.5"
        />
        {/* Oral cavity + pharynx */}
        <path
          d="M 96 170
             C 150 160, 200 160, 224 168
             C 234 184, 232 204, 222 216
             C 236 228, 242 272, 240 322
             L 210 322
             C 212 272, 206 252, 196 246
             C 170 252, 130 252, 108 246
             C 96 240, 84 232, 82 216
             C 74 202, 74 188, 80 176
             L 96 170 Z"
          fill="#FCF1EC" stroke="#E0A899" strokeWidth="1.5"
        />

        {/* ── Hard palate (roof) ── */}
        <path
          d="M 94 168 C 150 156, 206 156, 220 166 C 222 170, 220 172, 216 171
             C 200 163, 150 162, 98 172 C 94 172, 92 170, 94 168 Z"
          fill="#F5E3D8" stroke="#DDB6A6" strokeWidth="1"
        />

        {/* ── Soft palate + uvula (back of the roof) ── */}
        <path
          d="M 218 164 C 234 170, 236 188, 228 200 C 224 204, 219 202, 219 196
             C 214 188, 212 174, 216 165 Z"
          fill="#E89AA0" stroke="#CE7C82" strokeWidth="1"
        />

        {/* ── Teeth ── */}
        <path d="M 86 170 L 104 170 L 104 188 C 104 193, 86 193, 86 188 Z" fill="#FFFFFF" stroke="#D9CAC1" strokeWidth="1" />
        <path d="M 86 210 L 104 210 L 104 194 C 104 189, 86 189, 86 194 Z" fill="#FFFFFF" stroke="#D9CAC1" strokeWidth="1" />

        {/* Alveolar ridge — the S target (brightens as the tongue reaches it) */}
        <circle ref={ridgeRef} cx="116" cy="170" r="6" fill="var(--signal)" opacity="0.2" />

        {/* ── Tongue (deformable) ── */}
        <path ref={tongueRef} d={tonguePath(REST)} fill="url(#tongueFill)" stroke="#BC524D" strokeWidth="2" strokeLinejoin="round" />

        {/* ── Lips ── */}
        <path d="M 84 152 C 66 150, 56 160, 62 170 C 70 176, 80 170, 88 164 Z" fill="#DE8E85" stroke="#C2685F" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M 88 190 C 74 190, 60 200, 68 212 C 80 220, 90 208, 94 198 Z" fill="#DE8E85" stroke="#C2685F" strokeWidth="1.5" strokeLinejoin="round" />

        {/* ── Airflow — the S hiss escaping over the tongue tip ── */}
        <path ref={airflowRef} d="M 124 178 C 100 180, 78 186, 56 194" fill="none" stroke="var(--signal)" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 7" opacity="0" />

        {/* ── Gentle labels ── */}
        <g fontFamily="var(--font-body, sans-serif)" fontSize="10" fontWeight="600" fill="#8A4B42">
          <g stroke="#B98B80" strokeWidth="1">
            <line x1="150" y1="134" x2="176" y2="120" />
            <line x1="192" y1="162" x2="250" y2="150" />
            <line x1="228" y1="188" x2="286" y2="196" />
            <line x1="100" y1="180" x2="40" y2="150" />
            <line x1="70" y1="182" x2="24" y2="210" />
          </g>
          <text x="120" y="116" textAnchor="middle">Nasal cavity</text>
          <text x="252" y="147" textAnchor="start">Hard palate</text>
          <text x="288" y="199" textAnchor="start">Soft palate</text>
          <text x="38" y="147" textAnchor="end">Teeth</text>
          <text x="22" y="214" textAnchor="end">Lips</text>
          <text x="168" y="224" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="700" style={{ pointerEvents: 'none' }}>Tongue</text>
        </g>
      </svg>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)', opacity: 0.8 }}>
          Inside the mouth
        </span>
        <span className="mono text-xs" style={{ color: 'var(--signal)' }}>▸ {currentArpa}</span>
      </div>
    </div>
  );
}
