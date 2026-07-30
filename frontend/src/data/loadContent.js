import content from '../../../contracts/content.json';
import phonemes from '../../../contracts/phonemes.json';

export const TARGETS = content.targets;
export const PHONEMES = phonemes.phonemes;
export const CONFUSIONS = phonemes.confusions;
export const LOOK_ALIKE = phonemes.look_alike_groups;

export function getTarget(id) {
  return TARGETS.find((t) => t.id === id) || null;
}

export function getItems(targetId, level) {
  const t = getTarget(targetId);
  return t ? t.levels[level] || [] : [];
}

export function phonemeInfo(symbol) {
  return PHONEMES[symbol] || { ipa: '', label: symbol, viseme: 'viseme_sil', cue: '' };
}

/** Which look-alike group, if any, this phoneme sits in. Used in the UI. */
export function lookAlikeNote(symbol) {
  const g = LOOK_ALIKE.find((x) => x.visually_identical.includes(symbol));
  return g ? g.note : null;
}