import { phonemeInfo } from '../data/loadContent.js';

const ARPA_TO_VISEME = {
  P: 'viseme_PP',
  B: 'viseme_PP',
  M: 'viseme_PP',
  T: 'viseme_DD',
  D: 'viseme_DD',
  K: 'viseme_KK',
  G: 'viseme_KK',
  NG: 'viseme_nn',
  F: 'viseme_FF',
  V: 'viseme_FF',
  TH: 'viseme_TH',
  DH: 'viseme_TH',
  S: 'viseme_SS',
  Z: 'viseme_SS',
  SH: 'viseme_CH',
  ZH: 'viseme_CH',
  CH: 'viseme_CH',
  JH: 'viseme_CH',
  HH: 'viseme_sil',
  R: 'viseme_RR',
  ER: 'viseme_RR',
  L: 'viseme_nn',
  N: 'viseme_nn',
  W: 'viseme_U',
  Y: 'viseme_I',
  AA: 'viseme_aa',
  AE: 'viseme_aa',
  AH: 'viseme_aa',
  AY: 'viseme_aa',
  AW: 'viseme_aa',
  EH: 'viseme_E',
  EY: 'viseme_E',
  IH: 'viseme_I',
  IY: 'viseme_I',
  AO: 'viseme_O',
  OW: 'viseme_O',
  OY: 'viseme_O',
  UH: 'viseme_U',
  UW: 'viseme_U'
};

export const NEUTRAL = 'viseme_sil';
export const ALL_VISEMES = [
  'viseme_sil',
  'viseme_PP',
  'viseme_FF',
  'viseme_TH',
  'viseme_DD',
  'viseme_KK',
  'viseme_CH',
  'viseme_SS',
  'viseme_nn',
  'viseme_RR',
  'viseme_aa',
  'viseme_E',
  'viseme_I',
  'viseme_O',
  'viseme_U'
];

export const ROCKETBOX_VISEME_MAP = Object.freeze({
  viseme_sil: 'AA_VI_00_Sil',
  viseme_PP: 'AA_VI_01_PP',
  viseme_FF: 'AA_VI_02_FF',
  viseme_TH: 'AA_VI_03_TH',
  viseme_DD: 'AA_VI_04_DD',
  viseme_KK: 'AA_VI_05_KK',
  viseme_CH: 'AA_VI_06_CH',
  viseme_SS: 'AA_VI_07_SS',
  viseme_nn: 'AA_VI_08_nn',
  viseme_RR: 'AA_VI_09_RR',
  viseme_aa: 'AA_VI_10_aa',
  viseme_E: 'AA_VI_11_E',
  viseme_I: 'AA_VI_12_I',
  viseme_O: 'AA_VI_13_O',
  viseme_U: 'AA_VI_14_U'
});

export function rocketboxMorphTargetForViseme(viseme) {
  return ROCKETBOX_VISEME_MAP[viseme] || viseme;
}

export function visemeFor(arpa) {
  if (!arpa) return NEUTRAL;
  const key = String(arpa).toUpperCase();
  return ARPA_TO_VISEME[key] || NEUTRAL;
}

export function phonemeLabel(arpa) {
  return phonemeInfo(arpa)?.label || String(arpa || '');
}
