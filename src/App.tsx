import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import HomeScreen from './screens/HomeScreen';
import CategoryScreen from './screens/CategoryScreen';
import MenuScreen from './screens/MenuScreen';
import ResultScreen from './screens/ResultScreen';
import type { MenuCategory, RouletteType } from './data/menuData';
import './App.css';

type View =
  | { screen: 'home' }
  | { screen: 'category'; type: RouletteType }
  | { screen: 'menu'; type: RouletteType; category: MenuCategory }
  | { screen: 'result'; type: RouletteType; category: MenuCategory; menu: string };

export default function App() {
  const [view, setView] = useState<View>({ screen: 'home' });

  return (
    <div className="app-shell">
      <AnimatePresence mode="wait">
        {view.screen === 'home' && (
          <HomeScreen key="home" onSelectType={(type) => setView({ screen: 'category', type })} />
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
