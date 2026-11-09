/**
 * AbacusBeadBurrow — theme.
 * Preset: WARM_EARTHY (design-system/preset.ts) with the brief's garden accents
 * overridden. The `name` field stays exactly as the preset ships it.
 */

export const theme = {
  name: 'warm-earthy',

  colors: {
    // backgrounds
    bg: '#E9F5DB',
    bgDeep: '#CFE1B9',
    bgDark: '#B9D29C',
    loaderA: '#2D3A23',
    loaderB: '#3B2E22',
    loaderC: '#22301B',

    // clay surfaces
    surface: '#FFFFFF',
    surfaceAlt: '#F6FBEE',
    surfaceWarm: '#FFF4EC',

    // borders
    border: '#CFE1B9',
    borderStrong: '#B9D29C',
    borderWarm: '#F4C8B4',

    // brand
    primary: '#6A994E',
    primaryDark: '#4F7A38',
    primaryLight: '#7FB45C',
    accent: '#F4845F',
    accentDark: '#D9603C',
    gold: '#F2C14E',
    violet: '#A974C4',
    sky: '#4A90C4',

    // text
    text: '#2D3A23',
    textSecondary: '#5A6B4A',
    textMuted: '#8AA07A',
    onPrimary: '#FFFFFF',

    // props
    wood: '#C8B18A',
    woodDark: '#A88460',
    disabled: '#E4D9C8',
  },

  beads: ['#E8584E', '#F4A93D', '#6A994E', '#4A90C4', '#A974C4'],

  gradients: {
    loader: ['#2D3A23', '#3B2E22', '#22301B'],
    menuOverlay: [
      'rgba(233,245,219,0.88)',
      'rgba(207,225,185,0.78)',
      'rgba(185,210,156,0.86)',
    ],
    gameOverlay: ['rgba(233,245,219,0.92)', 'rgba(207,225,185,0.84)'],
    winOverlay: [
      'rgba(246,251,238,0.94)',
      'rgba(233,245,219,0.90)',
      'rgba(207,225,185,0.92)',
    ],
    plainOverlay: ['rgba(246,251,238,0.93)', 'rgba(207,225,185,0.88)'],
    green: ['#7FB45C', '#6A994E', '#4F7A38'],
    greenShort: ['#7FB45C', '#4F7A38'],
    carrot: ['#F4845F', '#D9603C'],
    progress: ['#6A994E', '#F4845F'],
  },

  typography: {
    hero: { fontSize: 40, fontWeight: '900' as const, letterSpacing: 2 },
    title: { fontSize: 24, fontWeight: '900' as const, letterSpacing: 1 },
    numeral: {
      fontSize: 22,
      fontWeight: '900' as const,
      letterSpacing: 0.5,
    },
    body: { fontSize: 15, fontWeight: '800' as const, letterSpacing: 0.3 },
    bodySoft: { fontSize: 14, fontWeight: '700' as const, letterSpacing: 0.3 },
    caption: {
      fontSize: 11,
      fontWeight: '700' as const,
      letterSpacing: 1.5,
    },
  },

  radius: { sm: 12, md: 20, lg: 24, xl: 28, xxl: 32, full: 999 },

  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },

  shadows: {
    clay: {
      shadowColor: '#2D3A23',
      shadowOpacity: 0.16,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 9,
    },
    clayDeep: {
      shadowColor: '#2D3A23',
      shadowOpacity: 0.22,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: 12 },
      elevation: 13,
    },
    green: {
      shadowColor: '#4F7A38',
      shadowOpacity: 0.45,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: 12 },
      elevation: 12,
    },
    carrot: {
      shadowColor: '#D9603C',
      shadowOpacity: 0.45,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 11,
    },
    soft: {
      shadowColor: '#2D3A23',
      shadowOpacity: 0.12,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 5 },
      elevation: 5,
    },
  },

  animation: {
    button: { tension: 300, friction: 12 },
    pop: { tension: 150, friction: 7 },
    hero: { tension: 60, friction: 7 },
  },
} as const;

export type Theme = typeof theme;
export default theme;
