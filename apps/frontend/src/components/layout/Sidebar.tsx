import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  DollarSign,
  Users,
  ThumbsUp,
  Activity,
  UserCircle,
  BarChart2,
  Calendar,
  MessagesSquare,
  Mail,
  Phone,
  UserCog,
  Store,
  Settings,
  FileText,
  HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItem {
  label: string;
  icon: React.ElementType;
  href: string;
  section?: string;
}

const sidebarItems: { section: string; items: SidebarItem[] }[] = [
  {
    section: 'QUICK ACCESS',
    items: [
      { label: 'Revenue', icon: DollarSign, href: '/admin/revenue' },
      { label: 'Active Patients', icon: Users, href: '/admin/patients' },
      { label: 'Patient Satisfaction', icon: ThumbsUp, href: '/admin/satisfaction' },
      { label: 'Treatment Success', icon: Activity, href: '/admin/treatments' },
      { label: 'Demographics', icon: UserCircle, href: '/admin/demographics' },
      { label: 'Monthly Reports', icon: BarChart2, href: '/admin/reports' },
      { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
      { label: 'AI Consultant', icon: HelpCircle, href: '/admin/ai' },
    ],
  },
  {
    section: 'CORE',
    items: [
      { label: 'Patients', icon: Users, href: '/admin/patients-list' },
      { label: 'Appointments', icon: Calendar, href: '/admin/appointments' },
      { label: 'Analytics', icon: BarChart2, href: '/admin/analytics' },
      { label: 'Staff', icon: Users, href: '/admin/staff' },
      { label: 'HR', icon: UserCog, href: '/admin/hr' },
      { label: 'Membership Plans', icon: FileText, href: '/admin/plans' },
    ],
  },
  {
    section: 'COMMUNICATIONS',
    items: [
      { label: 'SMS Campaigns', icon: MessagesSquare, href: '/admin/sms' },
      { label: 'Email Campaigns', icon: Mail, href: '/admin/email' },
      { label: 'Voice Campaigns', icon: Phone, href: '/admin/voice' },
    ],
  },
  {
    section: 'SYSTEM',
    items: [
      { label: 'Contact Manager', icon: UserCircle, href: '/admin/contacts' },
      { label: 'Marketplace', icon: Store, href: '/admin/marketplace' },
      { label: 'Settings', icon: Settings, href: '/admin/settings' },
    ],
  },
  {
    section: 'RESOURCES',
    items: [
      { label: 'Resources', icon: HelpCircle, href: '/admin/resources' },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link to="/admin" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-[#1B2B85]">NGenius Dental</span>
        </Link>
        <div className="text-xs text-gray-500 mt-1">Powered by NGenius Pros</div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        {sidebarItems.map((section, index) => (
          <div key={section.section} className={cn('mb-6', index === 0 && 'mt-2')}>
            <div className="px-6 mb-2">
              <h3 className="text-xs font-semibold text-gray-500">{section.section}</h3>
            </div>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={cn(
                      'flex items-center px-6 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'text-[#1B2B85] bg-[#1B2B85]/5'
                        : 'text-gray-600 hover:text-[#1B2B85] hover:bg-[#1B2B85]/5'
                    )}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};