import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit2, Target } from 'lucide-react';
import { useProspect, useUpdateProspect, useUpdateIcpScores } from '../hooks/useProspects';
import { useActivities, useCreateActivity } from '../hooks/useActivities';
import { useDeals } from '../hooks/useDeals';
import { useTasks } from '../hooks/useTasks';
import IcpScoreBadge from '../components/prospects/IcpScoreBadge';
import IcpScoreForm from '../components/prospects/IcpScoreForm';
import ProspectForm from '../components/prospects/ProspectForm';
import ActivityTimeline from '../components/activities/ActivityTimeline';
import ActivityForm from '../components/activities/ActivityForm';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import { formatRands, formatDate } from '../lib/format';
import { STAGE_COLORS } from '../lib/constants';
import type { Prospect, Activity } from '../types';
import toast from 'react-hot-toast';

export default function ProspectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const prospectId = Number(id);

  const { data: prospect, isLoading } = useProspect(prospectId);
  const { data: activities } = useActivities({ prospect_id: String(prospectId) });
  const { data: deals } = useDeals({ prospect_id: String(prospectId) });
  const { data: tasks } = useTasks({ prospect_id: String(prospectId) });

  const updateMutation = useUpdateProspect();
  const icpMutation = useUpdateIcpScores();
  const createActivityMutation = useCreateActivity();

  const [tab, setTab] = useState<'details' | 'activities' | 'deals' | 'tasks'>('details');
  const [showEdit, setShowEdit] = useState(false);
  const [showIcp, setShowIcp] = useState(false);
  const [showLogActivity, setShowLogActivity] = useState(false);

  if (isLoading) return <div className="p-6 text-gray-500">Loading...</div>;
  if (!prospect) return <div className="p-6 text-gray-500">Prospect not found</div>;

  const p = prospect as Prospect;
  const tabs = [
    { key: 'details', label: 'Details' },
    { key: 'activities', label: `Activities (${activities?.length || 0})` },
    { key: 'deals', label: `Deals (${deals?.length || 0})` },
    { key: 'tasks', label: `Tasks (${tasks?.length || 0})` },
  ] as const;

  return (
    <div className="p-6">
      <button onClick={() => navigate('/prospects')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft size={16} /> Back to Prospects
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{p.company_name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge className="bg-slate-100 text-slate-700">{p.company_type}</Badge>
            <IcpScoreBadge score={p.icp_score} />
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowIcp(true)} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Target size={16} /> ICP Score
          </button>
          <button onClick={() => setShowEdit(true)} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Edit2 size={16} /> Edit
          </button>
        </div>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-6">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'details' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <div><span className="text-gray-500">Contact:</span> <span className="ml-2 text-gray-900">{p.contact_name || '—'}</span></div>
            <div><span className="text-gray-500">Role:</span> <span className="ml-2 text-gray-900">{p.contact_role || '—'}</span></div>
            <div><span className="text-gray-500">Email:</span> <span className="ml-2 text-gray-900">{p.email || '—'}</span></div>
            <div><span className="text-gray-500">Phone:</span> <span className="ml-2 text-gray-900">{p.phone || '—'}</span></div>
            <div><span className="text-gray-500">LinkedIn:</span> <span className="ml-2 text-gray-900">{p.linkedin_url || '—'}</span></div>
            <div><span className="text-gray-500">Estimated AUM:</span> <span className="ml-2 text-gray-900">{formatRands(p.estimated_aum)}</span></div>
            <div><span className="text-gray-500">Current Solution:</span> <span className="ml-2 text-gray-900">{p.current_solution || '—'}</span></div>
            <div><span className="text-gray-500">Source:</span> <span className="ml-2 text-gray-900">{p.source || '—'}</span></div>
            <div className="col-span-2"><span className="text-gray-500">Pain Points:</span> <p className="mt-1 text-gray-900">{p.pain_points || '—'}</p></div>
            <div className="col-span-2"><span className="text-gray-500">Notes:</span> <p className="mt-1 text-gray-900">{p.notes || '—'}</p></div>
          </div>
        </div>
      )}

      {tab === 'activities' && (
        <div>
          <button
            onClick={() => setShowLogActivity(true)}
            className="mb-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Log Activity
          </button>
          <ActivityTimeline activities={activities || []} />
        </div>
      )}

      {tab === 'deals' && (
        <div className="space-y-3">
          {!deals?.length ? (
            <p className="text-gray-400 text-sm">No deals linked to this prospect</p>
          ) : deals.map((d: any) => (
            <Link
              key={d.id}
              to={`/deals/${d.id}`}
              className="block bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:border-blue-300"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">{d.name}</span>
                <Badge className={STAGE_COLORS[d.stage] || 'bg-gray-100 text-gray-700'}>{d.stage}</Badge>
              </div>
              <p className="text-sm text-gray-500 mt-1">{formatRands(d.monthly_value)}/mo</p>
            </Link>
          ))}
        </div>
      )}

      {tab === 'tasks' && (
        <div className="space-y-2">
          {!tasks?.length ? (
            <p className="text-gray-400 text-sm">No tasks linked to this prospect</p>
          ) : tasks.map((t: any) => (
            <div key={t.id} className={`bg-white rounded-lg shadow-sm border p-3 ${t.completed ? 'opacity-50' : ''} ${!t.completed && new Date(t.due_date) < new Date() ? 'border-red-300' : 'border-gray-200'}`}>
              <div className="flex justify-between">
                <span className={`text-sm ${t.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>{t.title}</span>
                <span className="text-xs text-gray-500">{formatDate(t.due_date)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showEdit} onClose={() => setShowEdit(false)} title="Edit Prospect" wide>
        <ProspectForm
          initial={p}
          onSubmit={data => {
            updateMutation.mutate({ id: p.id, ...data } as any, {
              onSuccess: () => { setShowEdit(false); toast.success('Prospect updated'); },
            });
          }}
          onCancel={() => setShowEdit(false)}
        />
      </Modal>

      <Modal open={showIcp} onClose={() => setShowIcp(false)} title="ICP Scoring">
        <IcpScoreForm
          prospect={p}
          onSubmit={scores => {
            icpMutation.mutate({ id: p.id, scores }, {
              onSuccess: () => { setShowIcp(false); toast.success('ICP scores updated'); },
            });
          }}
          onCancel={() => setShowIcp(false)}
        />
      </Modal>

      <Modal open={showLogActivity} onClose={() => setShowLogActivity(false)} title="Log Activity">
        <ActivityForm
          prospectId={prospectId}
          onSubmit={(data: Partial<Activity>) => {
            createActivityMutation.mutate(data, {
              onSuccess: () => { setShowLogActivity(false); toast.success('Activity logged'); },
            });
          }}
          onCancel={() => setShowLogActivity(false)}
        />
      </Modal>
    </div>
  );
}
