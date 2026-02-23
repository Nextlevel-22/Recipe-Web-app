import { useEffect, useRef } from 'react';

const MEALS = [
  { id: 'breakfast', label: 'Breakfast', emoji: '🌅', color: '#FF6B35' },
  { id: 'lunch',     label: 'Lunch',     emoji: '☀️',  color: '#2DD4BF' },
  { id: 'snacks',    label: 'Snacks',    emoji: '🍿',  color: '#F59E0B' },
  { id: 'dinner',    label: 'Dinner',    emoji: '🌙',  color: '#818CF8' },
];

export default function MealButton({ activeMeal, onSelect, disabled }) {
  const indicatorRef = useRef(null);
  const tabsRef = useRef({});

  useEffect(() => {
    const activeTab = tabsRef.current[activeMeal];
    const indicator = indicatorRef.current;
    if (activeTab && indicator) {
      const { offsetLeft, offsetWidth } = activeTab;
      indicator.style.left  = `${offsetLeft}px`;
      indicator.style.width = `${offsetWidth}px`;
    }
  }, [activeMeal]);

  return (
    <div style={styles.wrapper}>
      <div style={styles.tabBar}>
        {/* Gliding indicator */}
        <div ref={indicatorRef} style={{
          ...styles.indicator,
          background: MEALS.find(m => m.id === activeMeal)?.color || '#FF6B35',
        }} />

        {MEALS.map((meal, i) => {
          const isActive = meal.id === activeMeal;
          return (
            <button
              key={meal.id}
              ref={el => (tabsRef.current[meal.id] = el)}
              onClick={() => !disabled && onSelect(meal.id)}
              disabled={disabled}
              style={{
                ...styles.tab,
                color: isActive ? '#0a0a15' : '#6b6b8a',
                fontWeight: isActive ? '600' : '400',
                animationDelay: `${i * 0.08}s`,
              }}
              aria-selected={isActive}
            >
              <span style={styles.emoji}>{meal.emoji}</span>
              <span>{meal.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    padding: '0 1.5rem',
    position: 'relative',
    zIndex: 10,
  },
  tabBar: {
    display: 'flex',
    position: 'relative',
    background: '#13131f',
    border: '1px solid #2a2a3e',
    borderRadius: '14px',
    padding: '5px',
    gap: '2px',
    maxWidth: '520px',
    margin: '0 auto',
  },
  indicator: {
    position: 'absolute',
    top: '5px',
    height: 'calc(100% - 10px)',
    borderRadius: '10px',
    transition: 'left 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.3s ease, background 0.4s ease',
    zIndex: 0,
  },
  tab: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '0.6rem 0.5rem',
    border: 'none',
    background: 'transparent',
    borderRadius: '10px',
    fontSize: '0.85rem',
    letterSpacing: '0.01em',
    transition: 'color 0.3s ease',
    position: 'relative',
    zIndex: 1,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    animation: 'fadeUp 0.5s ease both',
  },
  emoji: {
    fontSize: '1rem',
  },
};
