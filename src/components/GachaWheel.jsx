import { useEffect, useRef, useState, useCallback } from 'react';

const PALETTE = {
  breakfast: ['#FF6B35','#FF8C42','#FFA85F','#FFBF80','#FFA07A','#FF7C52','#E8541A','#FFB088'],
  lunch:     ['#2DD4BF','#14B8A6','#0D9488','#5EEAD4','#34D399','#10B981','#0F766E','#6EE7B7'],
  snacks:    ['#F59E0B','#FBBF24','#FCD34D','#F97316','#FB923C','#D97706','#B45309','#FDBA74'],
  dinner:    ['#818CF8','#A78BFA','#C4B5FD','#6366F1','#8B5CF6','#7C3AED','#6D28D9','#E879F9'],
};

const MEAL_COLORS = {
  breakfast: '#FF6B35',
  lunch:     '#2DD4BF',
  snacks:    '#F59E0B',
  dinner:    '#818CF8',
};

function drawWheel(canvas, dishes, mealId, angle) {
  const ctx = canvas.getContext('2d');
  const size = canvas.width;
  const cx = size / 2, cy = size / 2, r = cx - 8;
  const palette = PALETTE[mealId] || PALETTE.breakfast;

  ctx.clearRect(0, 0, size, size);

  if (!dishes.length) {
    // Empty state
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    const emptyGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    emptyGrad.addColorStop(0, '#1c1c2e');
    emptyGrad.addColorStop(1, '#13131f');
    ctx.fillStyle = emptyGrad;
    ctx.fill();
    ctx.strokeStyle = '#2a2a3e';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = "bold 13px 'DM Sans', sans-serif";
    ctx.fillStyle = '#4a4a6a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Add dishes to spin! 🍽️', cx, cy);
    return;
  }

  const sliceAngle = (2 * Math.PI) / dishes.length;

  // Draw slices
  dishes.forEach((dish, i) => {
    const start = angle + i * sliceAngle;
    const end   = start + sliceAngle;
    const mid   = start + sliceAngle / 2;
    const col   = palette[i % palette.length];

    // Shadow slice
    ctx.save();
    ctx.shadowColor = col + '44';
    ctx.shadowBlur  = 12;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, end);
    ctx.closePath();

    // Gradient per slice
    const gx1 = cx + Math.cos(mid) * r * 0.25;
    const gy1 = cy + Math.sin(mid) * r * 0.25;
    const gx2 = cx + Math.cos(mid) * r;
    const gy2 = cy + Math.sin(mid) * r;
    const g = ctx.createLinearGradient(gx1, gy1, gx2, gy2);
    g.addColorStop(0, col + 'bb');
    g.addColorStop(1, col);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.restore();

    // Separator line
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(start) * r, cy + Math.sin(start) * r);
    ctx.strokeStyle = '#09090f';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Dish label
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(mid);

    const fs = Math.min(12, Math.max(7, 120 / dishes.length));
    ctx.font = `600 ${fs}px 'DM Sans', sans-serif`;
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    const maxW = r * 0.7;
    let txt = dish;
    while (ctx.measureText(txt + '…').width > maxW && txt.length > 2) txt = txt.slice(0, -1);
    if (txt !== dish) txt += '…';

    ctx.fillText(txt, r - 12, 0);
    ctx.restore();
  });

  // Outer ring
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = MEAL_COLORS[mealId] + '66';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Center hub
  const hubGrad = ctx.createRadialGradient(cx - 5, cy - 5, 2, cx, cy, 26);
  hubGrad.addColorStop(0, '#2e2e4a');
  hubGrad.addColorStop(1, '#0d0d1a');
  ctx.beginPath();
  ctx.arc(cx, cy, 24, 0, Math.PI * 2);
  ctx.fillStyle = hubGrad;
  ctx.fill();
  ctx.strokeStyle = MEAL_COLORS[mealId];
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, 7, 0, Math.PI * 2);
  ctx.fillStyle = MEAL_COLORS[mealId];
  ctx.fill();
}

export default function GachaWheel({ dishes, mealId, onResult }) {
  const canvasRef   = useRef(null);
  const angleRef    = useRef(0);
  const rafRef      = useRef(null);
  const [spinning, setSpinning]   = useState(false);
  const [result,   setResult]     = useState(null);
  const [showPop,  setShowPop]    = useState(false);
  const mealColor = MEAL_COLORS[mealId] || '#FF6B35';

  // Redraw whenever dishes / meal / angle changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) drawWheel(canvas, dishes, mealId, angleRef.current);
  }, [dishes, mealId]);

  // Reset result on meal switch
  useEffect(() => {
    setResult(null);
    setShowPop(false);
  }, [mealId]);

  const spin = useCallback(() => {
    if (spinning || dishes.length === 0) return;

    setResult(null);
    setShowPop(false);
    setSpinning(true);

    const extraSpins  = (5 + Math.floor(Math.random() * 6)) * 2 * Math.PI;
    const winnerIdx   = Math.floor(Math.random() * dishes.length);
    const sliceAngle  = (2 * Math.PI) / dishes.length;
    // Pointer at top = -π/2; target that slice centre sits at top
    const targetNorm  = -Math.PI / 2 - (winnerIdx * sliceAngle + sliceAngle / 2);
    const totalRot    = extraSpins + ((targetNorm - angleRef.current) % (2 * Math.PI));
    const finalAngle  = angleRef.current + totalRot;

    const duration  = 4000 + Math.random() * 1500;
    const startAngle = angleRef.current;
    const startTime  = performance.now();

    function easeOut(t) { return 1 - Math.pow(1 - t, 4); }

    function animate(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOut(progress);

      angleRef.current = startAngle + totalRot * eased;
      const canvas = canvasRef.current;
      if (canvas) drawWheel(canvas, dishes, mealId, angleRef.current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        angleRef.current = finalAngle;
        setSpinning(false);
        setResult(dishes[winnerIdx]);
        setShowPop(true);
        onResult && onResult(dishes[winnerIdx], mealId);
      }
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [spinning, dishes, mealId, onResult]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <div style={styles.wrapper}>
      {/* Pointer */}
      <div style={{ ...styles.pointer, color: mealColor }}>▼</div>

      {/* Pulse rings when spinning */}
      {spinning && (
        <>
          <div style={{ ...styles.pulseRing, border: `2px solid ${mealColor}`, animationDelay: '0s' }} />
          <div style={{ ...styles.pulseRing, border: `2px solid ${mealColor}`, animationDelay: '0.5s' }} />
        </>
      )}

      {/* Canvas wheel */}
      <div style={{ ...styles.canvasWrap, boxShadow: `0 0 60px ${mealColor}33` }}>
        <canvas
          ref={canvasRef}
          width={320}
          height={320}
          style={{ borderRadius: '50%', display: 'block' }}
        />
      </div>

      {/* Spin button */}
      <button
        onClick={spin}
        disabled={spinning || dishes.length === 0}
        style={{
          ...styles.spinBtn,
          background: spinning || dishes.length === 0
            ? '#1c1c2e'
            : `linear-gradient(135deg, ${mealColor}, ${mealColor}bb)`,
          boxShadow: spinning ? 'none' : `0 8px 32px ${mealColor}44`,
          color: spinning || dishes.length === 0 ? '#4a4a6a' : '#0a0a15',
          cursor: spinning || dishes.length === 0 ? 'not-allowed' : 'pointer',
        }}
      >
        {spinning ? (
          <span style={styles.spinnerRow}>
            <span style={{ ...styles.spinnerDot, background: mealColor }} />
            Spinning…
          </span>
        ) : '✦  Spin the Wheel  ✦'}
      </button>

      {/* Result card */}
      {result && (
        <div style={{
          ...styles.resultCard,
          borderColor: mealColor + '55',
          background: `linear-gradient(135deg, ${mealColor}11, #13131f)`,
          animation: showPop ? 'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both' : 'none',
        }}>
          <div style={styles.resultLabel}>Today's pick 🎉</div>
          <div style={{ ...styles.resultDish, color: mealColor }}>{result}</div>
        </div>
      )}

      <style>{`
        @keyframes popIn {
          0%   { transform: scale(0.7); opacity: 0; }
          70%  { transform: scale(1.06); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes pulse-ring {
          0%   { transform: translate(-50%,-50%) scale(1); opacity: 0.7; }
          100% { transform: translate(-50%,-50%) scale(1.9); opacity: 0; }
        }
        @keyframes spin-dot {
          0%   { opacity: 1; }
          50%  { opacity: 0.3; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
    position: 'relative',
    padding: '1rem 0',
  },
  pointer: {
    fontSize: '1.6rem',
    lineHeight: 1,
    filter: 'drop-shadow(0 2px 6px currentColor)',
    zIndex: 2,
  },
  pulseRing: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '340px',
    height: '340px',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    animation: 'pulse-ring 1.2s ease-out infinite',
    pointerEvents: 'none',
  },
  canvasWrap: {
    borderRadius: '50%',
    transition: 'box-shadow 0.5s ease',
  },
  spinBtn: {
    padding: '0.9rem 2.8rem',
    border: 'none',
    borderRadius: '100px',
    fontSize: '1rem',
    fontWeight: '700',
    letterSpacing: '0.04em',
    transition: 'all 0.2s ease',
    fontFamily: "'Playfair Display', serif",
  },
  spinnerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  spinnerDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    animation: 'spin-dot 0.8s ease-in-out infinite',
  },
  resultCard: {
    padding: '1.2rem 2rem',
    borderRadius: '14px',
    border: '1px solid',
    textAlign: 'center',
    minWidth: '240px',
    backdropFilter: 'blur(12px)',
  },
  resultLabel: {
    fontSize: '0.72rem',
    textTransform: 'uppercase',
    letterSpacing: '0.14em',
    color: '#6b6b8a',
    marginBottom: '0.4rem',
  },
  resultDish: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.5rem',
    fontWeight: '700',
  },
};
