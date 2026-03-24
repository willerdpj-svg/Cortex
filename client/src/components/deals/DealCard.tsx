import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { formatRands } from '../../lib/format';
import type { Deal } from '../../types';

interface DealCardProps {
  deal: Deal;
  onClick: () => void;
}

export default function DealCard({ deal, onClick }: DealCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: deal.id,
    data: { deal },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 cursor-grab active:cursor-grabbing hover:border-blue-300 transition-colors"
    >
      <p className="text-sm font-medium text-gray-900 truncate">{deal.name}</p>
      <p className="text-xs text-gray-500 mt-0.5">{deal.prospect_name}</p>
      <p className="text-sm font-semibold text-gray-700 mt-2">{formatRands(deal.monthly_value)}/mo</p>
      {deal.next_step && (
        <p className="text-xs text-gray-400 mt-1 truncate">Next: {deal.next_step}</p>
      )}
    </div>
  );
}
