import { useState } from 'react';
import { COMPANY_TYPES } from '../../lib/constants';
import type { Prospect } from '../../types';

interface ProspectFormProps {
  initial?: Partial<Prospect>;
  onSubmit: (data: Partial<Prospect>) => void;
  onCancel: () => void;
}

export default function ProspectForm({ initial, onSubmit, onCancel }: ProspectFormProps) {
  const [form, setForm] = useState({
    company_name: initial?.company_name || '',
    company_type: initial?.company_type || 'Asset Manager',
    contact_name: initial?.contact_name || '',
    contact_role: initial?.contact_role || '',
    email: initial?.email || '',
    phone: initial?.phone || '',
    linkedin_url: initial?.linkedin_url || '',
    estimated_aum: initial?.estimated_aum?.toString() || '',
    current_solution: initial?.current_solution || '',
    pain_points: initial?.pain_points || '',
    notes: initial?.notes || '',
    source: initial?.source || '',
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...form,
      estimated_aum: form.estimated_aum ? Number(form.estimated_aum) : undefined,
    } as Partial<Prospect>);
  };

  const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none';
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Company Name *</label>
          <input className={inputCls} value={form.company_name} onChange={set('company_name')} required />
        </div>
        <div>
          <label className={labelCls}>Type *</label>
          <select className={inputCls} value={form.company_type} onChange={set('company_type')}>
            {COMPANY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Contact Name</label>
          <input className={inputCls} value={form.contact_name} onChange={set('contact_name')} />
        </div>
        <div>
          <label className={labelCls}>Role</label>
          <input className={inputCls} value={form.contact_role} onChange={set('contact_role')} />
        </div>
        <div>
          <label className={labelCls}>Email</label>
          <input className={inputCls} type="email" value={form.email} onChange={set('email')} />
        </div>
        <div>
          <label className={labelCls}>Phone</label>
          <input className={inputCls} value={form.phone} onChange={set('phone')} />
        </div>
        <div>
          <label className={labelCls}>LinkedIn URL</label>
          <input className={inputCls} value={form.linkedin_url} onChange={set('linkedin_url')} />
        </div>
        <div>
          <label className={labelCls}>Estimated AUM (Rands)</label>
          <input className={inputCls} type="number" value={form.estimated_aum} onChange={set('estimated_aum')} />
        </div>
        <div>
          <label className={labelCls}>Current Solution</label>
          <input className={inputCls} value={form.current_solution} onChange={set('current_solution')} />
        </div>
        <div>
          <label className={labelCls}>Source</label>
          <input className={inputCls} value={form.source} onChange={set('source')} />
        </div>
      </div>
      <div>
        <label className={labelCls}>Pain Points</label>
        <textarea className={inputCls} rows={2} value={form.pain_points} onChange={set('pain_points')} />
      </div>
      <div>
        <label className={labelCls}>Notes</label>
        <textarea className={inputCls} rows={2} value={form.notes} onChange={set('notes')} />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          {initial?.id ? 'Update' : 'Create'} Prospect
        </button>
      </div>
    </form>
  );
}
