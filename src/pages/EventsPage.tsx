import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Event } from '../types';
import {
  Calendar,
  MapPin,
  Ticket,
  Clock,
  ArrowRight,
  ChevronLeft
} from 'lucide-react';

interface EventsPageProps {
  onOpenTicketModal: () => void;
  setCurrentTab: (tab: string) => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({
  onOpenTicketModal,
  setCurrentTab
}) => {
  const { events, categories, nominees, editions } = useApp();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'live' | 'past'>('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const filteredEvents = events.filter(e => {
    if (filter === 'all') return true;
    return e.status === filter;
  });

  // If viewing details of a specific event
  if (selectedEvent) {
    const eventEdition = editions.find(ed => ed.id === selectedEvent.editionId);
    const eventCategories = categories.filter(c => c.eventId === selectedEvent.id || c.editionId === selectedEvent.editionId);

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Back Button */}
        <button
          onClick={() => setSelectedEvent(null)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-[#0B0B0B] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Events List
        </button>

        {/* Hero Event Banner */}
        <div className="relative rounded-2xl overflow-hidden bg-neutral-950 text-white min-h-[380px] flex items-end p-6 sm:p-10 border border-[#C9971C]/30 shadow-2xl">
          <img
            src={selectedEvent.bannerImage}
            alt={selectedEvent.title}
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="px-2.5 py-1 bg-[#E8471C] text-white text-[10px] uppercase font-bold tracking-wider rounded">
              {selectedEvent.status.toUpperCase()} EVENT
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
              {selectedEvent.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-neutral-300">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#F2A01F]" />
                {new Date(selectedEvent.date).toLocaleDateString('en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#F2A01F]" />
                {selectedEvent.venue}, {selectedEvent.city}, {selectedEvent.country}
              </span>
            </div>
            {selectedEvent.ticketSalesOpen && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenTicketModal}
                  className="px-6 py-3 bg-[#E8471C] hover:bg-[#c93912] active:scale-98 text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-lg transition-all flex items-center gap-2"
                >
                  <Ticket className="w-4 h-4" />
                  Reserve Gala Night Tickets
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Description & Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-neutral-200 space-y-4">
              <h3 className="font-serif font-bold text-xl text-[#0B0B0B]">
                About This Edition Gala
              </h3>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-light">
                {selectedEvent.description}
              </p>
              <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 text-xs text-neutral-600 space-y-2">
                <span className="font-bold text-[#0B0B0B] block">Important Attendee Guidelines:</span>
                <ul className="list-disc list-inside space-y-1 text-neutral-600">
                  <li>Dress Code: Regal African Cultural Haute Couture or Black-Tie with indigenous textiles.</li>
                  <li>Security: Accreditation passes require photo ID matching ticket name.</li>
                  <li>Live Broadcast: Global red-carpet streaming commences at 17:00 WAT sharp.</li>
                </ul>
              </div>
            </div>

            {/* Event Categories */}
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-xl text-[#0B0B0B]">
                Categories Featured in This Event
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {eventCategories.map(cat => (
                  <div key={cat.id} className="bg-white p-4 rounded-lg border border-neutral-200">
                    <span className="font-mono text-[10px] text-[#E8471C] font-bold block">{cat.code}</span>
                    <h4 className="font-serif font-bold text-sm text-[#0B0B0B] mt-0.5">{cat.name}</h4>
                    <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{cat.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#0B0B0B] text-white p-6 rounded-xl border border-[#C9971C]/30 space-y-4">
              <h4 className="font-serif font-bold text-lg text-white">
                Gala Venue Information
              </h4>
              <div className="text-xs text-neutral-300 space-y-3">
                <div>
                  <span className="text-[#F2A01F] font-bold block">Venue:</span>
                  <span>{selectedEvent.venue}</span>
                </div>
                <div>
                  <span className="text-[#F2A01F] font-bold block">City & Country:</span>
                  <span>{selectedEvent.city}, {selectedEvent.country}</span>
                </div>
                <div>
                  <span className="text-[#F2A01F] font-bold block">Doors Open:</span>
                  <span>16:30 WAT · Red Carpet 17:00 WAT</span>
                </div>
              </div>
              {selectedEvent.ticketSalesOpen && (
                <button
                  type="button"
                  onClick={onOpenTicketModal}
                  className="w-full py-2.5 bg-[#E8471C] hover:bg-[#c93912] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors"
                >
                  Buy Passes Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Events List View
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E8471C] uppercase tracking-widest">
          <Calendar className="w-3.5 h-3.5 text-[#F2A01F]" />
          <span>Awards Ceremonies & Gatherings</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B0B0B]">
          Official Calendar of Events
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
          From glamorous nominee cocktail soirées to the monumental 7th Edition Cultural Fashion Gala Night in Lagos.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['all', 'upcoming', 'live', 'past'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold capitalize transition-colors ${
              filter === tab
                ? 'bg-[#0B0B0B] text-white'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredEvents.map(event => (
          <div
            key={event.id}
            className="bg-white rounded-xl overflow-hidden border border-neutral-200 hover:border-[#C9971C]/60 hover:shadow-xl transition-all flex flex-col justify-between"
          >
            <div className="relative aspect-[16/9] bg-neutral-950 overflow-hidden">
              <img
                src={event.bannerImage}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 bg-[#0B0B0B]/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase rounded border border-white/10">
                  {event.status}
                </span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#E8471C] font-semibold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {new Date(event.date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                  <span>·</span>
                  <span>{event.city}, {event.country}</span>
                </div>

                <h3 className="font-serif font-bold text-xl text-[#0B0B0B]">
                  {event.title}
                </h3>

                <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed font-light">
                  {event.description}
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(event)}
                  className="text-xs font-bold text-[#0B0B0B] hover:text-[#E8471C] flex items-center gap-1 transition-colors"
                >
                  <span>Event Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {event.ticketSalesOpen && (
                  <button
                    type="button"
                    onClick={onOpenTicketModal}
                    className="px-4 py-2 bg-[#E8471C] hover:bg-[#c93912] text-white text-xs font-bold uppercase rounded transition-colors flex items-center gap-1.5"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    Get Tickets
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
