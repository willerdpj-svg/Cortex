import { useState } from 'react';
import type { Prospect } from '../../types';

const CRITERIA = [
  { key: 'icp_aum_size', label: 'AUM Size', weight: '25%' },
  { key: 'icp_data_complexity', label: 'Data Complexity', weight: '20%' },
  { key: 'icp_pain_level', label: 'Pain Level', weight: '20%' },
  { key: 'icp_budget_readiness', label: 'Budget Readiness', weight: '15%' },
  { key: 'icp_timeline_urgency', label: 'Timeline Urgency', weight: '10%' },
  { key: 'icp_internal_champion', label: 'Internal Champion', weight: '10%' },
] as const;

interface IcpScoreFormProps {
  prospect: Prospect;
  onSubmit: (scores: Record<string, number>) => void;
  onCancel: () => void;
}

export default function IcpScoreForm({ prospect, onSubmit, onCancel }: IcpScoreFormProps) {
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(CRITERIA.map(c => [c.key, (prospect as unknown as Record<string, unknown>)[c.key] as number || 5]))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(scores);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {CRITERIA.map(({ key, label, weight }) => (
        <div key={key}>
          <div className="flex justify-between text-sm mb-1">
            <label className="font-medium text-gray-700">{label}</label>
            <span className="text-gray-400">Weight: {weight} — Score: {scores[key]}/10</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={scores[key]}
            onChange={e => setScores(s => ({ ...s, [key]: Number(e.target.value) }))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      ))}
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          Save ICP Scores
        </button>
      </div>
    </form>
  );
}
