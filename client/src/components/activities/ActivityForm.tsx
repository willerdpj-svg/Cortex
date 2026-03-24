import { useState } from 'react';
import { ACTIVITY_TYPES } from '../../lib/constants';
import type { Activity } from '../../types';

interface ActivityFormProps {
  prospectId?: number;
  dealId?: number;
  onSubmit: (data: Partial<Activity>) => void;
  onCancel: () => void;
}

export default function ActivityForm({ prospectId, dealId, onSubmit, onCancel }: ActivityFormProps) {
  const [form, setForm] = useState({
    type: 'Call' as string,
    date: new Date().toISOString().split('T')[0],
    summary: '',
    outcome: '',
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none';

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit({ ...form, prospect_id: prospectId, deal_id: dealId } as Partial<Activity>);
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select className={inputCls} value={form.type} onChange={set('type')}>
            {ACTIVITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input className={inputCls} type="date" value={form.date} onChange={set('date')} required />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Summary *</label>
        <textarea className={inputCls} rows={3} value={form.summary} onChange={set('summary')} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Outcome / Next Action</label>
        <textarea className={inputCls} rows={2} value={form.outcome} onChange={set('outcome')} />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          Log Activity
        </button>
      </div>
    </form>
  );
}
