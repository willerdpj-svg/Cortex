import { useState } from 'react';
import { DEAL_STAGES } from '../../lib/constants';
import type { Prospect } from '../../types';

interface DealFormProps {
  prospects: Prospect[];
  initialProspectId?: number;
  onSubmit: (data: Record<string, unknown>) => void;
  onCancel: () => void;
}

export default function DealForm({ prospects, initialProspectId, onSubmit, onCancel }: DealFormProps) {
  const [form, setForm] = useState({
    name: '',
    prospect_id: initialProspectId?.toString() || '',
    stage: 'Identified',
    monthly_value: '',
    services: '',
    decision_maker: '',
    champion: '',
    next_step: '',
    expected_close: '',
    notes: '',
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none';

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit({
          ...form,
          prospect_id: Number(form.prospect_id),
          monthly_value: form.monthly_value ? Number(form.monthly_value) : 0,
        });
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deal Name *</label>
          <input className={inputCls} value={form.name} onChange={set('name')} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prospect *</label>
          <select className={inputCls} value={form.prospect_id} onChange={set('prospect_id')} required>
            <option value="">Select...</option>
            {prospects.map(p => <option key={p.id} value={p.id}>{p.company_name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
          <select className={inputCls} value={form.stage} onChange={set('stage')}>
            {DEAL_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Value (R)</label>
          <input className={inputCls} type="number" value={form.monthly_value} onChange={set('monthly_value')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Services</label>
          <input className={inputCls} value={form.services} onChange={set('services')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Decision Maker</label>
          <input className={inputCls} value={form.decision_maker} onChange={set('decision_maker')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Champion</label>
          <input className={inputCls} value={form.champion} onChange={set('champion')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expected Close</label>
          <input className={inputCls} type="date" value={form.expected_close} onChange={set('expected_close')} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Next Step</label>
        <input className={inputCls} value={form.next_step} onChange={set('next_step')} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea className={inputCls} rows={2} value={form.notes} onChange={set('notes')} />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          Create Deal
        </button>
      </div>
    </form>
  );
}
