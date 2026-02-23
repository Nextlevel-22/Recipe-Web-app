import { useState, useCallback } from 'react';
import './App.css';

import Iridescence  from './components/Iridescence.jsx';
import MealButton   from './components/Mealbutton.jsx';
import GachaWheel   from './components/GachaWheel.jsx';
import AddItems     from './components/AddItems.jsx';
import Cart         from './components/Cart.jsx';

// ── Storage helpers ──────────────────────────────────────────────────────────
const STORAGE_KEY = 'mealGacha_v3';

const DEFAULT_DISHES = {
  breakfast: ['Masala Dosa','Poha','Aloo Paratha','Idli Sambar','Upma','Besan Chilla','Egg Bhurji','Fruit Smoothie'],
  lunch:     ['Dal Tadka','Chole Bhature','Biryani','Rajma Chawal','Palak Paneer','Chicken Curry','Roti Sabzi','Lemon Rice'],
  snacks:    ['Samosa','Aloo Chaat','Maggi','Pakoda','Makhana','Bread Pakoda','Pani Puri','Roasted Chana'],
  dinner:    ['Paneer Tikka','Butter Chicken','Tandoori Roti','Dal Makhani','Egg Curry','Vegetable Soup','Pasta','Khichdi'],
};

function loadDishes() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : JSON.parse(JSON.stringify(DEFAULT_DISHES));
  } catch {
    return JSON.parse(JSON.stringify(DEFAULT_DISHES));
  }
}

function saveDishes(d) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch { /* ignore */ }
}

const TAGLINES = {
  breakfast: "What's for breakfast today? 🌅",
  lunch:     "Let the wheel decide your lunch! ☀️",
  snacks:    "Snack time — spin and munch! 🍿",
  dinner:    "Tonight's dinner is just a spin away 🌙",
};

function formatDate() {
  return new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
}

// ── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeMeal, setActiveMeal] = useState('breakfast');
  const [dishes,     setDishes]     = useState(loadDishes);
  const [picks,      setPicks]      = useState({ breakfast: null, lunch: null, snacks: null, dinner: null });
  const [spinning,   setSpinning]   = useState(false);

  // ── Dish CRUD ──
  const handleAdd = useCallback((name) => {
    setDishes(prev => {
      const next = { ...prev, [activeMeal]: [...prev[activeMeal], name] };
      saveDishes(next);
      return next;
    });
  }, [activeMeal]);

  const handleRemove = useCallback((index) => {
    setDishes(prev => {
      const next = {
        ...prev,
        [activeMeal]: prev[activeMeal].filter((_, i) => i !== index),
      };
      saveDishes(next);
      return next;
    });
  }, [activeMeal]);

  // ── Wheel result ──
  const handleResult = useCallback((dish, meal) => {
    setPicks(prev => ({ ...prev, [meal]: dish }));
    setSpinning(false);
  }, []);

  const handleSpinStart = useCallback(() => setSpinning(true), []);

  // ── Tab switch ──
  const handleMealSwitch = useCallback((meal) => {
    if (!spinning) setActiveMeal(meal);
  }, [spinning]);

  // ── Clear picks ──
  const handleClear = useCallback(() => {
    setPicks({ breakfast: null, lunch: null, snacks: null, dinner: null });
  }, []);

  return (
    <div className="app">
      {/* Animated background */}
      <Iridescence activeMeal={activeMeal} />

      {/* Header */}
      <header className="app-header">
        <div className="header-brand">
          <h1 className="header-title">🎰 Meal Gacha</h1>
          <span className="header-sub">Spin to eat</span>
        </div>
        <span className="header-date">{formatDate()}</span>
      </header>

      {/* Meal tabs */}
      <div className="tab-section">
        <MealButton
          activeMeal={activeMeal}
          onSelect={handleMealSwitch}
          disabled={spinning}
        />
      </div>

      {/* Main content */}
      <main className="app-main">
        {/* Left: Wheel */}
        <section className="wheel-section">
          <p className="wheel-tagline">{TAGLINES[activeMeal]}</p>
          <GachaWheel
            key={activeMeal}
            dishes={dishes[activeMeal]}
            mealId={activeMeal}
            onResult={handleResult}
            onSpinStart={handleSpinStart}
          />
        </section>

        {/* Right: Add Items */}
        <aside className="sidebar">
          <AddItems
            mealId={activeMeal}
            dishes={dishes[activeMeal]}
            onAdd={handleAdd}
            onRemove={handleRemove}
          />
        </aside>
      </main>

      {/* Floating cart / picks tracker */}
      <Cart picks={picks} onClear={handleClear} />
    </div>
  );
}
