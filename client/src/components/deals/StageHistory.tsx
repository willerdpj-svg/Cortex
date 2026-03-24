import { formatDate } from '../../lib/format';
import { STAGE_COLORS } from '../../lib/constants';
import Badge from '../ui/Badge';
import type { StageHistoryEntry } from '../../types';

export default function StageHistory({ history }: { history: StageHistoryEntry[] }) {
  if (!history.length) return <p className="text-gray-400 text-sm">No stage history</p>;

  return (
    <div className="relative pl-6">
      <div className="absolute left-2.5 top-2 bottom-2 w-px bg-gray-200" />
      {history.map((h, i) => {
        const daysInStage = h.exited_at
          ? Math.round((new Date(h.exited_at).getTime() - new Date(h.changed_at).getTime()) / 86400000)
          : null;
        const isLast = i === history.length - 1;
        return (
          <div key={h.id} className="relative mb-4 last:mb-0">
            <div className={`absolute -left-3.5 w-3 h-3 rounded-full border-2 ${
              isLast ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'
            }`} />
            <div className="ml-2">
              <div className="flex items-center gap-2">
                <Badge className={STAGE_COLORS[h.to_stage] || 'bg-gray-100 text-gray-700'}>
                  {h.to_stage}
                </Badge>
                <span className="text-xs text-gray-500">{formatDate(h.changed_at)}</span>
              </div>
              {daysInStage !== null && (
                <p className="text-xs text-gray-400 mt-0.5">{daysInStage} day{daysInStage !== 1 ? 's' : ''} in stage</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
