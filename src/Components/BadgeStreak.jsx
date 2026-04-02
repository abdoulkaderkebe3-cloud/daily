// BadgeStreak
// Affiche le nombre de victoires consécutives de l'utilisateur.
//
// Props :
//   streak → number : nombre de jours consécutifs

const BadgeStreak = ({ streak = 0 }) => {
  if (streak === 0) return null;

  return (
    <div className="badge-streak" aria-label={`${streak} jours consécutifs`}>
      <i className="ph ph-fire" />
      <span>{streak}</span>
    </div>
  );
};

export default BadgeStreak;
