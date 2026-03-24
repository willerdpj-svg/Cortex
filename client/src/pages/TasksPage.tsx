import { useState } from 'react';
import { Plus, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { useTasks, useCreateTask, useToggleTaskComplete, useDeleteTask } from '../hooks/useTasks';
import { useProspects } from '../hooks/useProspects';
import { useDeals } from '../hooks/useDeals';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import { formatDate } from '../lib/format';
import { PRIORITIES } from '../lib/constants';
import type { Task } from '../types';
import toast from 'react-hot-toast';

const PRIORITY_COLORS: Record<string, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
};

export default function TasksPage() {
  const [filter, setFilter] = useState<'open' | 'completed'>('open');
  const [showCreate, setShowCreate] = useState(false);

  const { data: tasks, isLoading } = useTasks({ completed: filter === 'open' ? '0' : '1' });
  const { data: prospects } = useProspects();
  const { data: deals } = useDeals();
  const createMutation = useCreateTask();
  const toggleMutation = useToggleTaskComplete();
  const deleteMutation = useDeleteTask();

  const isOverdue = (t: Task) => !t.completed && new Date(t.due_date) < new Date();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} /> New Task
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter('open')}
          className={`px-4 py-2 text-sm font-medium rounded-lg ${filter === 'open' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Open
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 text-sm font-medium rounded-lg ${filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Completed
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : !tasks?.length ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg font-medium">No {filter} tasks</p>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((t: Task) => (
            <div
              key={t.id}
              className={`flex items-center gap-3 bg-white rounded-lg shadow-sm border p-4 ${
                isOverdue(t) ? 'border-red-300 bg-red-50/50' : 'border-gray-200'
              }`}
            >
              <button
                onClick={() => toggleMutation.mutate(t.id, { onSuccess: () => toast.success(t.completed ? 'Reopened' : 'Completed') })}
                className="flex-shrink-0"
              >
                {t.completed ? (
                  <CheckCircle2 size={20} className="text-green-500" />
                ) : (
                  <Circle size={20} className="text-gray-300 hover:text-blue-500" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${t.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                    {t.title}
                  </span>
                  <Badge className={PRIORITY_COLORS[t.priority]}>{t.priority}</Badge>
                </div>
                {t.prospect_name && (
                  <p className="text-xs text-gray-400 mt-0.5">{t.prospect_name}</p>
                )}
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {isOverdue(t) && <AlertCircle size={16} className="text-red-500" />}
                <span className={`text-xs ${isOverdue(t) ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                  {formatDate(t.due_date)}
                </span>
                <button
                  onClick={() => deleteMutation.mutate(t.id, { onSuccess: () => toast.success('Task deleted') })}
                  className="text-xs text-gray-400 hover:text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="New Task">
        <TaskCreateForm
          prospects={prospects || []}
          deals={deals || []}
          onSubmit={data => {
            createMutation.mutate(data, {
              onSuccess: () => { setShowCreate(false); toast.success('Task created'); },
            });
          }}
          onCancel={() => setShowCreate(false)}
        />
      </Modal>
    </div>
  );
}

function TaskCreateForm({ prospects, deals, onSubmit, onCancel }: {
  prospects: any[];
  deals: any[];
  onSubmit: (data: Partial<Task>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    title: '',
    prospect_id: '',
    deal_id: '',
    due_date: new Date().toISOString().split('T')[0],
    priority: 'medium',
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
          prospect_id: form.prospect_id ? Number(form.prospect_id) : undefined,
          deal_id: form.deal_id ? Number(form.deal_id) : undefined,
        } as any);
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input className={inputCls} value={form.title} onChange={set('title')} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
          <input className={inputCls} type="date" value={form.due_date} onChange={set('due_date')} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select className={inputCls} value={form.priority} onChange={set('priority')}>
            {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prospect</label>
          <select className={inputCls} value={form.prospect_id} onChange={set('prospect_id')}>
            <option value="">None</option>
            {prospects.map((p: any) => <option key={p.id} value={p.id}>{p.company_name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deal</label>
          <select className={inputCls} value={form.deal_id} onChange={set('deal_id')}>
            <option value="">None</option>
            {deals.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea className={inputCls} rows={2} value={form.notes} onChange={set('notes')} />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">Create Task</button>
      </div>
    </form>
  );
}
