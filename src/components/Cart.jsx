import { useState } from 'react';

const MEAL_COLORS = {
  breakfast: '#FF6B35',
  lunch:     '#2DD4BF',
  snacks:    '#F59E0B',
  dinner:    '#818CF8',
};

const MEAL_EMOJIS = {
  breakfast: '🌅',
  lunch:     '☀️',
  snacks:    '🍿',
  dinner:    '🌙',
};

export default function Cart({ picks, onClear }) {
  const [open, setOpen] = useState(false);
  const count = Object.values(picks).filter(Boolean).length;

  return (
    <>
      {/* Floating cart button */}
      <button
        onClick={() => setOpen(true)}
        style={styles.cartBtn}
        aria-label="Today's picks"
      >
        <span>🗒️</span>
        <span style={styles.cartLabel}>Today's Picks</span>
        {count > 0 && (
          <span style={styles.cartCount}>{count}</span>
        )}
      </button>

      {/* Drawer overlay */}
      {open && (
        <div style={styles.overlay} onClick={() => setOpen(false)}>
          <div
            style={styles.drawer}
            onClick={e => e.stopPropagation()}
          >
            <div style={styles.drawerHeader}>
              <h2 style={styles.drawerTitle}>📋 Today's Meal Plan</h2>
              <button style={styles.closeBtn} onClick={() => setOpen(false)}>✕</button>
            </div>

            <div style={styles.drawerBody}>
              {count === 0 ? (
                <div style={styles.emptyCart}>
                  <span style={{ fontSize: '3rem' }}>🎰</span>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: '#4a4a6a', fontSize: '1.1rem' }}>
                    Spin a wheel to fill your meal plan!
                  </p>
                </div>
              ) : (
                ['breakfast','lunch','snacks','dinner'].map(meal => {
                  const pick = picks[meal];
                  const color = MEAL_COLORS[meal];
                  return (
                    <div
                      key={meal}
                      style={{
                        ...styles.mealRow,
                        borderColor: pick ? color + '44' : '#1c1c2e',
                        background: pick ? color + '0d' : '#13131f',
                      }}
                    >
                      <div style={styles.mealMeta}>
                        <span style={styles.mealEmoji}>{MEAL_EMOJIS[meal]}</span>
                        <span style={{ ...styles.mealName, color: pick ? color : '#3a3a5a' }}>
                          {meal.charAt(0).toUpperCase() + meal.slice(1)}
                        </span>
                      </div>
                      <div style={{
                        ...styles.mealDish,
                        color: pick ? '#e8e0f0' : '#3a3a5a',
                        fontStyle: pick ? 'normal' : 'italic',
                      }}>
                        {pick || 'Not picked yet'}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {count > 0 && (
              <div style={styles.drawerFooter}>
                <button
                  style={styles.clearBtn}
                  onClick={() => { onClear(); setOpen(false); }}
                >
                  🗑️ Clear today's plan
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  cartBtn: {
    position: 'fixed',
    bottom: '1.5rem',
    right: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.7rem 1.2rem',
    background: '#1c1c2e',
    border: '1px solid #2a2a3e',
    borderRadius: '100px',
    color: '#e8e0f0',
    fontSize: '0.9rem',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: '500',
    cursor: 'pointer',
    zIndex: 50,
    backdropFilter: 'blur(12px)',
    boxShadow: '0 8px 32px #00000066',
    transition: 'all 0.2s ease',
  },
  cartLabel: {
    letterSpacing: '0.01em',
  },
  cartCount: {
    background: '#818CF8',
    color: '#0a0a15',
    borderRadius: '100px',
    padding: '0.05rem 0.45rem',
    fontSize: '0.75rem',
    fontWeight: '700',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(4px)',
    zIndex: 100,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    animation: 'fadeIn 0.2s ease',
  },
  drawer: {
    background: '#13131f',
    border: '1px solid #2a2a3e',
    borderRadius: '20px 20px 0 0',
    width: '100%',
    maxWidth: '500px',
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    animation: 'slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1) both',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.25rem 1.5rem 1rem',
    borderBottom: '1px solid #2a2a3e',
  },
  drawerTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#e8e0f0',
  },
  closeBtn: {
    background: '#2a2a3e',
    border: 'none',
    borderRadius: '8px',
    color: '#6b6b8a',
    padding: '0.3rem 0.6rem',
    cursor: 'pointer',
    fontSize: '0.85rem',
    transition: 'all 0.15s',
  },
  drawerBody: {
    flex: 1,
    overflowY: 'auto',
    padding: '1rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
  },
  emptyCart: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.8rem',
    padding: '3rem 1rem',
    textAlign: 'center',
  },
  mealRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
    padding: '0.9rem 1.1rem',
    borderRadius: '12px',
    border: '1px solid',
    transition: 'all 0.2s',
  },
  mealMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  mealEmoji: {
    fontSize: '1rem',
  },
  mealName: {
    fontSize: '0.72rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    transition: 'color 0.3s',
  },
  mealDish: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.1rem',
    fontWeight: '700',
    transition: 'color 0.3s',
    paddingLeft: '1.5rem',
  },
  drawerFooter: {
    padding: '1rem 1.5rem',
    borderTop: '1px solid #2a2a3e',
  },
  clearBtn: {
    width: '100%',
    padding: '0.75rem',
    background: '#1c1c2e',
    border: '1px solid #2a2a3e',
    borderRadius: '10px',
    color: '#6b6b8a',
    fontSize: '0.88rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: "'DM Sans', sans-serif",
  },
};
