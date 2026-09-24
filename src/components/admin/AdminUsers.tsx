import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminUser, UserRole } from '../../types';
import { Users, Plus, Trash2, Shield, UserCheck, Key, Lock } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const { adminUsers, setAdminUsers, currentUser } = useApp();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<AdminUser>>({
    role: 'staff'
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    const newUser: AdminUser = {
      id: `usr-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      role: (formData.role as UserRole) || 'staff',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    setAdminUsers([...adminUsers, newUser]);
    setIsCreating(false);
    setFormData({ role: 'staff' });
  };

  const handleDeleteUser = (id: string) => {
    if (id === currentUser?.id) {
      alert('You cannot delete your own active session account.');
      return;
    }
    if (confirm('Revoke all dashboard credentials for this administrator?')) {
      setAdminUsers(adminUsers.filter(u => u.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif font-bold text-xl text-[#0B0B0B]">Administrative Access & Role Governance</h3>
          <p className="text-xs text-neutral-500">Manage super admins, jury staff managers, and read-only audit observers.</p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="px-3.5 py-2 bg-[#E8471C] hover:bg-[#c93912] text-white text-xs font-bold uppercase rounded-md flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Personnel
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreateUser} className="bg-white p-6 rounded-xl border-2 border-[#E8471C] shadow-md space-y-4 text-xs">
          <h4 className="font-serif font-bold text-base text-[#0B0B0B]">Invite Administrative User</h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-neutral-600 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block font-bold text-neutral-600 mb-1">Official Email</label>
              <input
                type="email"
                required
                value={formData.email || ''}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block font-bold text-neutral-600 mb-1">Access Role</label>
              <select
                value={formData.role || 'staff'}
                onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
                className="w-full border rounded p-2 bg-white"
              >
                <option value="super_admin">Super Admin (Full Read/Write/Delete/Publish)</option>
                <option value="staff">Staff (Content & Nominee Management)</option>
                <option value="viewer">Auditor / Viewer (Read-Only Ledger & Results)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 border rounded font-semibold text-neutral-600 hover:bg-neutral-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#E8471C] text-white rounded font-bold uppercase hover:bg-[#c93912]"
            >
              Issue Access
            </button>
          </div>
        </form>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50 border-b text-neutral-500 font-semibold uppercase text-[10px]">
            <tr>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Permissions</th>
              <th className="py-3 px-4">Last Activity</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {adminUsers.map(user => {
              const isSelf = user.id === currentUser?.id;
              let roleBadge = (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-neutral-100 text-neutral-700">
                  Viewer
                </span>
              );
              if (user.role === 'super_admin') {
                roleBadge = (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-800">
                    Super Admin
                  </span>
                );
              } else if (user.role === 'staff') {
                roleBadge = (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                    Staff
                  </span>
                );
              }

              return (
                <tr key={user.id} className="hover:bg-neutral-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#0B0B0B] text-white flex items-center justify-center font-bold text-xs">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-neutral-900 block">
                          {user.name} {isSelf && <span className="text-[#E8471C] text-[10px] font-bold">(You)</span>}
                        </span>
                        <span className="text-[11px] text-neutral-400">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">{roleBadge}</td>
                  <td className="py-3 px-4 text-neutral-600 text-[11px]">
                    {user.role === 'super_admin' && 'Full platform control, gateway secrets, deletion rights'}
                    {user.role === 'staff' && 'Create/edit categories, nominees, blogs, event schedules'}
                    {user.role === 'viewer' && 'Audit transactions, view certified tallies & exports only'}
                  </td>
                  <td className="py-3 px-4 text-neutral-400 text-[11px]">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {!isSelf && (
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-1 hover:bg-red-50 text-red-600 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
