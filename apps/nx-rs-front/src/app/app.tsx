import styles from './app.module.scss';
import React, { lazy, Suspense } from 'react';

const GameOfLife = lazy(() => import('../components/game-of-life'));

export function App() {
  return (
    <div className={styles.app}>
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <GameOfLife />
        </Suspense>
      </main>
    </div>
  );
}

export default App;
