import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Edition, Event } from '../../types';
import { MediaUpload } from '../common/MediaUpload';
import { Plus, Edit2, Trash2, Calendar, MapPin, Check, X, Vote, ToggleLeft, ToggleRight } from 'lucide-react';

export const AdminEditionsEvents: React.FC = () => {
  const { editions, events, setEditions, setEvents, votingSettings, updateVotingSettings } = useApp();

  // Edition state
  const [editingEdition, setEditingEdition] = useState<Edition | null>(null);
  const [isCreatingEdition, setIsCreatingEdition] = useState(false);
  const [editionForm, setEditionForm] = useState<Partial<Edition>>({});

  // Event state
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [eventForm, setEventForm] = useState<Partial<Event>>({});

  // Handlers for Editions
  const handleSaveEdition = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEdition) {
      setEditions(editions.map(ed => ed.id === editingEdition.id ? { ...editingEdition, ...editionForm } as Edition : ed));
      setEditingEdition(null);
    } else if (isCreatingEdition) {
      const newEd: Edition = {
        id: `ed-${Date.now()}`,
        number: Number(editionForm.number) || editions.length + 1,
        name: editionForm.name || 'New Edition',
        year: Number(editionForm.year) || new Date().getFullYear(),
        theme: editionForm.theme || 'Heritage & Future',
        description: editionForm.description || '',
        status: (editionForm.status as any) || 'live',
        bannerImage: editionForm.bannerImage || '/src/assets/images/iaa_hero_gala_1790253803537.jpg',
        isCurrent: Boolean(editionForm.isCurrent),
        votingOpen: Boolean(editionForm.votingOpen)
      };
      // If set as current, unset others
      if (newEd.isCurrent) {
        setEditions(editions.map(ed => ({ ...ed, isCurrent: false })).concat(newEd));
      } else {
        setEditions([...editions, newEd]);
      }
      setIsCreatingEdition(false);
    }
  };

  const handleDeleteEdition = (id: string) => {
    if (confirm('Are you sure you want to delete this edition?')) {
      setEditions(editions.filter(ed => ed.id !== id));
    }
  };

  // Handlers for Events
  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
      setEvents(events.map(ev => ev.id === editingEvent.id ? { ...editingEvent, ...eventForm } as Event : ev));
      setEditingEvent(null);
    } else if (isCreatingEvent) {
      const newEv: Event = {
        id: `evt-${Date.now()}`,
        editionId: eventForm.editionId || editions[0]?.id || 'ed-7',
        title: eventForm.title || 'New Gala Event',
        description: eventForm.description || '',
        date: eventForm.date || new Date().toISOString(),
        venue: eventForm.venue || 'Eko Hotel Grand Ballroom',
        city: eventForm.city || 'Lagos',
        country: eventForm.country || 'Nigeria',
        bannerImage: eventForm.bannerImage || '/src/assets/images/iaa_hero_gala_1790253803537.jpg',
        status: (eventForm.status as any) || 'upcoming',
        ticketSalesOpen: Boolean(eventForm.ticketSalesOpen)
      };
      setEvents([...events, newEv]);
      setIsCreatingEvent(false);
    }
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm('Delete this event from the calendar?')) {
      setEvents(events.filter(ev => ev.id !== id));
    }
  };

  return (
    <div className="space-y-12">
      {/* Global Voting Master Switch */}
      <div className="bg-[#0B0B0B] text-white p-6 rounded-xl border border-[#C9971C]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Vote className="w-4 h-4 text-[#F2A01F]" />
            <h3 className="font-serif font-bold text-lg text-white">Ballot Ledger Master Control</h3>
          </div>
          <p className="text-xs text-neutral-300">
            Open or close public voting instantly across all platforms and payment gateways.
          </p>
        </div>

        <button
          type="button"
          onClick={() => updateVotingSettings({ votingOpen: !votingSettings.votingOpen })}
          className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
            votingSettings.votingOpen
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          {votingSettings.votingOpen ? 'Voting is ACTIVE (Click to Close)' : 'Voting is CLOSED (Click to Open)'}
        </button>
      </div>

      {/* SECTION 1: EDITIONS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-xl text-[#0B0B0B]">Editions Management</h3>
            <p className="text-xs text-neutral-500">Configure annual editions, themes, and current active cycles.</p>
          </div>
          <button
            onClick={() => {
              setEditionForm({
                name: '8th Edition',
                number: 8,
                year: 2027,
                theme: 'Pan-African Digital Renaissance',
                description: '',
                isCurrent: false,
                votingOpen: false
              });
              setIsCreatingEdition(true);
            }}
            className="px-3.5 py-2 bg-[#E8471C] hover:bg-[#c93912] text-white text-xs font-bold uppercase rounded-md flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Edition
          </button>
        </div>

        {/* Create / Edit Edition Form */}
        {(isCreatingEdition || editingEdition) && (
          <form onSubmit={handleSaveEdition} className="bg-white p-6 rounded-xl border-2 border-[#E8471C] shadow-md space-y-4 text-xs">
            <h4 className="font-serif font-bold text-base text-[#0B0B0B]">
              {isCreatingEdition ? 'Create New Annual Edition' : `Edit ${editingEdition?.name}`}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-neutral-600 mb-1">Edition Title</label>
                <input
                  type="text"
                  required
                  value={editionForm.name || ''}
                  onChange={e => setEditionForm({ ...editionForm, name: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block font-bold text-neutral-600 mb-1">Edition Number</label>
                <input
                  type="number"
                  required
                  value={editionForm.number || ''}
                  onChange={e => setEditionForm({ ...editionForm, number: parseInt(e.target.value) || 1 })}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block font-bold text-neutral-600 mb-1">Year</label>
                <input
                  type="number"
                  required
                  value={editionForm.year || ''}
                  onChange={e => setEditionForm({ ...editionForm, year: parseInt(e.target.value) || 2026 })}
                  className="w-full border rounded p-2"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-neutral-600 mb-1">Theme (Couture Sub-title)</label>
              <input
                type="text"
                required
                value={editionForm.theme || ''}
                onChange={e => setEditionForm({ ...editionForm, theme: e.target.value })}
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-600 mb-1">Description</label>
              <textarea
                rows={2}
                value={editionForm.description || ''}
                onChange={e => setEditionForm({ ...editionForm, description: e.target.value })}
                className="w-full border rounded p-2 text-xs"
              />
            </div>

            <div>
              <MediaUpload
                label="Edition Hero & Poster Banner"
                helperText="Upload the official key visual art for this annual edition."
                value={editionForm.bannerImage || ''}
                onChange={(url) => setEditionForm({ ...editionForm, bannerImage: url })}
                aspectRatio="16:9"
              />
            </div>

            <div className="flex gap-6 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(editionForm.isCurrent)}
                  onChange={e => setEditionForm({ ...editionForm, isCurrent: e.target.checked })}
                />
                <span className="font-semibold text-neutral-800">Set as Current Active Edition</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(editionForm.votingOpen)}
                  onChange={e => setEditionForm({ ...editionForm, votingOpen: e.target.checked })}
                />
                <span className="font-semibold text-neutral-800">Enable Voting for this Edition</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => {
                  setIsCreatingEdition(false);
                  setEditingEdition(null);
                }}
                className="px-4 py-2 border rounded font-semibold text-neutral-600 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#E8471C] text-white rounded font-bold uppercase hover:bg-[#c93912]"
              >
                Save Edition
              </button>
            </div>
          </form>
        )}

        {/* Editions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {editions.map(ed => (
            <div key={ed.id} className="bg-white p-5 rounded-xl border border-neutral-200 flex flex-col justify-between space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif font-bold text-lg text-[#0B0B0B]">{ed.name} ({ed.year})</h4>
                    {ed.isCurrent && (
                      <span className="px-2 py-0.5 bg-[#E8471C] text-white text-[10px] font-bold uppercase rounded">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#C9971C] font-serif italic">{ed.theme}</p>
                  <p className="text-xs text-neutral-600 mt-1 line-clamp-2">{ed.description}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingEdition(ed);
                      setEditionForm(ed);
                    }}
                    className="p-1.5 hover:bg-neutral-100 rounded text-neutral-600"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteEdition(ed.id)}
                    className="p-1.5 hover:bg-red-50 rounded text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-neutral-400 pt-2 border-t border-neutral-100 flex items-center justify-between">
                <span>Voting status: <strong className={ed.votingOpen ? 'text-emerald-600' : 'text-neutral-500'}>{ed.votingOpen ? 'Open' : 'Closed'}</strong></span>
                <span>Edition #{ed.number}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: EVENTS */}
      <div className="space-y-4 pt-6 border-t border-neutral-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-xl text-[#0B0B0B]">Events & Ceremonies</h3>
            <p className="text-xs text-neutral-500">Manage venue, dates, ticketing switch, and gala schedules.</p>
          </div>
          <button
            onClick={() => {
              setEventForm({
                title: '7th Edition Gala Dinner & Ceremony',
                description: '',
                date: '2026-11-28T18:00:00.000Z',
                venue: 'Grand Ballroom, Eko Hotels',
                city: 'Lagos',
                country: 'Nigeria',
                status: 'upcoming',
                ticketSalesOpen: true,
                editionId: 'ed-7',
                bannerImage: '/src/assets/images/iaa_hero_gala_1790253803537.jpg'
              });
              setIsCreatingEvent(true);
            }}
            className="px-3.5 py-2 bg-[#E8471C] hover:bg-[#c93912] text-white text-xs font-bold uppercase rounded-md flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </button>
        </div>

        {/* Create / Edit Event Form */}
        {(isCreatingEvent || editingEvent) && (
          <form onSubmit={handleSaveEvent} className="bg-white p-6 rounded-xl border-2 border-[#E8471C] shadow-md space-y-4 text-xs">
            <h4 className="font-serif font-bold text-base text-[#0B0B0B]">
              {isCreatingEvent ? 'Schedule New Ceremony Event' : `Edit ${editingEvent?.title}`}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-neutral-600 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={eventForm.title || ''}
                  onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block font-bold text-neutral-600 mb-1">Status</label>
                <select
                  value={eventForm.status || 'upcoming'}
                  onChange={e => setEventForm({ ...eventForm, status: e.target.value as any })}
                  className="w-full border rounded p-2 bg-white"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="live">Live Now</option>
                  <option value="past">Past</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-neutral-600 mb-1">Date & Time (ISO)</label>
                <input
                  type="datetime-local"
                  required
                  value={eventForm.date ? eventForm.date.slice(0, 16) : ''}
                  onChange={e => setEventForm({ ...eventForm, date: new Date(e.target.value).toISOString() })}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block font-bold text-neutral-600 mb-1">Venue</label>
                <input
                  type="text"
                  required
                  value={eventForm.venue || ''}
                  onChange={e => setEventForm({ ...eventForm, venue: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block font-bold text-neutral-600 mb-1">City & Country</label>
                <input
                  type="text"
                  required
                  value={eventForm.city || ''}
                  onChange={e => setEventForm({ ...eventForm, city: e.target.value })}
                  placeholder="Lagos"
                  className="w-full border rounded p-2"
                />
              </div>
            </div>

            <div>
              <MediaUpload
                label="Ceremony Gala Banner Image"
                helperText="Upload the official venue cover, red carpet backdrop, or ballroom photo for this ceremony."
                value={eventForm.bannerImage || ''}
                onChange={(url) => setEventForm({ ...eventForm, bannerImage: url })}
                aspectRatio="16:9"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-600 mb-1">Description</label>
              <textarea
                rows={2}
                value={eventForm.description || ''}
                onChange={e => setEventForm({ ...eventForm, description: e.target.value })}
                className="w-full border rounded p-2"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(eventForm.ticketSalesOpen)}
                onChange={e => setEventForm({ ...eventForm, ticketSalesOpen: e.target.checked })}
              />
              <span className="font-semibold text-neutral-800">Enable Ticket Sales For This Event</span>
            </label>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => {
                  setIsCreatingEvent(false);
                  setEditingEvent(null);
                }}
                className="px-4 py-2 border rounded font-semibold text-neutral-600 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#E8471C] text-white rounded font-bold uppercase hover:bg-[#c93912]"
              >
                Save Event
              </button>
            </div>
          </form>
        )}

        {/* Events Table */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b text-neutral-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Event Name</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Venue</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Tickets</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {events.map(ev => (
                <tr key={ev.id} className="hover:bg-neutral-50">
                  <td className="py-3 px-4 font-bold text-neutral-900">{ev.title}</td>
                  <td className="py-3 px-4 text-neutral-600">{new Date(ev.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-neutral-600">{ev.venue}, {ev.city}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-neutral-100 text-neutral-800">
                      {ev.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[11px] font-semibold ${ev.ticketSalesOpen ? 'text-emerald-600' : 'text-neutral-400'}`}>
                      {ev.ticketSalesOpen ? 'Sales Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setEditingEvent(ev);
                        setEventForm(ev);
                      }}
                      className="p-1 hover:bg-neutral-100 rounded text-neutral-600 mr-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(ev.id)}
                      className="p-1 hover:bg-red-50 rounded text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
