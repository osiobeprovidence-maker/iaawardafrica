import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Category } from '../../types';
import { Plus, Edit2, Trash2, Users, Award, CheckCircle2 } from 'lucide-react';

export const AdminCategories: React.FC = () => {
  const { categories, setCategories, nominees, editions, events } = useApp();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<Category>>({});

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      setCategories(categories.map(c => c.id === editingCategory.id ? { ...editingCategory, ...formData } as Category : c));
      setEditingCategory(null);
    } else if (isCreating) {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: formData.name || 'New Category',
        code: formData.code?.toUpperCase() || `CAT-${categories.length + 1}`,
        description: formData.description || '',
        editionId: formData.editionId || editions[0]?.id || 'ed-7',
        eventId: formData.eventId || events[0]?.id || 'evt-gala-2026',
        order: categories.length + 1,
        isActive: formData.isActive ?? true
      };
      setCategories([...categories, newCat]);
      setIsCreating(false);
    }
  };

  const handleDelete = (id: string) => {
    const count = nominees.filter(n => n.categoryId === id).length;
    if (count > 0) {
      if (!confirm(`This category has ${count} nominees attached. Deleting it may orphan these nominees. Proceed?`)) {
        return;
      }
    } else {
      if (!confirm('Are you sure you want to delete this category?')) return;
    }
    setCategories(categories.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif font-bold text-xl text-[#0B0B0B]">Award Categories</h3>
          <p className="text-xs text-neutral-500">Configure award divisions, assign them to events, and set ballot descriptions.</p>
        </div>
        <button
          onClick={() => {
            setFormData({
              name: '',
              code: `AC-${categories.length + 1}`,
              description: '',
              editionId: editions[0]?.id || 'ed-7',
              eventId: events[0]?.id || 'evt-gala-2026',
              isActive: true
            });
            setIsCreating(true);
          }}
          className="px-3.5 py-2 bg-[#E8471C] hover:bg-[#c93912] text-white text-xs font-bold uppercase rounded-md flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Category
        </button>
      </div>

      {/* Form */}
      {(isCreating || editingCategory) && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-xl border-2 border-[#E8471C] shadow-md space-y-4 text-xs">
          <h4 className="font-serif font-bold text-base text-[#0B0B0B]">
            {isCreating ? 'Create New Category' : `Edit ${editingCategory?.name}`}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-neutral-600 mb-1">Category Name</label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. African Cultural Fashion Designer of the Year"
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block font-bold text-neutral-600 mb-1">Category Code</label>
              <input
                type="text"
                required
                value={formData.code || ''}
                onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="AC-01"
                className="w-full border rounded p-2 font-mono uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-neutral-600 mb-1">Assign to Edition</label>
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
            <div>
              <label className="block font-bold text-neutral-600 mb-1">Assign to Gala Event</label>
              <select
                value={formData.eventId || events[0]?.id}
                onChange={e => setFormData({ ...formData, eventId: e.target.value })}
                className="w-full border rounded p-2 bg-white"
              >
                {events.map(ev => (
                  <option key={ev.id} value={ev.id}>{ev.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-neutral-600 mb-1">Curation Criteria & Description</label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the standards and artistic criteria for this category..."
              className="w-full border rounded p-2"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive ?? true}
              onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
            />
            <span className="font-semibold text-neutral-800">Category is Active for Public Voting</span>
          </label>

          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200">
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingCategory(null);
              }}
              className="px-4 py-2 border rounded font-semibold text-neutral-600 hover:bg-neutral-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#E8471C] text-white rounded font-bold uppercase hover:bg-[#c93912]"
            >
              Save Category
            </button>
          </div>
        </form>
      )}

      {/* Categories Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50 border-b text-neutral-500 font-semibold uppercase text-[10px]">
            <tr>
              <th className="py-3 px-4">Code</th>
              <th className="py-3 px-4">Category Name</th>
              <th className="py-3 px-4">Edition</th>
              <th className="py-3 px-4">Nominees</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {categories.map(cat => {
              const count = nominees.filter(n => n.categoryId === cat.id).length;
              const ed = editions.find(e => e.id === cat.editionId);

              return (
                <tr key={cat.id} className="hover:bg-neutral-50">
                  <td className="py-3 px-4 font-mono font-bold text-[#E8471C]">{cat.code}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-neutral-900 block">{cat.name}</span>
                    <span className="text-[11px] text-neutral-500 line-clamp-1">{cat.description}</span>
                  </td>
                  <td className="py-3 px-4 text-neutral-600">{ed?.name || '7th Edition'}</td>
                  <td className="py-3 px-4 font-semibold text-neutral-700">{count} candidates</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      cat.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-neutral-500'
                    }`}>
                      {cat.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setEditingCategory(cat);
                        setFormData(cat);
                      }}
                      className="p-1 hover:bg-neutral-100 rounded text-neutral-600 mr-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
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
