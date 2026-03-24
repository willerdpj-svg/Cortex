import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Kanban, Activity, CheckSquare, LogOut } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/prospects', icon: Users, label: 'Prospects' },
  { to: '/pipeline', icon: Kanban, label: 'Pipeline' },
  { to: '/activities', icon: Activity, label: 'Activities' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
];

export default function Sidebar() {
  const { user, signOut } = useAuth();

  return (
    <aside className="w-60 bg-slate-900 text-white flex flex-col min-h-screen">
      <div className="px-6 py-5 border-b border-slate-700">
        <h1 className="text-xl font-bold tracking-wide">Cortex</h1>
        <p className="text-xs text-slate-400 mt-0.5">Coruscate CRM</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-slate-700">
        <p className="px-3 text-xs text-slate-400 truncate mb-2">{user?.email}</p>
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors w-full"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
