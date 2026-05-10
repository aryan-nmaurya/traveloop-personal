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
    destinations: ['Manali', 'Udaipur', 'Rajasthan'],
    budget: '₹45,000 – ₹75,000',
    duration: '10 days',
    music: 'Badtameez Dil, Ilahi, Kabira',
    itinerary: [
      { day: '1–3', location: 'Manali, Himachal Pradesh', activities: ['Rohtang Pass trek at sunrise', 'Solang Valley snow activities', 'Bonfire night with locals at Old Manali', 'River rafting on Beas River'], stay: 'The Himalayan, Manali', budget: '₹12,000' },
      { day: '4–5', location: 'Kasol & Kheerganga', activities: ['Trek to Kheerganga hot springs', 'Night under the stars at 3,000m', 'Café culture and chilled vibes in Kasol'], stay: 'Alpine Camp, Kasol', budget: '₹6,000' },
      { day: '6–8', location: 'Udaipur, Rajasthan', activities: ['Boat ride on Lake Pichola', 'Sunset at City Palace', 'Rajasthani dinner under the stars', 'Havelis and bazaar exploration'], stay: 'Taj Lake Palace', budget: '₹20,000' },
      { day: '9–10', location: 'Jaisalmer Desert', activities: ['Camel safari into Thar Desert', 'Desert camp with folk music', 'Sam Sand Dunes at golden hour', 'Patwon Ki Haveli'], stay: 'Suryagarh Jaisalmer', budget: '₹14,000' },
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
    destinations: ['Barcelona', 'Pamplona', 'Seville'],
    budget: '₹1,80,000 – ₹2,50,000',
    duration: '12 days',
    music: 'Senorita, Ik Junoon, Khaabon Ke Parindey',
    itinerary: [
      { day: '1–3', location: 'Barcelona, Spain', activities: ['La Sagrada Família at dawn', 'Park Güell mosaic terraces', 'Gothic Quarter evening walk', 'Tapas bar crawl in El Born'], stay: 'Hotel Arts Barcelona', budget: '₹45,000' },
      { day: '4–5', location: 'Pamplona, Navarra', activities: ['Running of the Bulls experience (or watch safely)', 'Old town fiesta culture', 'Txakoli wine tasting', 'Scenic drive through Basque country'], stay: 'Hotel La Perla Pamplona', budget: '₹28,000' },
      { day: '6–9', location: 'Seville, Andalusia', activities: ['Real Alcázar palace gardens', 'Flamenco show at Tablao Flamenco', 'Tapas route through Triana market', 'Sunset at Metropol Parasol'], stay: 'Hotel Alfonso XIII', budget: '₹55,000' },
      { day: '10–12', location: 'Costa del Sol', activities: ['Skydiving over the Mediterranean', 'Marbella old town', 'Boat trip to Benalmádena', 'Final sunset dinner on the beach'], stay: 'Marbella Club Hotel', budget: '₹50,000' },
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
    destinations: ['Ladakh', 'Spiti Valley', 'Zanskar'],
    budget: '₹40,000 – ₹65,000',
    duration: '14 days',
    music: 'Society, Hard Sun, Rise',
    itinerary: [
      { day: '1–3', location: 'Leh, Ladakh', activities: ['Acclimatization day in Leh city', 'Shanti Stupa sunrise meditation', 'Pangong Tso lake (4,350m)', 'Stargazing at Nubra Valley'], stay: 'The Grand Dragon Ladakh', budget: '₹15,000' },
      { day: '4–6', location: 'Zanskar Valley', activities: ['Off-road drive through Pensi La pass', 'Camping on Zanskar River banks', 'Complete communication blackout — pure nature', 'Phuktal Monastery carved into cliff'], stay: 'Tent camping', budget: '₹10,000' },
      { day: '7–10', location: 'Spiti Valley', activities: ['Key Monastery at 4,166m', 'Chicham Bridge — Asia\'s highest', 'Pin Valley National Park wildlife', 'Solo walk in Pin-Bhaba pass'], stay: 'Zostel Kaza', budget: '₹14,000' },
      { day: '11–14', location: 'Chitkul & Sangla', activities: ['Chitkul — last inhabited Indian village', 'Apple orchard walks', 'River trout fishing', 'Complete digital detox'], stay: 'Himalayan homestay', budget: '₹10,000' },
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
    destinations: ['Goa', 'Mumbai', 'Ladakh'],
    budget: '₹30,000 – ₹55,000',
    duration: '9 days',
    music: 'Dil Chahta Hai, Jaane Kyun, Kaisi Hai Yeh Rut',
    itinerary: [
      { day: '1–3', location: 'Goa (North)', activities: ['Calangute and Baga beach sunsets', 'Old Goa Portuguese churches', 'Feni tasting and beach shacks', 'Flea market at Anjuna'], stay: 'Taj Fort Aguada Resort', budget: '₹14,000' },
      { day: '4–5', location: 'South Goa', activities: ['Palolem beach isolation', 'Dudhsagar waterfalls trek', 'Kayaking through backwaters', 'Silent beach bonfire'], stay: 'Agonda Beach Resort', budget: '₹10,000' },
      { day: '6–7', location: 'Mumbai', activities: ['Marine Drive night walk', 'Bandra-Worli Sea Link drive', 'Colaba Causeway shopping', 'Gateway of India sunrise'], stay: 'Taj Mahal Palace Mumbai', budget: '₹18,000' },
      { day: '8–9', location: 'Lonavala & Mahabaleshwar', activities: ['Bhushi Dam monsoon swim', 'Kaas Plateau wildflowers', 'Strawberry farm visits', 'Sunset from Sunset Point'], stay: 'The Machan Lonavala', budget: '₹10,000' },
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
    destinations: ['Iceland', 'Bolivia', 'Atacama'],
    budget: '₹2,50,000 – ₹4,00,000',
    duration: '16 days',
    music: 'Cornfield Chase, No Time for Caution, Stay',
    itinerary: [
      { day: '1–4', location: 'Iceland', activities: ['Jökulsárlón glacier lagoon', 'Black sand beaches of Reynisfjara', 'Skógafoss waterfall under Northern Lights', 'Thórsmörk volcanic valley'], stay: 'Ion Adventure Hotel', budget: '₹70,000' },
      { day: '5–7', location: 'Westfjords, Iceland', activities: ['Dynjandi waterfall — Iceland\'s grandest', 'Hornstrandir Nature Reserve hike', 'Hot pot under midnight sun', 'Arctic fox encounters'], stay: 'Remote guesthouse', budget: '₹45,000' },
      { day: '8–11', location: 'Salar de Uyuni, Bolivia', activities: ['Salt flat sky reflections at sunrise', 'Cactus island at dawn', 'Star trail photography at 3,600m', 'Coloured lagoons and flamingos'], stay: 'Palacio de Sal hotel', budget: '₹65,000' },
      { day: '12–16', location: 'Atacama Desert, Chile', activities: ['Valle de la Luna at dusk', 'ALMA observatory telescope night', 'El Tatio geysers at sunrise', 'Stargazing at Paranal Observatory'], stay: 'Alto Atacama Desert Lodge', budget: '₹80,000' },
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
    destinations: ['Andamans', 'Lakshadweep', 'Maldives'],
    budget: '₹60,000 – ₹1,20,000',
    duration: '11 days',
    music: 'Porcelain, Pure Shores, Small Hours',
    itinerary: [
      { day: '1–3', location: 'Havelock Island, Andamans', activities: ['Radhanagar Beach (Asia\'s best)', 'Snorkelling at Elephant Beach', 'Kayak through mangrove creeks', 'Glass-bottom boat over coral'], stay: 'Jalakara Hotel', budget: '₹18,000' },
      { day: '4–5', location: 'Neil Island, Andamans', activities: ['Bicycle tour around the island', 'Natural Bridge sunset', 'Night squid fishing with locals', 'Sleeping on the beach'], stay: 'Sea Shell Beach Resort', budget: '₹10,000' },
      { day: '6–8', location: 'Bangaram, Lakshadweep', activities: ['Uninhabited island drifting', 'Scuba dive on pristine coral', 'Deep sea fishing', 'Bioluminescent beach at night'], stay: 'Bangaram Island Resort', budget: '₹28,000' },
      { day: '9–11', location: 'Maldives', activities: ['Overwater bungalow stay', 'Manta ray snorkel at Hanifaru Bay', 'Sunset dolphin cruise', 'Sandbank picnic at low tide'], stay: 'Four Seasons Landaa Giraavaru', budget: '₹45,000' },
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

const MovieItineraryPage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(movies[0]);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

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
          <Button key="new" onClick={() => navigate('/trips/new')}>
            <Plus size={16} />
            Turn into a trip
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
              <Button onClick={() => navigate('/trips/new')}>
                <Plus size={16} />
                Start this trip
                <ArrowRight size={15} />
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
              <Button size="sm" onClick={() => navigate('/trips/new')}>
                <Plus size={15} />
                Build this trip
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
