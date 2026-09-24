import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TopProgressBar } from '../common/TopProgressBar';
import { AdminLogin } from './AdminLogin';
import { AdminOverview } from './AdminOverview';
import { AdminEditionsEvents } from './AdminEditionsEvents';
import { AdminCategories } from './AdminCategories';
import { AdminNominees } from './AdminNominees';
import { AdminVotingSettings } from './AdminVotingSettings';
import { AdminTransactions } from './AdminTransactions';
import { AdminResults } from './AdminResults';
import { AdminContentManager } from './AdminContentManager';
import { AdminTickets } from './AdminTickets';
import { AdminUsers } from './AdminUsers';
import { AdminSettings } from './AdminSettings';

import {
  LayoutDashboard,
  Calendar,
  Layers,
  Users,
  Sliders,
  CreditCard,
  Award,
  FileText,
  Ticket,
  UserCheck,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';

interface AdminDashboardProps {
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExitAdmin }) => {
  const { currentUser, logout, siteContent, themeMode, toggleThemeMode } = useApp();
  const [adminTab, setAdminTab] = useState<string>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!currentUser) {
    return <AdminLogin onSuccess={() => setAdminTab('overview')} onExit={onExitAdmin} />;
  }

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'editions-events', label: 'Editions & Events', icon: Calendar },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'nominees', label: 'Nominees & Approvals', icon: Users },
    { id: 'voting-settings', label: 'Voting & Bundles', icon: Sliders },
    { id: 'transactions', label: 'Ledger & Transactions', icon: CreditCard },
    { id: 'results', label: 'Results Certification', icon: Award },
    { id: 'content-manager', label: 'Content & CMS', icon: FileText },
    { id: 'tickets', label: 'Tickets & Sales', icon: Ticket },
    { id: 'users', label: 'Users & Roles', icon: UserCheck },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    onExitAdmin();
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex flex-col md:flex-row relative">
      <TopProgressBar activeTab={adminTab} />
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#0B0B0B] text-white px-4 py-3 flex items-center justify-between border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#F2A01F]" />
          <span className="font-serif font-bold text-sm tracking-wide">
            {siteContent.brandName || 'IAA'} Admin
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleThemeMode}
            className="p-1.5 rounded text-neutral-300 hover:text-white border border-white/10"
            title={themeMode === 'dark' ? 'Switch to Light Sand Mode' : 'Switch to High-Contrast Dark Mode'}
          >
            {themeMode === 'dark' ? <Sun className="w-4 h-4 text-[#F2A01F]" /> : <Moon className="w-4 h-4 text-neutral-300" />}
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded text-neutral-300 hover:text-white"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`w-64 bg-[#0B0B0B] text-[#FAF8F4] flex flex-col justify-between shrink-0 border-r border-[#C9971C]/20 transition-all ${
          sidebarOpen ? 'block' : 'hidden md:flex'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="p-5 border-b border-white/10 flex items-center gap-3">
            {siteContent.logoUrl ? (
              <img
                src={siteContent.logoUrl}
                alt="IAA"
                className="h-9 w-auto max-w-[120px] object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/iaa-logo.svg';
                }}
              />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#E8471C] to-[#C9971C] flex items-center justify-center font-serif font-bold text-sm text-white">
                IAA
              </div>
            )}
            <div>
              <span className="font-serif font-bold text-xs tracking-wider block text-white truncate max-w-[120px]">
                {siteContent.brandName || 'Admin Command'}
              </span>
              <span className="text-[10px] text-[#F2A01F] font-mono block">
                Command Center
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 text-xs">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = adminTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setAdminTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors text-left font-medium ${
                    isActive
                      ? 'bg-[#E8471C] text-white font-bold shadow'
                      : 'text-[#FAF8F4]/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer with User info & logout */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center font-bold text-xs border border-[#C9971C]/40">
              {currentUser.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-bold text-xs text-white block truncate">{currentUser.name}</span>
              <span className="text-[10px] text-[#F2A01F] uppercase font-bold tracking-wider block">
                {currentUser.role.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="pt-1">
            <button
              onClick={toggleThemeMode}
              className={`w-full py-2 px-2.5 rounded-lg border text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                themeMode === 'dark'
                  ? 'bg-amber-500/10 border-amber-500/30 text-[#F2A01F] hover:bg-amber-500/20'
                  : 'bg-white/5 border-white/10 text-neutral-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="flex items-center gap-1.5 text-[11px]">
                {themeMode === 'dark' ? <Sun className="w-3.5 h-3.5 text-[#F2A01F]" /> : <Moon className="w-3.5 h-3.5 text-neutral-300" />}
                <span>{themeMode === 'dark' ? 'High-Contrast Dark' : 'Light Sand Mode'}</span>
              </span>
              <span className="text-[10px] uppercase font-mono text-neutral-400">Toggle</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={onExitAdmin}
              className="py-1.5 px-2 bg-white/5 hover:bg-white/10 text-[11px] text-neutral-300 hover:text-white rounded border border-white/10 flex items-center justify-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              Live Site
            </button>
            <button
              onClick={handleLogout}
              className="py-1.5 px-2 bg-red-950/40 hover:bg-red-900/60 text-[11px] text-red-400 hover:text-red-200 rounded border border-red-800/40 flex items-center justify-center gap-1"
            >
              <LogOut className="w-3 h-3" />
              Exit
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content View */}
      <main className="flex-1 p-5 sm:p-8 lg:p-10 max-h-screen overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {adminTab === 'overview' && <AdminOverview />}
          {adminTab === 'editions-events' && <AdminEditionsEvents />}
          {adminTab === 'categories' && <AdminCategories />}
          {adminTab === 'nominees' && <AdminNominees />}
          {adminTab === 'voting-settings' && <AdminVotingSettings />}
          {adminTab === 'transactions' && <AdminTransactions />}
          {adminTab === 'results' && <AdminResults />}
          {adminTab === 'content-manager' && <AdminContentManager />}
          {adminTab === 'tickets' && <AdminTickets />}
          {adminTab === 'users' && <AdminUsers />}
          {adminTab === 'settings' && <AdminSettings />}
        </div>
      </main>
    </div>
  );
};
