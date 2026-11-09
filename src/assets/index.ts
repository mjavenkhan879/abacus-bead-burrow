/**
 * Only the launcher art survived asset generation, so it is the single
 * bitmap in the bundle. Every other sprite is drawn as a vector by
 * src/components/AssetIcon.tsx — do not add a require for a file that
 * does not exist in assets/.
 */
export const assets = {
  logo: require('../../assets/icon_1024.png'),
} as const;

export default assets;
