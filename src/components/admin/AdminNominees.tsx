import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Nominee } from '../../types';
import { MediaUpload } from '../common/MediaUpload';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, Star, Search, Filter, Image as ImageIcon } from 'lucide-react';

export const AdminNominees: React.FC = () => {
  const { nominees, setNominees, categories, editions } = useApp();
  const [editingNominee, setEditingNominee] = useState<Nominee | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [formData, setFormData] = useState<Partial<Nominee>>({
    socials: {}
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNominee) {
      setNominees(nominees.map(n => n.id === editingNominee.id ? { ...editingNominee, ...formData } as Nominee : n));
      setEditingNominee(null);
    } else if (isCreating) {
      const newNom: Nominee = {
        id: `nom-${Date.now()}`,
        name: formData.name || 'New Candidate',
        stageName: formData.stageName || '',
        categoryId: formData.categoryId || categories[0]?.id || 'cat-fashion-designer',
        editionId: formData.editionId || editions[0]?.id || 'ed-7',
        photoUrl: formData.photoUrl || '/src/assets/images/nominee_fashion_designer_1790253812536.jpg',
        bio: formData.bio || '',
        country: formData.country || 'Nigeria',
        socials: {
          instagram: formData.socials?.instagram || '',
          twitter: formData.socials?.twitter || '',
          website: formData.socials?.website || ''
        },
        votesCount: Number(formData.votesCount) || 0,
        status: (formData.status as any) || 'approved',
        featured: Boolean(formData.featured),
      };
      setNominees([newNom, ...nominees]);
      setIsCreating(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Permanently remove this nominee from the ballot?')) {
      setNominees(nominees.filter(n => n.id !== id));
    }
  };

  const toggleApproval = (id: string) => {
    setNominees(nominees.map(n => n.id === id ? { ...n, status: n.status === 'approved' ? 'rejected' : 'approved' } : n));
  };

  const toggleFeatured = (id: string) => {
    setNominees(nominees.map(n => n.id === id ? { ...n, featured: !n.featured } : n));
  };

  const filtered = nominees.filter(n => {
    if (categoryFilter !== 'all' && n.categoryId !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        n.name.toLowerCase().includes(q) ||
        n.stageName?.toLowerCase().includes(q) ||
        n.country.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif font-bold text-xl text-[#0B0B0B]">Nominees Directory & Ballot Roster</h3>
          <p className="text-xs text-neutral-500">Add candidates, configure bios & photos, approve nominations, and monitor tallies.</p>
        </div>
        <button
          onClick={() => {
            setFormData({
              name: '',
              stageName: '',
              categoryId: categories[0]?.id,
              editionId: editions[0]?.id,
              country: 'Nigeria',
              photoUrl: '/src/assets/images/nominee_fashion_designer_1790253812536.jpg',
              bio: '',
              votesCount: 0,
              status: 'approved',
              featured: false,
              socials: { instagram: '@', twitter: '@' }
            });
            setIsCreating(true);
          }}
          className="px-3.5 py-2 bg-[#E8471C] hover:bg-[#c93912] text-white text-xs font-bold uppercase rounded-md flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Nominee
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by candidate name or country..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs"
        >
          <option value="all">All Categories ({nominees.length})</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Create / Edit Modal Form */}
      {(isCreating || editingNominee) && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-xl border-2 border-[#E8471C] shadow-lg space-y-4 text-xs">
          <h4 className="font-serif font-bold text-base text-[#0B0B0B]">
            {isCreating ? 'Register New Ballot Nominee' : `Edit Nominee: ${editingNominee?.name}`}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-neutral-600 mb-1">Legal Full Name</label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block font-bold text-neutral-600 mb-1">Stage / Brand Name</label>
              <input
                type="text"
                value={formData.stageName || ''}
                onChange={e => setFormData({ ...formData, stageName: e.target.value })}
                placeholder="Optional moniker"
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block font-bold text-neutral-600 mb-1">Country of Heritage</label>
              <input
                type="text"
                required
                value={formData.country || ''}
                onChange={e => setFormData({ ...formData, country: e.target.value })}
                placeholder="e.g. Nigeria, Ghana, South Africa"
                className="w-full border rounded p-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-neutral-600 mb-1">Assigned Category</label>
              <select
                value={formData.categoryId || categories[0]?.id}
                onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full border rounded p-2 bg-white"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-neutral-600 mb-1">Assigned Edition</label>
              <select
                value={formData.editionId || editions[0]?.id}
                onChange={e => setFormData({ ...formData, editionId: e.target.value })}
                className="w-full border rounded p-2 bg-white"
              >
                {editions.map(ed => (
                  <option key={ed.id} value={ed.id}>{ed.name} ({ed.year})</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <MediaUpload
              label="Nominee Official Portrait Photo"
              helperText="Upload the high-resolution headshot or press portrait of the candidate. Automatic compression optimizes it for ballot cards."
              value={formData.photoUrl || ''}
              onChange={(url) => setFormData({ ...formData, photoUrl: url })}
              aspectRatio="3:4"
              mediaType="image"
              required
              presets={[
                {
                  label: 'Amaka Eze (Haute Couture)',
                  url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
                  description: 'Fashion portrait'
                },
                {
                  label: 'Kofi Mensah (Runway Icon)',
                  url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
                  description: 'Male portrait'
                },
                {
                  label: 'Zuri Ndlovu (Textile Artistry)',
                  url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
                  description: 'Cultural design portrait'
                }
              ]}
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-600 mb-1">Artistic Biography & Achievements</label>
            <textarea
              rows={3}
              required
              value={formData.bio || ''}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
              className="w-full border rounded p-2"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-neutral-600 mb-1">Instagram Handle</label>
              <input
                type="text"
                value={formData.socials?.instagram || ''}
                onChange={e => setFormData({ ...formData, socials: { ...formData.socials, instagram: e.target.value } })}
                placeholder="@username"
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block font-bold text-neutral-600 mb-1">X / Twitter Handle</label>
              <input
                type="text"
                value={formData.socials?.twitter || ''}
                onChange={e => setFormData({ ...formData, socials: { ...formData.socials, twitter: e.target.value } })}
                placeholder="@username"
                className="w-full border rounded p-2"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.status !== 'rejected'}
                onChange={e => setFormData({ ...formData, status: e.target.checked ? 'approved' : 'rejected' })}
              />
              <span className="font-semibold text-neutral-800">Nomination Approved by Jury</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(formData.featured)}
                onChange={e => setFormData({ ...formData, featured: e.target.checked })}
              />
              <span className="font-semibold text-neutral-800">Feature on Homepage Spotlight</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200">
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingNominee(null);
              }}
              className="px-4 py-2 border rounded font-semibold text-neutral-600 hover:bg-neutral-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#E8471C] text-white rounded font-bold uppercase hover:bg-[#c93912]"
            >
              Save Nominee
            </button>
          </div>
        </form>
      )}

      {/* Nominees Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50 border-b text-neutral-500 font-semibold uppercase text-[10px]">
            <tr>
              <th className="py-3 px-4">Candidate</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Country</th>
              <th className="py-3 px-4">Votes</th>
              <th className="py-3 px-4">Approval</th>
              <th className="py-3 px-4">Featured</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {filtered.map(nom => {
              const cat = categories.find(c => c.id === nom.categoryId);

              return (
                <tr key={nom.id} className="hover:bg-neutral-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={nom.photoUrl}
                        alt={nom.name}
                        className="w-9 h-9 rounded-md object-cover border border-neutral-200"
                      />
                      <div>
                        <span className="font-bold text-neutral-900 block">{nom.stageName || nom.name}</span>
                        {nom.stageName && <span className="text-[11px] text-neutral-400">{nom.name}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-neutral-700 font-medium">{cat?.name}</td>
                  <td className="py-3 px-4 text-neutral-600">{nom.country}</td>
                  <td className="py-3 px-4 font-mono font-bold text-neutral-900">{nom.votesCount.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleApproval(nom.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                        nom.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {nom.status === 'approved' ? 'Approved' : 'Rejected'}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleFeatured(nom.id)}
                      className={`p-1 rounded ${nom.featured ? 'text-[#F2A01F]' : 'text-neutral-300'}`}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setEditingNominee(nom);
                        setFormData(nom);
                      }}
                      className="p-1 hover:bg-neutral-100 rounded text-neutral-600 mr-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(nom.id)}
                      className="p-1 hover:bg-red-50 rounded text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
