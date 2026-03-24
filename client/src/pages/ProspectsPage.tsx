import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { useProspects, useCreateProspect, useDeleteProspect } from '../hooks/useProspects';
import IcpScoreBadge from '../components/prospects/IcpScoreBadge';
import ProspectForm from '../components/prospects/ProspectForm';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Badge from '../components/ui/Badge';
import { formatRands, formatDate } from '../lib/format';
import { COMPANY_TYPES } from '../lib/constants';
import type { Prospect } from '../types';
import toast from 'react-hot-toast';

export default function ProspectsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sort, setSort] = useState('created_at');
  const [showCreate, setShowCreate] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const params: Record<string, string> = {};
  if (search) params.search = search;
  if (typeFilter) params.type = typeFilter;
  params.sort = sort;
  params.order = sort === 'icp_score' ? 'desc' : 'desc';

  const { data: prospects, isLoading } = useProspects(params);
  const createMutation = useCreateProspect();
  const deleteMutation = useDeleteProspect();

  const handleCreate = (data: Partial<Prospect>) => {
    createMutation.mutate(data, {
      onSuccess: () => { setShowCreate(false); toast.success('Prospect created'); },
    });
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => toast.success('Prospect deleted'),
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Prospects</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} /> Add Prospect
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Search prospects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="">All Types</option>
          {COMPANY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="created_at">Newest First</option>
          <option value="company_name">Company Name</option>
          <option value="icp_score">ICP Score</option>
        </select>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : !prospects?.length ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg font-medium">No prospects yet</p>
          <p className="text-sm mt-1">Click "Add Prospect" to get started</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Company</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Type</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Contact</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">AUM</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">ICP Score</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Added</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {prospects.map((p: Prospect) => (
                <tr
                  key={p.id}
                  onClick={() => navigate(`/prospects/${p.id}`)}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">{p.company_name}</td>
                  <td className="px-4 py-3">
                    <Badge className="bg-slate-100 text-slate-700">{p.company_type}</Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.contact_name || '—'}</td>
                  <td className="px-4 py-3 text-right text-gray-600">{p.estimated_aum ? formatRands(p.estimated_aum) : '—'}</td>
                  <td className="px-4 py-3"><IcpScoreBadge score={p.icp_score} /></td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(p.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={e => { e.stopPropagation(); setDeleteId(p.id); }}
                      className="text-gray-400 hover:text-red-500 text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="New Prospect" wide>
        <ProspectForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />
      </Modal>

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Prospect"
        message="This will permanently delete this prospect and all associated deals, activities, and tasks."
      />
    </div>
  );
}
