import React, { useCallback, useRef, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import theme from './src/constants/theme';
import { GameMode } from './src/game/levels';
import useAdaptiveLevel from './src/hooks/useAdaptiveLevel';
import useProgress from './src/hooks/useProgress';
import LoaderScreen from './src/screens/LoaderScreen';
import BurrowHomeScreen from './src/screens/BurrowHomeScreen';
import BeadWireScreen, { SessionResult } from './src/screens/BeadWireScreen';
import WellDoneScreen from './src/screens/WellDoneScreen';
import StickerPantryScreen from './src/screens/StickerPantryScreen';
import NumberSongScreen from './src/screens/NumberSongScreen';
import GrownUpCornerScreen, { Settings } from './src/screens/GrownUpCornerScreen';

type Screen =
  | 'loader'
  | 'menu'
  | 'game'
  | 'gameover'
  | 'pantry'
  | 'song'
  | 'grownup';

const EMPTY_SESSION: SessionResult = {
  correct: 0,
  sessionCarrots: 0,
  rounds: 5,
};

/** State machine only — all gameplay lives in the screens. */
export default function App() {
  const [screen, setScreen] = useState<Screen>('loader');
  const [mode, setMode] = useState<GameMode>('count');
  const [gameKey, setGameKey] = useState(0);
  const [session, setSession] = useState<SessionResult>(EMPTY_SESSION);
  const [settings, setSettings] = useState<Settings>({
    countBubbles: true,
    celebrations: true,
    language: 'EN',
  });

  const progress = useProgress();
  const adaptive = useAdaptiveLevel();
  const lastNumber = useRef(1);

  const goMenu = useCallback(() => setScreen('menu'), []);

  const startGame = useCallback(
    (next: GameMode) => {
      setMode(next);
      setGameKey(k => k + 1);
      setScreen('game');
    },
    [],
  );

  const handleMastered = useCallback(
    (n: number) => {
      lastNumber.current = n;
      progress.markMastered(n);
    },
    [progress],
  );

  const handleGameOver = useCallback(
    (result: SessionResult) => {
      setSession(result);
      progress.finishSession();
      setScreen('gameover');
    },
    [progress],
  );

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle={screen === 'loader' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      {screen === 'loader' ? <LoaderScreen onDone={goMenu} /> : null}

      {screen === 'menu' ? (
        <BurrowHomeScreen
          carrots={progress.carrots}
          stars={progress.stars}
          mastered={progress.mastered}
          level={adaptive.level}
          onPlay={() => startGame('count')}
          onFreeBeads={() => startGame('free')}
          onSong={() => setScreen('song')}
          onPantry={() => setScreen('pantry')}
          onGrownUp={() => setScreen('grownup')}
        />
      ) : null}

      {screen === 'game' ? (
        <BeadWireScreen
          key={`game-${gameKey}`}
          mode={mode}
          level={adaptive.level}
          easier={adaptive.easier}
          onCorrectRound={adaptive.onCorrect}
          onRecountRound={adaptive.onRecount}
          stars={progress.stars}
          countBubbles={settings.countBubbles}
          celebrations={settings.celebrations}
          onCarrots={progress.addCarrots}
          onStar={progress.addStar}
          onMastered={handleMastered}
          onStreak={progress.reportStreak}
          onHome={goMenu}
          onGameOver={handleGameOver}
        />
      ) : null}

      {screen === 'gameover' ? (
        <WellDoneScreen
          correct={session.correct}
          rounds={session.rounds}
          sessionCarrots={session.sessionCarrots}
          best={progress.best}
          lastNumber={lastNumber.current}
          mastered={progress.mastered}
          onPlayAgain={() => startGame('count')}
          onPantry={() => setScreen('pantry')}
          onMenu={goMenu}
        />
      ) : null}

      {screen === 'pantry' ? (
        <StickerPantryScreen mastered={progress.mastered} onBack={goMenu} />
      ) : null}

      {screen === 'song' ? (
        <NumberSongScreen onBack={goMenu} onCarrots={progress.addCarrots} />
      ) : null}

      {screen === 'grownup' ? (
        <GrownUpCornerScreen
          settings={settings}
          onSettings={setSettings}
          mastered={progress.mastered}
          sessions={progress.sessions}
          level={adaptive.level}
          onBack={goMenu}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
});
