import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Target, Activity, AlertTriangle, CheckSquare } from 'lucide-react';
import { usePipelineSummary, useWonRevenue, useWinRate, useActivityCount, useStaleDeals, useUpcomingTasks } from '../hooks/useDashboard';
import Badge from '../components/ui/Badge';
import { formatRands, formatDate } from '../lib/format';
import { STAGE_COLORS } from '../lib/constants';

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string; sub?: string; color: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon size={20} />
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium">{label}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
          {sub && <p className="text-xs text-gray-400">{sub}</p>}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: pipeline } = usePipelineSummary();
  const { data: won } = useWonRevenue();
  const { data: winRate } = useWinRate();
  const { data: activityCount } = useActivityCount();
  const { data: staleDeals } = useStaleDeals();
  const { data: upcomingTasks } = useUpcomingTasks();

  const chartData = pipeline?.stages.map(s => ({
    name: s.stage.replace('Closed ', 'C.'),
    value: s.total_value || 0,
    count: s.count,
  })) || [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-5 gap-4 mb-6">
        <StatCard
          icon={TrendingUp}
          label="Pipeline Value"
          value={formatRands(pipeline?.totalValue || 0)}
          sub={`${formatRands(pipeline?.weightedValue || 0)} weighted`}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={DollarSign}
          label="Won Revenue"
          value={formatRands(won?.total || 0)}
          sub={`${won?.count || 0} deals`}
          color="bg-green-50 text-green-600"
        />
        <StatCard
          icon={Target}
          label="Win Rate"
          value={`${winRate?.rate || 0}%`}
          sub={`${winRate?.won || 0} of ${winRate?.closed || 0} closed`}
          color="bg-purple-50 text-purple-600"
        />
        <StatCard
          icon={Activity}
          label="Weekly Activities"
          value={`${activityCount?.count || 0} / ${activityCount?.target || 20}`}
          sub={`Target: ${activityCount?.target || 20}/week`}
          color="bg-orange-50 text-orange-600"
        />
        <StatCard
          icon={AlertTriangle}
          label="Stale Deals"
          value={String(staleDeals?.length || 0)}
          sub="14+ days inactive"
          color="bg-red-50 text-red-600"
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Pipeline by Stage</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `R${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value: number) => formatRands(value)} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-sm text-center py-12">No pipeline data yet</p>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Stale Deals</h2>
            {!staleDeals?.length ? (
              <p className="text-gray-400 text-sm">No stale deals</p>
            ) : (
              <div className="space-y-2">
                {staleDeals.slice(0, 5).map((d: any) => (
                  <Link key={d.id} to={`/deals/${d.id}`} className="block p-2 rounded-lg hover:bg-gray-50">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-900 font-medium truncate">{d.name}</span>
                      <span className="text-xs text-red-500">{d.days_stale}d</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-400">{d.prospect_name}</span>
                      <Badge className={STAGE_COLORS[d.stage] || 'bg-gray-100 text-gray-700'}>{d.stage}</Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Upcoming Tasks</h2>
            {!upcomingTasks?.length ? (
              <p className="text-gray-400 text-sm">No upcoming tasks</p>
            ) : (
              <div className="space-y-2">
                {upcomingTasks.slice(0, 5).map((t: any) => (
                  <div key={t.id} className={`p-2 rounded-lg ${new Date(t.due_date) < new Date() ? 'bg-red-50' : ''}`}>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-900">{t.title}</span>
                      <span className={`text-xs ${new Date(t.due_date) < new Date() ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                        {formatDate(t.due_date)}
                      </span>
                    </div>
                    {t.prospect_name && <p className="text-xs text-gray-400">{t.prospect_name}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
