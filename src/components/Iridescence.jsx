import './Iridescence.css';

export default function Iridescence({ activeMeal }) {
  const orbColors = {
    breakfast: ['#FF6B3550', '#F59E0B30', '#2DD4BF20', '#818CF820'],
    lunch:     ['#2DD4BF50', '#10B98130', '#818CF820', '#FF6B3520'],
    snacks:    ['#F59E0B50', '#FF6B3530', '#2DD4BF20', '#818CF820'],
    dinner:    ['#818CF850', '#A78BFA30', '#2DD4BF20', '#F59E0B20'],
  };

  const colors = orbColors[activeMeal] || orbColors.breakfast;

  return (
    <>
      <div className="iridescence-bg">
        <div
          className="iridescence-orb iridescence-orb-1"
          style={{ background: `radial-gradient(circle, ${colors[0]} 0%, transparent 70%)`, transition: 'background 1s ease' }}
        />
        <div
          className="iridescence-orb iridescence-orb-2"
          style={{ background: `radial-gradient(circle, ${colors[1]} 0%, transparent 70%)`, transition: 'background 1s ease' }}
        />
        <div
          className="iridescence-orb iridescence-orb-3"
          style={{ background: `radial-gradient(circle, ${colors[2]} 0%, transparent 70%)`, transition: 'background 1s ease' }}
        />
        <div
          className="iridescence-orb iridescence-orb-4"
          style={{ background: `radial-gradient(circle, ${colors[3]} 0%, transparent 70%)`, transition: 'background 1s ease' }}
        />
      </div>
      <div className="noise-overlay" />
    </>
  );
}
