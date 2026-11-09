import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import AssetIcon from '../components/AssetIcon';
import { MAX_NUMBER, PANTRY_GAP } from '../constants/config';
import theme from '../constants/theme';
import ClayButton from '../components/ClayButton';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader from '../components/ScreenHeader';
import StickerBadge from '../components/StickerBadge';

type Props = {
  mastered: number[];
  onBack: () => void;
};

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

const NUMBERS: number[] = [];
for (let i = 1; i <= MAX_NUMBER; i += 1) {
  NUMBERS.push(i);
}

/** Fixed 4x5 block — no ScrollView wrapper (rule #3). */
export default function StickerPantryScreen({ mastered, onBack }: Props) {
  return (
    <ScreenBackground variant="plain">
      <ScreenHeader
        title="STICKER PANTRY"
        subtitle="ONE STICKER PER NUMBER"
        leftSlot={
          <Pressable
            onPress={onBack}
            hitSlop={HIT_SLOP}
            accessibilityRole="button"
            accessibilityLabel="BACK TO BURROW"
            style={styles.iconButton}>
            <AssetIcon name="home" style={styles.iconImage} />
          </Pressable>
        }
        rightSlot={
          <View style={styles.badge}>
            <AssetIcon name="sticker" style={styles.badgeIcon} />
            <Text style={styles.badgeValue}>{mastered.length}</Text>
          </View>
        }
      />

      <View style={styles.body}>
        <View style={styles.grid}>
          {NUMBERS.map((n, i) => (
            <StickerBadge
              key={`sticker-${n}`}
              number={n}
              index={i}
              earned={mastered.indexOf(n) >= 0}
            />
          ))}
        </View>

        <View style={styles.footer}>
          <View style={styles.footerPill}>
            <AssetIcon name="carrot" style={styles.footerIcon} />
            <Text style={styles.footerText}>
              {mastered.length} OF {MAX_NUMBER} NUMBERS LEARNED
            </Text>
          </View>
          <ClayButton
            title="BACK TO BURROW"
            variant="primary"
            gradient={[...theme.gradients.greenShort]}
            onPress={onBack}
          />
        </View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: PANTRY_GAP,
    justifyContent: 'flex-start',
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: { width: 24, height: 24 },
  badge: {
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.gold,
  },
  badgeIcon: { width: 24, height: 24 },
  badgeValue: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '900',
    color: theme.colors.gold,
  },
  footer: { gap: 12 },
  footerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  footerIcon: { width: 24, height: 24 },
  footerText: {
    fontSize: 13,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: theme.colors.textSecondary,
  },
});
