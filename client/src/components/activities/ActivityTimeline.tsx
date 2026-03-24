import ActivityTypeIcon from './ActivityTypeIcon';
import { formatDate } from '../../lib/format';
import type { Activity } from '../../types';

export default function ActivityTimeline({ activities }: { activities: Activity[] }) {
  if (!activities.length) {
    return <p className="text-gray-400 text-sm">No activities yet</p>;
  }

  return (
    <div className="space-y-3">
      {activities.map(a => (
        <div key={a.id} className="flex gap-3 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <ActivityTypeIcon type={a.type} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">{a.type}</span>
              <span className="text-xs text-gray-500">{formatDate(a.date)}</span>
            </div>
            {a.prospect_name && (
              <p className="text-xs text-gray-400 mt-0.5">{a.prospect_name}</p>
            )}
            <p className="text-sm text-gray-700 mt-1">{a.summary}</p>
            {a.outcome && (
              <p className="text-sm text-gray-500 mt-1">
                <span className="font-medium">Next:</span> {a.outcome}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
