import { useState, useRef } from 'react';

const MEAL_COLORS = {
  breakfast: '#FF6B35',
  lunch:     '#2DD4BF',
  snacks:    '#F59E0B',
  dinner:    '#818CF8',
};

const PALETTE = {
  breakfast: ['#FF6B35','#FF8C42','#FFA85F','#FFBF80','#FFA07A','#FF7C52','#E8541A','#FFB088'],
  lunch:     ['#2DD4BF','#14B8A6','#0D9488','#5EEAD4','#34D399','#10B981','#0F766E','#6EE7B7'],
  snacks:    ['#F59E0B','#FBBF24','#FCD34D','#F97316','#FB923C','#D97706','#B45309','#FDBA74'],
  dinner:    ['#818CF8','#A78BFA','#C4B5FD','#6366F1','#8B5CF6','#7C3AED','#6D28D9','#E879F9'],
};

export default function AddItems({ mealId, dishes, onAdd, onRemove }) {
  const [inputVal, setInputVal] = useState('');
  const [focused, setFocused]   = useState(false);
  const inputRef = useRef(null);
  const color    = MEAL_COLORS[mealId] || '#FF6B35';
  const palette  = PALETTE[mealId] || PALETTE.breakfast;

  function handleAdd() {
    const trimmed = inputVal.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setInputVal('');
    inputRef.current?.focus();
  }

  function handleKey(e) {
    if (e.key === 'Enter') handleAdd();
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>Your Dishes</h2>
        <div style={{ ...styles.badge, background: color + '22', color }}>
          {dishes.length}
        </div>
      </div>

      {/* Add form */}
      <div style={{
        ...styles.inputWrap,
        borderColor: focused ? color + '88' : '#2a2a3e',
        boxShadow: focused ? `0 0 0 3px ${color}22` : 'none',
      }}>
        <input
          ref={inputRef}
          style={styles.input}
          type="text"
          placeholder="Type a dish name…"
          maxLength={50}
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={handleKey}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <button
          onClick={handleAdd}
          disabled={!inputVal.trim()}
          style={{
            ...styles.addBtn,
            background: inputVal.trim() ? color : '#2a2a3e',
            color: inputVal.trim() ? '#0a0a15' : '#4a4a6a',
          }}
          aria-label="Add dish"
        >
          ＋
        </button>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: '#2a2a3e', margin: '0.25rem 0' }} />

      {/* Dish list */}
      <div style={styles.listWrap}>
        {dishes.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={{ fontSize: '2rem' }}>🍽️</span>
            <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: '#4a4a6a' }}>
              No dishes yet
            </p>
            <p style={{ fontSize: '0.78rem', color: '#3a3a5a' }}>
              Add some to start spinning!
            </p>
          </div>
        ) : (
          dishes.map((dish, i) => (
            <DishItem
              key={`${dish}-${i}`}
              dish={dish}
              dotColor={palette[i % palette.length]}
              hoverColor={color}
              onRemove={() => onRemove(i)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function DishItem({ dish, dotColor, hoverColor, onRemove }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.dishItem,
        background: hovered ? '#1c1c2e' : '#13131f',
        borderColor: hovered ? dotColor + '55' : '#2a2a3e',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ ...styles.dot, background: dotColor }} />
      <span style={styles.dishName}>{dish}</span>
      <button
        onClick={onRemove}
        style={{
          ...styles.delBtn,
          color: hovered ? '#ef4444' : '#3a3a5a',
          background: hovered ? '#ef444415' : 'transparent',
        }}
        aria-label={`Remove ${dish}`}
      >
        ✕
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.9rem',
    height: '100%',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#e8e0f0',
  },
  badge: {
    padding: '0.15rem 0.55rem',
    borderRadius: '100px',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  inputWrap: {
    display: 'flex',
    gap: '0.5rem',
    background: '#13131f',
    border: '1px solid',
    borderRadius: '10px',
    padding: '4px 4px 4px 12px',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  input: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#e8e0f0',
    fontSize: '0.88rem',
    minWidth: 0,
  },
  addBtn: {
    padding: '0.45rem 0.9rem',
    border: 'none',
    borderRadius: '7px',
    fontSize: '1.1rem',
    fontWeight: '700',
    transition: 'all 0.2s ease',
    lineHeight: 1,
    flexShrink: 0,
  },
  listWrap: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    paddingRight: '2px',
    scrollbarWidth: 'thin',
    scrollbarColor: '#2a2a3e transparent',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '2.5rem 1rem',
    textAlign: 'center',
  },
  dishItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.6rem 0.75rem',
    borderRadius: '9px',
    border: '1px solid',
    transition: 'all 0.15s ease',
    animation: 'fadeUp 0.2s ease both',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  dishName: {
    flex: 1,
    fontSize: '0.85rem',
    color: '#c8c0d8',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  delBtn: {
    background: 'transparent',
    border: 'none',
    fontSize: '0.8rem',
    padding: '0.2rem 0.35rem',
    borderRadius: '5px',
    transition: 'all 0.15s ease',
    flexShrink: 0,
    lineHeight: 1,
    cursor: 'pointer',
  },
};
