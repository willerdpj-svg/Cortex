import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { useDeal, useStageHistory, useUpdateDeal } from '../hooks/useDeals';
import { useActivities } from '../hooks/useActivities';
import StageHistory from '../components/deals/StageHistory';
import ActivityTimeline from '../components/activities/ActivityTimeline';
import Badge from '../components/ui/Badge';
import { formatRands, formatDate } from '../lib/format';
import { STAGE_COLORS, DEAL_STAGES } from '../lib/constants';
import toast from 'react-hot-toast';
import { useState } from 'react';
import Modal from '../components/ui/Modal';

export default function DealDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dealId = Number(id);

  const { data: deal, isLoading } = useDeal(dealId);
  const { data: history } = useStageHistory(dealId);
  const { data: activities } = useActivities(deal ? { prospect_id: String(deal.prospect_id) } : undefined);
  const updateMutation = useUpdateDeal();
  const [showEdit, setShowEdit] = useState(false);

  if (isLoading) return <div className="p-6 text-gray-500">Loading...</div>;
  if (!deal) return <div className="p-6 text-gray-500">Deal not found</div>;

  const d = deal as any;

  return (
    <div className="p-6">
      <button onClick={() => navigate('/pipeline')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft size={16} /> Back to Pipeline
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{d.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={STAGE_COLORS[d.stage] || 'bg-gray-100 text-gray-700'}>{d.stage}</Badge>
            <span className="text-sm text-gray-500">{d.prospect_name}</span>
          </div>
        </div>
        <button onClick={() => setShowEdit(true)} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
          <Edit2 size={16} /> Edit
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Deal Details</h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div><span className="text-gray-500">Monthly Value:</span> <span className="ml-2 font-semibold text-gray-900">{formatRands(d.monthly_value)}</span></div>
              <div><span className="text-gray-500">Expected Close:</span> <span className="ml-2 text-gray-900">{formatDate(d.expected_close)}</span></div>
              <div><span className="text-gray-500">Decision Maker:</span> <span className="ml-2 text-gray-900">{d.decision_maker || '—'}</span></div>
              <div><span className="text-gray-500">Champion:</span> <span className="ml-2 text-gray-900">{d.champion || '—'}</span></div>
              <div><span className="text-gray-500">Services:</span> <span className="ml-2 text-gray-900">{d.services || '—'}</span></div>
              <div><span className="text-gray-500">Created:</span> <span className="ml-2 text-gray-900">{formatDate(d.created_at)}</span></div>
              <div className="col-span-2"><span className="text-gray-500">Next Step:</span> <p className="mt-1 text-gray-900">{d.next_step || '—'}</p></div>
              <div className="col-span-2"><span className="text-gray-500">Notes:</span> <p className="mt-1 text-gray-900">{d.notes || '—'}</p></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Related Activities</h2>
            <ActivityTimeline activities={activities || []} />
          </div>
        </div>

        <div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Stage History</h2>
            <StageHistory history={history || []} />
          </div>
        </div>
      </div>

      <Modal open={showEdit} onClose={() => setShowEdit(false)} title="Edit Deal" wide>
        <form
          onSubmit={e => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const data: Record<string, unknown> = {};
            fd.forEach((v, k) => { data[k] = v; });
            if (data.monthly_value) data.monthly_value = Number(data.monthly_value);
            updateMutation.mutate({ id: dealId, ...data } as any, {
              onSuccess: () => { setShowEdit(false); toast.success('Deal updated'); },
            });
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deal Name</label>
              <input name="name" defaultValue={d.name} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Value (R)</label>
              <input name="monthly_value" type="number" defaultValue={d.monthly_value} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Decision Maker</label>
              <input name="decision_maker" defaultValue={d.decision_maker || ''} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Champion</label>
              <input name="champion" defaultValue={d.champion || ''} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Services</label>
              <input name="services" defaultValue={d.services || ''} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Close</label>
              <input name="expected_close" type="date" defaultValue={d.expected_close || ''} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Next Step</label>
            <input name="next_step" defaultValue={d.next_step || ''} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea name="notes" rows={2} defaultValue={d.notes || ''} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowEdit(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">Update Deal</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
