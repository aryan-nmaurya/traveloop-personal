import { useState } from 'react';
import { ArrowRight, Calendar, MapPin, Music, Play, Plus, Sparkles, Star, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import AppLayout from '../../components/layout/AppLayout';
import { Button, Eyebrow, PageIntro, PageSection, SectionHeader } from '../../components/ui/primitives';
import { cn } from '../../utils/cn';

const movies = [
  {
    id: 'yjhd',
    title: 'Yeh Jawaani Hai Deewani',
    year: 2013,
    vibe: 'Adventure · Friendship · Romance',
    mood: 'Carefree, nostalgic, mountain soul',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80',
    color: 'from-orange-500 to-pink-600',
    destinations: ['Manali', 'Kasol', 'Udaipur', 'Jaisalmer'],
    budget: '₹45,000 – ₹75,000',
    duration: '10 days',
    music: 'Badtameez Dil, Ilahi, Kabira',
    itinerary: [
      { day: '1–3', location: 'Manali', activities: ['Rohtang Pass trek at sunrise', 'Solang Valley snow activities & paragliding', 'Bonfire night with locals at Old Manali cafes', 'River rafting on Beas River'], stay: 'The Himalayan, Manali', budget: '₹12,000' },
      { day: '4–5', location: 'Kasol', activities: ['Trek to Kheerganga natural hot springs (12 km)', 'Night camping under stars at 3,000 m', 'Café culture and river walks in Kasol village', 'Hidden Parvati Valley waterfalls trail'], stay: 'Alpine Camp, Kasol', budget: '₹6,000' },
      { day: '6–8', location: 'Udaipur', activities: ['Shikara boat ride on shimmering Lake Pichola', 'Sunset at City Palace — golden-hour views', 'Rooftop Rajasthani thali dinner with folk music', 'Bazaar walk through havelis and miniature-painting ateliers'], stay: 'Taj Lake Palace', budget: '₹20,000' },
      { day: '9–10', location: 'Jaisalmer', activities: ['Camel safari into the Thar Desert at sunset', 'Overnight desert camp — folk music & 10,000 stars', 'Sam Sand Dunes photography at golden hour', 'Patwon Ki Haveli intricate sandstone carvings'], stay: 'Suryagarh Jaisalmer', budget: '₹14,000' },
    ],
  },
  {
    id: 'znmd',
    title: 'Zindagi Na Milegi Dobara',
    year: 2011,
    vibe: 'Freedom · Self-discovery · Epic',
    mood: 'Bold, cinematic, transformative',
    image: 'https://images.unsplash.com/photo-1543716091-a840c05249ec?auto=format&fit=crop&w=1600&q=80',
    color: 'from-red-600 to-orange-500',
    destinations: ['Barcelona', 'Pamplona', 'Seville', 'Marbella'],
    budget: '₹1,80,000 – ₹2,50,000',
    duration: '12 days',
    music: 'Senorita, Ik Junoon, Khaabon Ke Parindey',
    itinerary: [
      { day: '1–3', location: 'Barcelona', activities: ['La Sagrada Família at dawn — before the crowds', 'Park Güell mosaic terraces with city panorama', 'Gothic Quarter evening tapas bar crawl in El Born', 'Barceloneta beach sunset — the iconic ZNMD scene'], stay: 'Hotel Arts Barcelona', budget: '₹45,000' },
      { day: '4–5', location: 'Pamplona', activities: ['Running of the Bulls route walk (or watch from balcony)', 'San Fermín old town fiesta exploration', 'Txakoli white wine tasting in Basque country', 'Scenic mountain drive through Pyrenees foothills'], stay: 'Hotel La Perla Pamplona', budget: '₹28,000' },
      { day: '6–9', location: 'Seville', activities: ['Real Alcázar palace garden photography session', 'Authentic Flamenco show at Tablao El Arenal', 'Late-night tapas route through Triana market', 'Metropol Parasol (Las Setas) at golden sunset'], stay: 'Hotel Alfonso XIII', budget: '₹55,000' },
      { day: '10–12', location: 'Marbella', activities: ['Tandem skydiving over the Mediterranean coastline', 'Marbella old town white-washed alleys & tapas', 'Boat trip to hidden coves near Benalmádena', 'Final cinematic sunset dinner on Costa del Sol beach'], stay: 'Marbella Club Hotel', budget: '₹50,000' },
    ],
  },
  {
    id: 'wild',
    title: 'Into the Wild',
    year: 2007,
    vibe: 'Solitude · Raw Nature · Escape',
    mood: 'Raw, introspective, primal',
    image: 'https://images.unsplash.com/photo-1425036458755-dc303a604201?auto=format&fit=crop&w=1600&q=80',
    color: 'from-emerald-600 to-teal-800',
    destinations: ['Leh', 'Zanskar', 'Spiti Valley', 'Chitkul'],
    budget: '₹40,000 – ₹65,000',
    duration: '14 days',
    music: 'Society, Hard Sun, Rise',
    itinerary: [
      { day: '1–3', location: 'Leh', activities: ['Acclimatization day — slow walks and Leh market', 'Shanti Stupa sunrise meditation at 3,500 m', 'Pangong Tso lake day trip — colours shift blue to green', 'Stargazing at Nubra Valley sand dunes'], stay: 'The Grand Dragon Ladakh', budget: '₹15,000' },
      { day: '4–6', location: 'Zanskar', activities: ['Off-road drive through remote Pensi La pass', 'River-bank wild camping — zero network, pure silence', 'Phuktal Monastery carved dramatically into a cliff face', 'Zanskar River gorge walk at dusk'], stay: 'Tent camping on river bank', budget: '₹10,000' },
      { day: '7–10', location: 'Spiti Valley', activities: ['Key Monastery perched at 4,166 m altitude', 'Chicham Bridge — Asia\'s highest suspension bridge', 'Pin Valley National Park — snow leopard territory', 'Solo sunrise walk in Pin-Bhaba mountain pass'], stay: 'Zostel Kaza', budget: '₹14,000' },
      { day: '11–14', location: 'Chitkul', activities: ['Chitkul — India\'s last inhabited village at border', 'Apple and cherry orchard harvest walks', 'River trout fishing in Baspa River', 'Total digital detox — journaling and mountain silence'], stay: 'Himalayan homestay, Chitkul', budget: '₹10,000' },
    ],
  },
  {
    id: 'dch',
    title: 'Dil Chahta Hai',
    year: 2001,
    vibe: 'Friends · Road Trip · Nostalgia',
    mood: 'Breezy, iconic, coming-of-age',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=80',
    color: 'from-sky-500 to-blue-700',
    destinations: ['Goa', 'Mumbai', 'Lonavala', 'Mahabaleshwar'],
    budget: '₹30,000 – ₹55,000',
    duration: '9 days',
    music: 'Dil Chahta Hai, Jaane Kyun, Kaisi Hai Yeh Rut',
    itinerary: [
      { day: '1–3', location: 'Goa', activities: ['Calangute and Baga beach sunset with feni cocktails', 'Old Goa Portuguese churches and Fort Aguada walk', 'Anjuna Wednesday flea market — silver and spices', 'Beach shack seafood dinner under the stars'], stay: 'Taj Fort Aguada Resort', budget: '₹14,000' },
      { day: '4–5', location: 'Goa', activities: ['Palolem beach — quiet coves and hammocks', 'Dudhsagar waterfalls full-day trek via jeep', 'Kayaking through Sal River backwaters', 'Silent bonfire night at Agonda beach'], stay: 'Agonda Beach Resort', budget: '₹10,000' },
      { day: '6–7', location: 'Mumbai', activities: ['Marine Drive night walk — Queen\'s Necklace at 10 PM', 'Bandra-Worli Sea Link drive at dusk', 'Colaba Causeway street shopping and Leopold Cafe', 'Gateway of India at sunrise with fishing boats'], stay: 'Taj Mahal Palace Mumbai', budget: '₹18,000' },
      { day: '8–9', location: 'Lonavala', activities: ['Bhushi Dam monsoon swim and waterfall chase', 'Kaas Plateau wildflower meadows (seasonal)', 'Strawberry farm visits and fresh cream picking', 'Sunset from Sunset Point — valley panorama'], stay: 'The Machan, Lonavala', budget: '₹10,000' },
    ],
  },
  {
    id: 'interstellar',
    title: 'Interstellar Landscapes',
    year: 2014,
    vibe: 'Cosmic · Isolation · Surreal',
    mood: 'Vast, silent, otherworldly',
    image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1600&q=80',
    color: 'from-indigo-700 to-violet-900',
    destinations: ['Reykjavik', 'Westfjords', 'Salar de Uyuni', 'San Pedro de Atacama'],
    budget: '₹2,50,000 – ₹4,00,000',
    duration: '16 days',
    music: 'Cornfield Chase, No Time for Caution, Stay',
    itinerary: [
      { day: '1–4', location: 'Reykjavik', activities: ['Jökulsárlón glacier lagoon — floating ice sculptures', 'Black sand beaches of Reynisfjara at high tide', 'Skógafoss waterfall under Northern Lights', 'Thórsmörk volcanic valley — zero humans, pure earth'], stay: 'Ion Adventure Hotel, Iceland', budget: '₹70,000' },
      { day: '5–7', location: 'Westfjords', activities: ['Dynjandi waterfall — Iceland\'s most dramatic cascade', 'Hornstrandir Nature Reserve — no roads, pure hiking', 'Geothermal hot pot under the midnight sun', 'Arctic fox den encounters in the wild fjords'], stay: 'Remote Westfjords Guesthouse', budget: '₹45,000' },
      { day: '8–11', location: 'Salar de Uyuni', activities: ['Mirror-like salt flat sky reflections at dawn', 'Cactus island (Isla Incahuasi) at sunrise', 'Star trail long-exposure photography at 3,600 m', 'Coloured lagoons and flamingo colonies'], stay: 'Palacio de Sal hotel, Uyuni', budget: '₹65,000' },
      { day: '12–16', location: 'San Pedro de Atacama', activities: ['Valle de la Luna at dusk — Mars-like silence', 'ALMA observatory — world\'s largest radio telescope', 'El Tatio geysers erupting at 5 AM sunrise', 'Stargazing at Paranal Observatory — 8,000 stars visible'], stay: 'Alto Atacama Desert Lodge', budget: '₹80,000' },
    ],
  },
  {
    id: 'beach',
    title: 'The Beach',
    year: 2000,
    vibe: 'Paradise · Discovery · Escape',
    mood: 'Tropical, carefree, sun-drenched',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1600&q=80',
    color: 'from-cyan-500 to-teal-700',
    destinations: ['Havelock Island', 'Neil Island', 'Lakshadweep', 'Maldives'],
    budget: '₹60,000 – ₹1,20,000',
    duration: '11 days',
    music: 'Porcelain, Pure Shores, Small Hours',
    itinerary: [
      { day: '1–3', location: 'Havelock Island', activities: ['Radhanagar Beach (Asia\'s best) at sunrise — no crowds', 'Snorkelling at Elephant Beach over coral gardens', 'Mangrove creek kayaking — bioluminescent plankton at night', 'Glass-bottom boat ride over living reef'], stay: 'Jalakara Hotel, Havelock', budget: '₹18,000' },
      { day: '4–5', location: 'Neil Island', activities: ['Bicycle tour around the entire island (8 km loop)', 'Natural Bridge rock formation at low tide sunset', 'Night squid fishing with local fishermen', 'Sleep on the beach under a canopy of stars'], stay: 'Sea Shell Beach Resort, Neil', budget: '₹10,000' },
      { day: '6–8', location: 'Lakshadweep', activities: ['Uninhabited lagoon island drifting — you and the sea', 'Scuba dive on India\'s most pristine reef system', 'Deep sea fishing for tuna and barracuda', 'Bioluminescent plankton beach walk at midnight'], stay: 'Bangaram Island Resort, Lakshadweep', budget: '₹28,000' },
      { day: '9–11', location: 'Maldives', activities: ['Overwater bungalow with direct ocean ladder access', 'Manta ray snorkel at Hanifaru Bay biosphere reserve', 'Sunset dolphin cruise through the Indian Ocean', 'Sandbank picnic at low tide — just you and the horizon'], stay: 'Four Seasons Landaa Giraavaru', budget: '₹45,000' },
    ],
  },
];

const DayCard = ({ day }) => (
  <div
    className="rounded-[22px] border p-5 transition duration-300 hover:-translate-y-0.5"
    style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
  >
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--accent-primary)' }}>
          Day {day.day}
        </p>
        <h4 className="mt-1 text-lg font-semibold tracking-[-0.03em]" style={{ color: 'var(--text-primary)' }}>
          {day.location}
        </h4>
      </div>
      <span
        className="rounded-full px-3 py-1 text-xs font-semibold"
        style={{ background: 'var(--accent-soft)', color: 'var(--accent-primary)' }}
      >
        {day.budget}
      </span>
    </div>
    <ul className="space-y-2">
      {day.activities.map((act, i) => (
        <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
          {act}
        </li>
      ))}
    </ul>
    <div className="mt-4 flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
      <Star size={12} />
      Stay: {day.stay}
    </div>
  </div>
);

/**
 * Parse a budget string that may be a range like '₹45,000 – ₹75,000'
 * or a single value like '₹1,50,000+'.
 * Returns the highest number found (safe upper-bound for the trip budget).
 */
const parseBudgetStr = (str = '') => {
  const nums = str
    .split(/[–—]/)
    .map((p) => parseInt(p.replace(/[^0-9]/g, ''), 10))
    .filter((n) => n > 0 && !Number.isNaN(n));
  if (!nums.length) return 50000;
  return Math.max(...nums);
};

const MovieItineraryPage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(movies[0]);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [startingTrip, setStartingTrip] = useState(false);

  const handleStartTrip = async () => {
    if (startingTrip) return;
    setStartingTrip(true);
    try {
      const itinerary = selected.generated_itinerary || selected.itinerary;

      // Build a city-name → id map from the API for accurate city linking
      let cityMap = {};
      try {
        const citiesRes = await api.get('/cities?limit=200');
        (citiesRes.data.cities ?? []).forEach((c) => {
          cityMap[c.name.toLowerCase()] = c.id;
        });
      } catch { /* proceed without city linking */ }

      const response = await api.post('/trips', {
        name: `${selected.title} — Cinematic Trip`,
        description: `A ${selected.duration} journey inspired by ${selected.title} (${selected.year}). Vibe: ${selected.vibe}. Destinations: ${selected.destinations.join(', ')}.`,
        cover_photo_url: selected.image,
        budget: parseBudgetStr(selected.budget),
        is_public: false,
      });
      const tripId = response.data.id;

      for (const [idx, day] of itinerary.entries()) {
        try {
          // Determine section type from accommodation type
          const stayLower = (day.stay || '').toLowerCase();
          const sectionType =
            stayLower.includes('camp') || stayLower.includes('tent') ? 'adventure'
            : stayLower.includes('hostel') || stayLower.includes('zostel') ? 'stay'
            : 'stay';

          // Look up city_id — try exact name first, then first word of location
          const locFirst = day.location.split(',')[0].trim().toLowerCase();
          const cityId = cityMap[locFirst] ?? cityMap[day.location.toLowerCase()] ?? null;

          // Build a clean, structured description:
          //   "{location} — {hotel} · {act1} · {act2} · {act3} · {act4}"
          const activitiesPart = day.activities.map((a) => a.trim()).join(' · ');
          const description = `${day.location} — ${day.stay}${activitiesPart ? ' · ' + activitiesPart : ''}`;

          await api.post(`/trips/${tripId}/sections`, {
            type: sectionType,
            description,
            budget: parseBudgetStr(day.budget || '0'),
            city_id: cityId,
            order_index: idx,
          });
        } catch { /* continue with remaining sections */ }
      }
      navigate(`/trips/${tripId}/view`);
    } catch (err) {
      console.error('Failed to create trip:', err);
      navigate('/trips/new');
    } finally {
      setStartingTrip(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerated(false);
    try {
      const response = await api.post('/ai/generate_movie_itinerary', {
        movie_title: selected.title,
        vibe: selected.vibe,
        destinations: selected.destinations,
        duration: selected.duration,
        budget: selected.budget
      });
      
      if (response.data && response.data.itinerary) {
        setSelected(current => ({
          ...current,
          generated_itinerary: response.data.itinerary
        }));
        setGenerated(true);
      }
    } catch (error) {
      console.error("Failed to generate itinerary:", error);
      // Fallback to static if it fails
      setSelected(current => ({
        ...current,
        generated_itinerary: current.itinerary
      }));
      setGenerated(true);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <AppLayout>
      <PageIntro
        eyebrow="🎬 Movie-Inspired Travel"
        title="Live the journey, not just the destination."
        description="Pick a movie that moves you — we'll build an immersive day-by-day itinerary that captures its landscapes, emotions, and spirit."
        actions={[
          <Button key="new" onClick={handleStartTrip} disabled={startingTrip}>
            <Plus size={16} />
            {startingTrip ? 'Creating trip…' : 'Turn into a trip'}
          </Button>,
        ]}
      />

      {/* Movie selector */}
      <PageSection>
        <SectionHeader
          eyebrow="Choose your story"
          title="Which film inspires your next journey?"
          description="Each movie becomes a complete travel experience — locations, activities, stays, and mood."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {movies.map((movie) => (
            <button
              key={movie.id}
              type="button"
              className={cn(
                'group relative overflow-hidden rounded-[24px] border text-left transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.18)]',
                selected.id === movie.id
                  ? 'ring-2 ring-[var(--accent-primary)] ring-offset-2 shadow-[0_20px_60px_rgba(15,23,42,0.18)]'
                  : 'shadow-[0_12px_40px_rgba(15,23,42,0.08)]',
              )}
              style={{ borderColor: 'var(--card-border)' }}
              onClick={() => { setSelected(movie); setGenerated(false); }}
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  alt={movie.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  src={movie.image}
                  loading="lazy"
                  onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80'; }}
                />
                <div className={cn('absolute inset-0 bg-gradient-to-t opacity-75', movie.color)} />
                {selected.id === movie.id && (
                  <div className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-slate-900 shadow-lg">
                    <Play size={13} fill="currentColor" />
                  </div>
                )}
                <div className="absolute inset-x-4 bottom-4 text-white">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">{movie.year}</p>
                  <h3 className="text-lg font-semibold leading-tight tracking-[-0.03em]">{movie.title}</h3>
                </div>
              </div>
              <div className="p-4" style={{ background: 'var(--card-bg)' }}>
                <p className="text-xs font-medium" style={{ color: 'var(--accent-primary)' }}>{movie.vibe}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {movie.destinations.map((d) => (
                    <span
                      key={d}
                      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                      style={{ background: 'var(--accent-soft)', color: 'var(--text-secondary)' }}
                    >
                      <MapPin size={9} />
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </PageSection>

      {/* Selected movie hero */}
      <section className="relative overflow-hidden rounded-[36px] border" style={{ borderColor: 'var(--card-border)' }}>
        <img
          alt={selected.title}
          className="h-80 w-full object-cover"
          src={selected.image}
          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80'; }}
        />
        <div className={cn('absolute inset-0 bg-gradient-to-r opacity-85', selected.color)} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(0,0,0,0.60)_100%)]" />
        <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-10">
          <div className="max-w-3xl text-white">
            <Eyebrow className="border-white/20 bg-white/14 text-white mb-4">🎬 {selected.year}</Eyebrow>
            <h2 className="font-['Fraunces'] text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">{selected.title}</h2>
            <p className="mt-3 text-lg text-white/85 italic">"{selected.mood}"</p>
            <div className="mt-5 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm backdrop-blur">
                <Calendar size={14} />
                {selected.duration}
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm backdrop-blur">
                <Wallet size={14} />
                {selected.budget}
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm backdrop-blur">
                <Music size={14} />
                Playlist included
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                className="border-white/25 bg-white/18 text-white hover:bg-white/28"
                variant="ghost"
                onClick={handleGenerate}
              >
                <Sparkles size={16} />
                {generating ? 'Generating itinerary…' : generated ? 'Regenerate' : 'Generate itinerary'}
              </Button>
              <Button onClick={handleStartTrip} disabled={startingTrip}>
                <Plus size={16} />
                {startingTrip ? 'Creating…' : 'Start this trip'}
                {!startingTrip && <ArrowRight size={15} />}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Music mood */}
      <div
        className="flex items-center gap-4 rounded-[22px] border px-5 py-4"
        style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full" style={{ background: 'var(--accent-soft)' }}>
          <Music size={18} style={{ color: 'var(--accent-primary)' }} />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--text-muted)' }}>
            Mood soundtrack
          </p>
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{selected.music}</p>
        </div>
        <a
          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(selected.music + ' ' + selected.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full border transition hover:-translate-y-0.5"
          style={{ borderColor: 'var(--input-border)', color: 'var(--text-secondary)', background: 'var(--input-bg)' }}
        >
          <Play size={15} />
        </a>
      </div>

      {/* Itinerary */}
      {generated && (
        <PageSection>
          <SectionHeader
            eyebrow="Day-by-day itinerary"
            title={`${selected.title} — Complete Journey`}
            description={`A ${selected.duration} curated experience capturing the essence of the film.`}
            action={
              <Button size="sm" onClick={handleStartTrip} disabled={startingTrip}>
                <Plus size={15} />
                {startingTrip ? 'Creating…' : 'Build this trip'}
              </Button>
            }
          />
          <div className="grid gap-4 md:grid-cols-2">
            {(selected.generated_itinerary || selected.itinerary).map((day, i) => (
              <DayCard key={i} day={day} />
            ))}
          </div>
        </PageSection>
      )}

      {/* Browse other movies */}
      <PageSection>
        <SectionHeader
          eyebrow="Explore more vibes"
          title="Other cinematic journeys"
          description="Switch between movies to preview a different world."
        />
        <div className="flex flex-wrap gap-3">
          {movies.filter((m) => m.id !== selected.id).map((movie) => (
            <button
              key={movie.id}
              type="button"
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5"
              style={{ borderColor: 'var(--input-border)', color: 'var(--text-secondary)', background: 'var(--card-bg)' }}
              onClick={() => { setSelected(movie); setGenerated(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              🎬 {movie.title}
            </button>
          ))}
        </div>
      </PageSection>
    </AppLayout>
  );
};

export default MovieItineraryPage;
