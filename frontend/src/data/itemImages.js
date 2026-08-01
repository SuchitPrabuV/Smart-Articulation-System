// Emoji "pictures" for practice items, to make sessions more visual and
// engaging for young learners. Keyed by the item ids in contracts/content.json.
const ITEM_IMAGES = {
  // ── S ──────────────────────────────────────────────
  's-snd-1': '🐍', // S — the snake's hiss
  's-wrd-1': '☀️', // sun
  's-wrd-2': '🧦', // sock
  's-wrd-3': '🚌', // bus
  's-wrd-4': '✏️', // pencil
  's-sen-1': '☀️', // The sun is hot.
  's-sen-2': '🚌', // I see a bus.

  // ── R ──────────────────────────────────────────────
  'r-snd-1': '🐯', // R — the tiger's growl
  'r-wrd-1': '🌧️', // rain
  'r-wrd-2': '🔴', // red
  'r-wrd-3': '🚗', // car
  'r-wrd-4': '🥕', // carrot
  'r-sen-1': '🚗', // The red car is fast.
  'r-sen-2': '🌧️', // Rain is coming.

  // ── TH ─────────────────────────────────────────────
  'th-snd-1': '👅', // TH — tongue between the teeth
  'th-wrd-1': '👍', // thumb
  'th-wrd-2': '🤔', // think
  'th-wrd-3': '🛁', // bath
  'th-wrd-4': '🎂', // birthday
  'th-sen-1': '🤔', // I think it is thick.
  'th-sen-2': '🛁', // Thank you for the bath.
};

export function imageForItem(item) {
  if (!item || !item.id) return null;
  return ITEM_IMAGES[item.id] || null;
}
