import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import DealCard from './DealCard';
import { formatRands } from '../../lib/format';
import type { Deal } from '../../types';

interface PipelineColumnProps {
  stage: string;
  deals: Deal[];
  onDealClick: (id: number) => void;
}

export default function PipelineColumn({ stage, deals, onDealClick }: PipelineColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  const totalValue = deals.reduce((s, d) => s + (d.monthly_value || 0), 0);

  return (
    <div
      ref={setNodeRef}
      className={`flex-shrink-0 w-72 bg-gray-100 rounded-xl p-3 flex flex-col transition-colors ${
        isOver ? 'bg-blue-50 ring-2 ring-blue-300' : ''
      }`}
    >
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">{stage}</h3>
          <span className="text-xs text-gray-400 bg-gray-200 rounded-full px-2 py-0.5">{deals.length}</span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">{formatRands(totalValue)}</p>
      </div>
      <SortableContext items={deals.map(d => d.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 space-y-2 min-h-[60px]">
          {deals.map(deal => (
            <DealCard key={deal.id} deal={deal} onClick={() => onDealClick(deal.id)} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
