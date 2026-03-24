import { useState } from 'react';
import { useActivities, useCreateActivity } from '../hooks/useActivities';
import { useProspects } from '../hooks/useProspects';
import ActivityTimeline from '../components/activities/ActivityTimeline';
import ActivityForm from '../components/activities/ActivityForm';
import Modal from '../components/ui/Modal';
import { ACTIVITY_TYPES } from '../lib/constants';
import { Plus } from 'lucide-react';
import type { Activity } from '../types';
import toast from 'react-hot-toast';

export default function ActivitiesPage() {
  const [typeFilter, setTypeFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState('');

  const params: Record<string, string> = {};
  if (typeFilter) params.type = typeFilter;
  const { data: activities, isLoading } = useActivities(params);
  const { data: prospects } = useProspects();
  const createMutation = useCreateActivity();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Activities</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} /> Log Activity
        </button>
      </div>

      <div className="flex gap-3 mb-4">
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="">All Types</option>
          {ACTIVITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : (
        <ActivityTimeline activities={activities || []} />
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Log Activity">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Prospect *</label>
          <select
            value={selectedProspect}
            onChange={e => setSelectedProspect(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            required
          >
            <option value="">Select prospect...</option>
            {prospects?.map((p: any) => (
              <option key={p.id} value={p.id}>{p.company_name}</option>
            ))}
          </select>
        </div>
        {selectedProspect && (
          <ActivityForm
            prospectId={Number(selectedProspect)}
            onSubmit={(data: Partial<Activity>) => {
              createMutation.mutate(data, {
                onSuccess: () => {
                  setShowCreate(false);
                  setSelectedProspect('');
                  toast.success('Activity logged');
                },
              });
            }}
            onCancel={() => setShowCreate(false)}
          />
        )}
      </Modal>
    </div>
  );
}
