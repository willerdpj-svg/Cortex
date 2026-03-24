import Badge from '../ui/Badge';

function getScoreTier(score: number | null) {
  if (score == null) return { label: 'Unscored', className: 'bg-gray-100 text-gray-500' };
  if (score >= 80) return { label: 'Excellent', className: 'bg-green-100 text-green-800' };
  if (score >= 60) return { label: 'Good', className: 'bg-blue-100 text-blue-800' };
  if (score >= 40) return { label: 'Fair', className: 'bg-yellow-100 text-yellow-800' };
  return { label: 'Low', className: 'bg-red-100 text-red-800' };
}

export default function IcpScoreBadge({ score }: { score: number | null }) {
  const tier = getScoreTier(score);
  return (
    <Badge className={tier.className}>
      {score != null ? `${score} — ${tier.label}` : tier.label}
    </Badge>
  );
}
