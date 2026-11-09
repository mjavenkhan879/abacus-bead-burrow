import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Shield } from 'lucide-react-native';
import AssetIcon from '../components/AssetIcon';
import { MAX_NUMBER } from '../constants/config';
import theme from '../constants/theme';
import { PANTRY_ROOMS, roomFill } from '../game/counting';
import { rangeForLevel } from '../game/levels';
import ClayButton from '../components/ClayButton';
import ClayToggle from '../components/ClayToggle';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader from '../components/ScreenHeader';
import SegmentedChips from '../components/SegmentedChips';

export type Settings = {
  countBubbles: boolean;
  celebrations: boolean;
  language: string;
};

type Props = {
  settings: Settings;
  onSettings: (next: Settings) => void;
  mastered: number[];
  sessions: number;
  level: number;
  onBack: () => void;
};

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

function RangeBar({
  label,
  filled,
  capacity,
}: {
  label: string;
  filled: number;
  capacity: number;
}) {
  const pct = Math.round((filled / capacity) * 100);
  return (
    <View style={styles.rangeRow}>
      <Text style={styles.rangeLabel}>{label}</Text>
      <View style={styles.rangeTrack}>
        <View style={[styles.rangeFill, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.rangeValue}>
        {filled}/{capacity}
      </Text>
    </View>
  );
}

/** Reached only through the 3s hold gate on the menu. */
export default function GrownUpCornerScreen({
  settings,
  onSettings,
  mastered,
  sessions,
  level,
  onBack,
}: Props) {
  const range = rangeForLevel(level);

  return (
    <ScreenBackground variant="plain">
      <ScreenHeader
        title="GROWN-UP CORNER"
        subtitle="FOR PARENTS"
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
            <Shield size={24} color={theme.colors.primary} strokeWidth={2.4} />
          </View>
        }
      />

      <View style={styles.body}>
        <View style={styles.card}>
          <View pointerEvents="none" style={styles.highlight} />
          <Text style={styles.cardTitle}>PROGRESS</Text>
          {PANTRY_ROOMS.map(room => (
            <RangeBar
              key={room.label}
              label={room.label}
              filled={roomFill(mastered, room.index)}
              capacity={room.capacity}
            />
          ))}
          <View style={styles.metaRow}>
            <Text style={styles.meta}>SESSIONS PLAYED {sessions}</Text>
            <Text style={styles.meta}>
              RANGE {range[0]}-{range[1]}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <View pointerEvents="none" style={styles.highlight} />
          <Text style={styles.cardTitle}>OPTIONS</Text>

          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>COUNT BUBBLES</Text>
            <ClayToggle
              value={settings.countBubbles}
              label="COUNT BUBBLES"
              onChange={next => onSettings({ ...settings, countBubbles: next })}
            />
          </View>

          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>CELEBRATIONS</Text>
            <ClayToggle
              value={settings.celebrations}
              label="CELEBRATIONS"
              onChange={next => onSettings({ ...settings, celebrations: next })}
            />
          </View>

          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>LANGUAGE</Text>
            <SegmentedChips
              options={['EN', 'ES']}
              value={settings.language}
              onChange={next => onSettings({ ...settings, language: next })}
            />
          </View>
        </View>

        <View style={styles.privacy}>
          <AssetIcon name="sticker" style={styles.privacyIcon} />
          <Text style={styles.privacyText}>
            NO ADS . NO PURCHASES . NO DATA COLLECTED . NO EXTERNAL LINKS .{' '}
            {MAX_NUMBER} NUMBERS ONLY
          </Text>
        </View>

        <ClayButton
          title="BACK TO BURROW"
          variant="primary"
          gradient={[...theme.gradients.greenShort]}
          onPress={onBack}
        />
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
    gap: 14,
    justifyContent: 'flex-start',
  },
  card: {
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.border,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 14,
    shadowColor: '#2D3A23',
    shadowOpacity: 0.14,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 7,
  },
  highlight: {
    position: 'absolute',
    top: 3,
    left: 16,
    right: 16,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  cardTitle: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 2,
    color: theme.colors.textMuted,
    marginBottom: 10,
  },
  rangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  rangeLabel: {
    width: 44,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    color: theme.colors.text,
  },
  rangeTrack: {
    flex: 1,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.bgDeep,
    overflow: 'hidden',
  },
  rangeFill: {
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
  },
  rangeValue: {
    width: 44,
    textAlign: 'right',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '900',
    color: theme.colors.primary,
  },
  metaRow: {
    marginTop: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  meta: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.textSecondary,
  },
  optionRow: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  optionLabel: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: theme.colors.text,
  },
  privacy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 2,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  privacyIcon: { width: 28, height: 28 },
  privacyText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
    letterSpacing: 0.4,
    color: theme.colors.textSecondary,
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
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
});
