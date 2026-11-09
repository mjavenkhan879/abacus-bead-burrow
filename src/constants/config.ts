import { Dimensions } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export { SCREEN_W, SCREEN_H };

/** Splash length. EXACTLY 8000 — shorter races the screenshot gate. */
export const LOADER_DURATION_MS = 8000;

export const ROUNDS_PER_SESSION = 5;
export const BEADS_PER_WIRE = 5;
export const TENS_BEADS = 2;

export const BEAD_SNAP_MS = 120;
export const CARROT_POP_MS = 180;
export const EAR_TWITCH_MS = 220;
export const CELEBRATION_MS = 2600;
export const CELEBRATION_SHORT_MS = 900;
export const RECOUNT_STEP_MS = 320;
export const WELLDONE_MS = 2900;
export const SONG_STEP_MS = 1400;
export const PARENT_GATE_MS = 3000;
export const FADE_MS = 320;

export const STREAK_UP = 3;
export const STRUGGLE_DOWN = 2;
export const MAX_NUMBER = 20;

/** Board geometry — rule #4/#5: the frame is padding + border. */
export const BOARD_PAD = 8;
export const BOARD_BORDER = 2;
export const BOARD_FRAME = BOARD_PAD + BOARD_BORDER; // 10
export const BOARD_MAX_W = Math.min(SCREEN_W - 32, 380);
export const BEAD = Math.min(
  72,
  Math.floor((BOARD_MAX_W - 2 * BOARD_FRAME) / BEADS_PER_WIRE),
);
export const BOARD_INNER_W = BEAD * BEADS_PER_WIRE;
export const BOARD_W = BOARD_INNER_W + 2 * BOARD_FRAME;
export const SMALL_SCREEN = SCREEN_H < 820;
export const WIRE_ROW_H = BEAD + (SMALL_SCREEN ? 12 : 18);
export const WIRE_GAP = SMALL_SCREEN ? 6 : 10;
export const REQUEST_H = SMALL_SCREEN ? 92 : 104;
export const TRAY_H = SMALL_SCREEN ? 76 : 86;
export const BEAD_SIZE = BEAD - 8;

/** Carrot tray + request card sizing. */
export const CARROT_SIZE = 24;
export const REQUEST_MAX_PICS = 10;
export const REQUEST_PIC = 18;

/** Sticker pantry grid (4 columns, 20 tiles). */
export const PANTRY_COLS = 4;
export const PANTRY_GAP = 10;
export const PANTRY_TILE = Math.floor(
  (SCREEN_W - 32 - (PANTRY_COLS - 1) * PANTRY_GAP) / PANTRY_COLS,
);

export const NUMBER_WORDS = [
  'ZERO',
  'ONE',
  'TWO',
  'THREE',
  'FOUR',
  'FIVE',
  'SIX',
  'SEVEN',
  'EIGHT',
  'NINE',
  'TEN',
];
