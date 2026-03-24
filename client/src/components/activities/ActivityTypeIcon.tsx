import { Phone, Mail, Users, Linkedin, FileText, Monitor, RefreshCw, Building2 } from 'lucide-react';

const ICONS: Record<string, React.ElementType> = {
  'Call': Phone,
  'Email': Mail,
  'Meeting': Users,
  'LinkedIn': Linkedin,
  'Proposal Sent': FileText,
  'Demo': Monitor,
  'Follow-up': RefreshCw,
  'Internal': Building2,
};

const COLORS: Record<string, string> = {
  'Call': 'text-green-600 bg-green-50',
  'Email': 'text-blue-600 bg-blue-50',
  'Meeting': 'text-purple-600 bg-purple-50',
  'LinkedIn': 'text-sky-600 bg-sky-50',
  'Proposal Sent': 'text-orange-600 bg-orange-50',
  'Demo': 'text-indigo-600 bg-indigo-50',
  'Follow-up': 'text-yellow-600 bg-yellow-50',
  'Internal': 'text-gray-600 bg-gray-50',
};

export default function ActivityTypeIcon({ type }: { type: string }) {
  const Icon = ICONS[type] || Building2;
  const color = COLORS[type] || 'text-gray-600 bg-gray-50';
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${color}`}>
      <Icon size={16} />
    </div>
  );
}
