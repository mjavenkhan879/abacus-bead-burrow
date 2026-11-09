import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Eraser, RotateCcw } from 'lucide-react-native';
import AssetIcon, { AssetIconName } from '../components/AssetIcon';
import {
  BOARD_BORDER,
  BOARD_INNER_W,
  BOARD_PAD,
  BOARD_W,
  BEAD,
  BEAD_SIZE,
  CELEBRATION_MS,
  CELEBRATION_SHORT_MS,
  RECOUNT_STEP_MS,
  ROUNDS_PER_SESSION,
  WIRE_GAP,
  WIRE_ROW_H,
} from '../constants/config';
import theme from '../constants/theme';
import { checkAnswer, generateRound, Round } from '../game/counting';
import { GameMode } from '../game/levels';
import useBeadBoard from '../hooks/useBeadBoard';
import BeadWire from '../components/BeadWire';
import BurrowDoorButton from '../components/BurrowDoorButton';
import CarrotTray from '../components/CarrotTray';
import CelebrationStars from '../components/CelebrationStars';
import ClayButton from '../components/ClayButton';
import NumberBubble from '../components/NumberBubble';
import ProgressDots from '../components/ProgressDots';
import RabbitRequest from '../components/RabbitRequest';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader from '../components/ScreenHeader';
import StatPill from '../components/StatPill';

export type SessionResult = {
  correct: number;
  sessionCarrots: number;
  rounds: number;
};

type Props = {
  mode: GameMode;
  level: number;
  easier: boolean;
  onCorrectRound: (firstTry: boolean) => void;
  onRecountRound: () => void;
  stars: number;
  countBubbles: boolean;
  celebrations: boolean;
  onCarrots: (n: number) => void;
  onStar: () => void;
  onMastered: (n: number) => void;
  onStreak: (streak: number) => void;
  onHome: () => void;
  onGameOver: (result: SessionResult) => void;
};

type Phase = 'idle' | 'correct' | 'recount';
type Highlight = { wire: number; bead: number } | null;

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

function IconButton({
  name,
  label,
  onPress,
}: {
  name: AssetIconName;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={styles.iconButton}>
      <AssetIcon name={name} style={styles.iconImage} />
    </Pressable>
  );
}

/** G3 Split Panel: wires take the flex area, the controls sit in a raised deck. */
export default function BeadWireScreen({
  mode,
  level,
  easier,
  onCorrectRound,
  onRecountRound,
  stars,
  countBubbles,
  celebrations,
  onCarrots,
  onStar,
  onMastered,
  onStreak,
  onHome,
  onGameOver,
}: Props) {
  const board = useBeadBoard(level, mode);
  const { wires, groups, counted, setWire, undo, clear } = board;

  const levelRef = useRef(level);
  const easierRef = useRef(easier);
  const firstTry = useRef(true);
  const lastTarget = useRef(0);
  const streak = useRef(0);
  const correctCount = useRef(0);
  const carrotCount = useRef(0);
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  const [roundIndex, setRoundIndex] = useState(1);
  const [round, setRound] = useState<Round>(() => {
    const first = generateRound(1, 1, 0, mode, false);
    lastTarget.current = first.target;
    return first;
  });
  const [phase, setPhase] = useState<Phase>('idle');
  const [paused, setPaused] = useState(false);
  const [highlight, setHighlight] = useState<Highlight>(null);
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [shakeKey, setShakeKey] = useState(0);
  const [twitchKey, setTwitchKey] = useState(0);
  const [bubbleTrigger, setBubbleTrigger] = useState(0);

  useEffect(() => {
    levelRef.current = level;
  }, [level]);

  useEffect(() => {
    easierRef.current = easier;
  }, [easier]);

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      timers.current.length = 0;
    },
    [],
  );

  const later = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      const at = timers.current.indexOf(id);
      if (at >= 0) {
        timers.current.splice(at, 1);
      }
      fn();
    }, ms);
    timers.current.push(id);
    return id;
  }, []);

  // Every counted bead pops the running total and twitches the rabbit's ears.
  const prevCounted = useRef(0);
  useEffect(() => {
    if (counted === prevCounted.current) {
      return;
    }
    prevCounted.current = counted;
    setTwitchKey(k => k + 1);
    if (counted > 0) {
      setBubbleTrigger(t => t + 1);
    }
  }, [counted]);

  const startRound = useCallback(
    (nextIndex: number) => {
      const next = generateRound(
        levelRef.current,
        nextIndex,
        lastTarget.current,
        mode,
        easierRef.current,
      );
      lastTarget.current = next.target;
      firstTry.current = true;
      prevCounted.current = 0;
      clear();
      setRound(next);
      setRoundIndex(nextIndex);
      setMessage(undefined);
      setHighlight(null);
      setPhase('idle');
    },
    [clear, mode],
  );

  const runRecount = useCallback(() => {
    const steps: Array<{ wire: number; bead: number }> = [];
    groups.forEach((value, wireIdx) => {
      for (let i = 0; i < value && steps.length < 10; i += 1) {
        steps.push({ wire: wireIdx, bead: i });
      }
    });

    steps.forEach((step, i) => {
      later(() => setHighlight(step), i * RECOUNT_STEP_MS);
    });

    later(() => {
      setHighlight(null);
      setPhase('idle');
      setMessage(undefined);
    }, steps.length * RECOUNT_STEP_MS + 420);
  }, [groups, later]);

  const handleCheck = useCallback(() => {
    if (mode === 'free') {
      onHome();
      return;
    }
    if (phase !== 'idle' || paused || counted === 0) {
      return;
    }

    const result = checkAnswer(counted, groups, round);

    if (!result.ok) {
      firstTry.current = false;
      streak.current = 0;
      setPhase('recount');
      setShakeKey(k => k + 1);
      setMessage('LET US COUNT AGAIN');
      onRecountRound();
      runRecount();
      return;
    }

    setPhase('correct');
    setMessage('WONDERFUL!');
    setTwitchKey(k => k + 1);

    if (firstTry.current) {
      streak.current += 1;
      onStreak(streak.current);
    } else {
      streak.current = 0;
    }
    onCorrectRound(firstTry.current);
    onCarrots(round.target);
    onStar();
    onMastered(round.target);
    correctCount.current += 1;
    carrotCount.current += round.target;

    const wait = celebrations ? CELEBRATION_MS : CELEBRATION_SHORT_MS;
    later(() => {
      if (roundIndex >= ROUNDS_PER_SESSION) {
        onGameOver({
          correct: correctCount.current,
          sessionCarrots: carrotCount.current,
          rounds: ROUNDS_PER_SESSION,
        });
      } else {
        startRound(roundIndex + 1);
      }
    }, wait);
  }, [
    celebrations,
    counted,
    groups,
    later,
    mode,
    onCarrots,
    onCorrectRound,
    onGameOver,
    onHome,
    onMastered,
    onRecountRound,
    onStar,
    onStreak,
    paused,
    phase,
    round,
    roundIndex,
    runRecount,
    startRound,
  ]);

  const boardHeight =
    2 * BOARD_PAD +
    wires.length * WIRE_ROW_H +
    Math.max(0, wires.length - 1) * WIRE_GAP;

  const isFree = mode === 'free';
  const ctaLabel = isFree ? 'BACK TO BURROW' : 'OPEN THE BURROW';
  const ctaEnabled = isFree || counted > 0;
  const locked = phase !== 'idle' || paused;

  return (
    <ScreenBackground variant="game">
      <ScreenHeader
        title={isFree ? 'FREE BEADS' : `ROUND ${roundIndex}/${ROUNDS_PER_SESSION}`}
        leftSlot={
          <IconButton
            name="home"
            label="BACK TO BURROW"
            onPress={onHome}
          />
        }
        rightSlot={
          <IconButton
            name="pause"
            label="PAUSE"
            onPress={() => setPaused(true)}
          />
        }
        belowSlot={
          isFree ? null : (
            <ProgressDots total={ROUNDS_PER_SESSION} done={roundIndex - 1} />
          )
        }
      />

      <View style={styles.area}>
        <RabbitRequest
          mode={round.mode}
          target={round.target}
          a={round.a}
          b={round.b}
          message={isFree ? undefined : message}
          twitchKey={twitchKey}
        />

        <View style={styles.boardWrap}>
          <NumberBubble
            value={counted}
            trigger={bubbleTrigger}
            visible={countBubbles}
          />
          <View
            style={[
              styles.board,
              { height: boardHeight },
              phase === 'correct' ? styles.boardWin : null,
            ]}>
            <View pointerEvents="none" style={styles.boardTop} />
            {wires.map((wire, index) => (
              <View
                key={wire.id}
                style={[
                  styles.wireRow,
                  index > 0 ? { marginTop: WIRE_GAP } : null,
                ]}>
                <BeadWire
                  wireIndex={index}
                  unit={wire.unit}
                  beadCount={wire.beadCount}
                  counted={groups[index] || 0}
                  innerWidth={BOARD_INNER_W}
                  slot={BEAD}
                  beadSize={BEAD_SIZE}
                  rowHeight={WIRE_ROW_H}
                  colors={[...theme.beads]}
                  disabled={locked}
                  highlightIndex={
                    highlight && highlight.wire === index ? highlight.bead : -1
                  }
                  onChange={setWire}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.trayWrap}>
          <CarrotTray count={counted} label="YOUR CARROTS" />
          <CelebrationStars playing={phase === 'correct'} />
        </View>
      </View>

      <View style={styles.controls}>
        <View pointerEvents="none" style={styles.controlsTop} />

        <View style={styles.statsRow}>
          {isFree ? null : (
            <View style={styles.statSlot}>
              <StatPill
                value={round.target}
                label="ASKED"
                valueColor={theme.colors.accentDark}
              />
            </View>
          )}
          <View style={styles.statSlot}>
            <StatPill
              value={counted}
              label="COUNTED"
              valueColor={theme.colors.primary}
            />
          </View>
          <View style={styles.statSlot}>
            <StatPill
              value={stars}
              label="STARS"
              valueColor={theme.colors.gold}
            />
          </View>
        </View>

        <BurrowDoorButton
          label={ctaLabel}
          enabled={ctaEnabled}
          onPress={handleCheck}
          shakeKey={shakeKey}
        />

        <View style={styles.secondaryRow}>
          <View style={styles.secondarySlot}>
            <ClayButton
              title="UNDO"
              variant="secondary"
              Icon={RotateCcw}
              iconColor={theme.colors.textSecondary}
              onPress={undo}
              disabled={locked}
            />
          </View>
          <View style={styles.secondarySlot}>
            <ClayButton
              title="CLEAR"
              variant="secondary"
              Icon={Eraser}
              iconColor={theme.colors.textSecondary}
              onPress={clear}
              disabled={locked}
            />
          </View>
        </View>
      </View>

      {paused ? (
        <View style={styles.pauseLayer}>
          <View style={styles.pauseCard}>
            <AssetIcon name="rabbit" style={styles.pauseRabbit} />
            <Text style={styles.pauseTitle}>TAKING A BREAK</Text>
            <Text style={styles.pauseSub}>THE BEADS WILL WAIT FOR YOU</Text>
            <View style={styles.pauseButtons}>
              <ClayButton
                title="KEEP COUNTING"
                variant="primary"
                onPress={() => setPaused(false)}
              />
              <ClayButton
                title="BACK TO BURROW"
                variant="secondary"
                onPress={onHome}
              />
            </View>
          </View>
        </View>
      ) : null}
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
    justifyContent: 'space-between',
  },
  boardWrap: { alignItems: 'center', justifyContent: 'center' },
  board: {
    width: BOARD_W,
    alignSelf: 'center',
    padding: BOARD_PAD,
    borderWidth: BOARD_BORDER,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.surfaceAlt,
    shadowColor: '#2D3A23',
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 9,
  },
  boardWin: {
    borderColor: theme.colors.primary,
    shadowColor: '#6A994E',
    shadowOpacity: 0.5,
  },
  boardTop: {
    position: 'absolute',
    top: 3,
    left: 20,
    right: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  wireRow: { alignSelf: 'center' },
  trayWrap: { position: 'relative' },

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

  controls: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.xxl,
    borderTopRightRadius: theme.radius.xxl,
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 12,
    shadowColor: '#2D3A23',
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -8 },
    elevation: 16,
  },
  controlsTop: {
    position: 'absolute',
    top: 4,
    left: 40,
    right: 40,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  statsRow: { flexDirection: 'row', gap: 10 },
  statSlot: { flex: 1 },
  secondaryRow: { flexDirection: 'row', gap: 10 },
  secondarySlot: { flex: 1 },

  pauseLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(45,58,35,0.62)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    zIndex: 50,
  },
  pauseCard: {
    width: '100%',
    borderRadius: theme.radius.xxl,
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    paddingVertical: 22,
    paddingHorizontal: 20,
  },
  pauseRabbit: { width: 92, height: 92 },
  pauseTitle: {
    marginTop: 8,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '900',
    letterSpacing: 1,
    color: theme.colors.text,
  },
  pauseSub: {
    marginTop: 4,
    marginBottom: 16,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.textMuted,
  },
  pauseButtons: { width: '100%', gap: 10 },
});
