import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import HomeScreen from './screens/HomeScreen';
import CategoryScreen from './screens/CategoryScreen';
import MenuScreen from './screens/MenuScreen';
import ResultScreen from './screens/ResultScreen';
import HistoryScreen from './screens/HistoryScreen';
import RankingScreen from './screens/RankingScreen';
import PartyStartScreen from './screens/PartyStartScreen';
import PartyRoomScreen from './screens/PartyRoomScreen';
import type { MenuCategory, RouletteType } from './data/menuData';
import './App.css';

type View =
  | { screen: 'home' }
  | { screen: 'category'; type: RouletteType }
  | { screen: 'menu'; type: RouletteType; category: MenuCategory }
  | { screen: 'result'; type: RouletteType; category: MenuCategory; menu: string }
  | { screen: 'history' }
  | { screen: 'ranking' }
  | { screen: 'party-start' }
  | { screen: 'party-room'; sessionId: string };

function getInitialView(): View {
  const sessionId = new URLSearchParams(window.location.search).get('party');
  return sessionId ? { screen: 'party-room', sessionId } : { screen: 'home' };
}

export default function App() {
  const [view, setView] = useState<View>(getInitialView);

  const exitParty = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('party');
    window.history.replaceState({}, '', url.toString());
    setView({ screen: 'home' });
  };

  return (
    <div className="app-shell">
      <AnimatePresence mode="wait">
        {view.screen === 'home' && (
          <HomeScreen
            key="home"
            onSelectType={(type) => setView({ screen: 'category', type })}
            onOpenHistory={() => setView({ screen: 'history' })}
            onOpenRanking={() => setView({ screen: 'ranking' })}
            onOpenParty={() => setView({ screen: 'party-start' })}
          />
        )}

        {view.screen === 'history' && <HistoryScreen key="history" onBack={() => setView({ screen: 'home' })} />}

        {view.screen === 'ranking' && <RankingScreen key="ranking" onBack={() => setView({ screen: 'home' })} />}

        {view.screen === 'party-start' && (
          <PartyStartScreen
            key="party-start"
            onBack={() => setView({ screen: 'home' })}
            onSessionCreated={(sessionId) => setView({ screen: 'party-room', sessionId })}
          />
        )}

        {view.screen === 'party-room' && (
          <PartyRoomScreen key="party-room" sessionId={view.sessionId} onExit={exitParty} />
        )}

        {view.screen === 'category' && (
          <CategoryScreen
            key="category"
            type={view.type}
            onBack={() => setView({ screen: 'home' })}
            onCategoryChosen={(category) => setView({ screen: 'menu', type: view.type, category })}
          />
        )}

        {view.screen === 'menu' && (
          <MenuScreen
            key="menu"
            type={view.type}
            category={view.category}
            onBack={() => setView({ screen: 'category', type: view.type })}
            onMenuChosen={(menu) =>
              setView({ screen: 'result', type: view.type, category: view.category, menu })
            }
          />
        )}

        {view.screen === 'result' && (
          <ResultScreen
            key="result"
            type={view.type}
            category={view.category}
            menu={view.menu}
            onRespin={() => setView({ screen: 'menu', type: view.type, category: view.category })}
            onRestart={() => setView({ screen: 'home' })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
