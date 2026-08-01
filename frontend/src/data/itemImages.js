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

  // ── T ──────────────────────────────────────────────
  't-snd-1': '🌮', // T — taco
  't-wrd-1': '🧸', // toy
  't-wrd-2': '🐢', // turtle
  't-wrd-3': '🐱', // cat
  't-wrd-4': '💧', // water
  't-sen-1': '🐢', // The cat sees a turtle.
  't-sen-2': '🧸', // Take the toy.

  // ── D ──────────────────────────────────────────────
  'd-snd-1': '🦕', // D — dinosaur
  'd-wrd-1': '🐶', // dog
  'd-wrd-2': '🦆', // duck
  'd-wrd-3': '🛏️', // bed
  'd-wrd-4': '🪜', // ladder
  'd-sen-1': '🐶', // The dog and duck play.
  'd-sen-2': '🛏️', // Dad is in bed.

  // ── K ──────────────────────────────────────────────
  'k-snd-1': '🦘', // K — kangaroo
  'k-wrd-1': '🔑', // key
  'k-wrd-2': '🍰', // cake
  'k-wrd-3': '📖', // book
  'k-wrd-4': '🐒', // monkey
  'k-sen-1': '🍰', // I like the cake.
  'k-sen-2': '🐒', // The monkey has a key.

  // ── G ──────────────────────────────────────────────
  'g-snd-1': '🦍', // G — gorilla
  'g-wrd-1': '🐐', // goat
  'g-wrd-2': '👧', // girl
  'g-wrd-3': '🐶', // dog
  'g-wrd-4': '🛒', // wagon
  'g-sen-1': '🐐', // The goat is big.
  'g-sen-2': '👧', // The girl has a dog.
};

export function imageForItem(item) {
  if (!item || !item.id) return null;
  return ITEM_IMAGES[item.id] || null;
}
