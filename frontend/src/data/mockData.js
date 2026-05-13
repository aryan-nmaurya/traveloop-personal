import { deriveStatus, formatCurrency, formatDateRange, getTripDuration, toPercent } from '../utils/formatters';

export const coverFallback =
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';

export const destinationHighlights = [
  {
    id: 'himalayan-circuit',
    name: 'Himalayan Circuit',
    region: 'India',
    summary: 'Snow peaks, valley camps, desert forts, and lake reflections across North India.',
    image_url:
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'mediterranean',
    name: 'Mediterranean Arc',
    region: 'Europe',
    summary: 'Sun-drenched coastlines, old harbors, and slow dinners by the sea.',
    image_url:
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'northern-lights',
    name: 'Aurora Circuit',
    region: 'Nordics',
    summary: 'High-design cabins, fjords, and clear nights for aurora chasing.',
    image_url:
      'https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'india-coastal',
    name: 'India Coastal Trail',
    region: 'India',
    summary: 'Goa shacks, Andaman reefs, Kerala backwaters, and Lakshadweep lagoons.',
    image_url:
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'tokyo-kyoto',
    name: 'Tokyo to Kyoto',
    region: 'Asia',
    summary: 'Hyper-modern neighborhoods balanced with temple mornings and tea rituals.',
    image_url:
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'rajasthan-royale',
    name: 'Rajasthan Royale',
    region: 'India',
    summary: 'Palace hotels, camel dunes, pink cities, and a thousand years of living history.',
    image_url:
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=80',
  },
];

export const cityDirectory = [
  // ── Indian destinations ────────────────────────────────────────────────────
  {
    id: 'mock-manali',
    name: 'Manali',
    country: 'India',
    region: 'Asia',
    cost_index: 35,
    popularity_score: 92,
    image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80',
    description: 'Himalayan hill station with snow-capped peaks, river rafting, and the iconic Rohtang Pass.',
  },
  {
    id: 'mock-udaipur',
    name: 'Udaipur',
    country: 'India',
    region: 'Asia',
    cost_index: 45,
    popularity_score: 93,
    image_url: 'https://images.unsplash.com/photo-1477587458883-47145ed31459?auto=format&fit=crop&w=1000&q=80',
    description: 'City of Lakes — Lake Pichola, City Palace, rooftop restaurants, and romantic haveli stays.',
  },
  {
    id: 'mock-jaisalmer',
    name: 'Jaisalmer',
    country: 'India',
    region: 'Asia',
    cost_index: 38,
    popularity_score: 87,
    image_url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1000&q=80',
    description: 'The Golden City in the Thar Desert — camel safaris, Sam Sand Dunes, and a living fort.',
  },
  {
    id: 'mock-goa',
    name: 'Goa',
    country: 'India',
    region: 'Asia',
    cost_index: 50,
    popularity_score: 95,
    image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80',
    description: "India's beach paradise — Portuguese churches, Anjuna flea markets, and Baga nightlife.",
  },
  {
    id: 'mock-mumbai',
    name: 'Mumbai',
    country: 'India',
    region: 'Asia',
    cost_index: 65,
    popularity_score: 91,
    image_url: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=1000&q=80',
    description: 'Maximum City — Gateway of India, Marine Drive, Bollywood, and world-class street food.',
  },
  {
    id: 'mock-leh',
    name: 'Leh',
    country: 'India',
    region: 'Asia',
    cost_index: 40,
    popularity_score: 88,
    image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1000&q=80',
    description: 'High-altitude capital of Ladakh — monasteries, Pangong Tso lake, and lunar landscapes.',
  },
  {
    id: 'mock-jaipur',
    name: 'Jaipur',
    country: 'India',
    region: 'Asia',
    cost_index: 42,
    popularity_score: 90,
    image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80',
    description: 'The Pink City — Amber Fort, Hawa Mahal, gem markets, and Rajasthani cuisine.',
  },
  {
    id: 'mock-rishikesh',
    name: 'Rishikesh',
    country: 'India',
    region: 'Asia',
    cost_index: 20,
    popularity_score: 86,
    image_url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80',
    description: 'Yoga capital of the world — Ganges ghats, white-water rafting, and bungee jumping.',
  },
  {
    id: 'mock-varanasi',
    name: 'Varanasi',
    country: 'India',
    region: 'Asia',
    cost_index: 18,
    popularity_score: 84,
    image_url: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=1000&q=80',
    description: 'One of the world\'s oldest living cities — Ganges ghats at dawn, boat rides, and Ganga Aarti.',
  },
  {
    id: 'mock-munnar',
    name: 'Munnar',
    country: 'India',
    region: 'Asia',
    cost_index: 28,
    popularity_score: 85,
    image_url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80',
    description: "Kerala's tea country — rolling green estates, misty peaks, and elephant sanctuaries.",
  },
  {
    id: 'mock-havelock',
    name: 'Havelock Island',
    country: 'India',
    region: 'Asia',
    cost_index: 45,
    popularity_score: 89,
    image_url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1000&q=80',
    description: "Radhanagar Beach (Asia's best), snorkelling, mangrove kayaking in the Andaman Islands.",
  },
  // ── International ──────────────────────────────────────────────────────────
  {
    id: 1,
    name: 'Kyoto',
    country: 'Japan',
    region: 'Asia',
    cost_index: 210,
    popularity_score: 96,
    image_url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80',
    description: 'A calm, culture-rich city with gardens, ryokans, and atmospheric evening streets.',
  },
  {
    id: 2,
    name: 'Lisbon',
    country: 'Portugal',
    region: 'Europe',
    cost_index: 160,
    popularity_score: 91,
    image_url: 'https://images.unsplash.com/photo-1513735492246-483525079686?auto=format&fit=crop&w=1000&q=80',
    description: 'Hilltop viewpoints, pastel trams, tiled facades, and excellent food for the price.',
  },
  {
    id: 3,
    name: 'Marrakech',
    country: 'Morocco',
    region: 'Africa',
    cost_index: 130,
    popularity_score: 87,
    image_url: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1000&q=80',
    description: 'Courtyard riads, artisan souks, and desert gateways with a warm palette.',
  },
  {
    id: 4,
    name: 'Vancouver',
    country: 'Canada',
    region: 'North America',
    cost_index: 240,
    popularity_score: 84,
    image_url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1000&q=80',
    description: 'A polished city base for forests, mountains, design hotels, and waterfront dining.',
  },
  {
    id: 5,
    name: 'Bali',
    country: 'Indonesia',
    region: 'Asia',
    cost_index: 120,
    popularity_score: 93,
    image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80',
    description: 'Tropical villas, surf mornings, lush interiors, and restorative wellness stays.',
  },
  {
    id: 6,
    name: 'Reykjavik',
    country: 'Iceland',
    region: 'Europe',
    cost_index: 320,
    popularity_score: 82,
    image_url: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1000&q=80',
    description: 'The launchpad for road trips through black sand beaches, lava fields, and glaciers.',
  },
];

export const activityDirectory = [
  {
    id: 101,
    city_id: 1,
    name: ‘Arashiyama Bamboo Sunrise Walk’,
    description: ‘Early-entry guided walk through bamboo groves with a tea stop.’,
    type: ‘cultural’,
    cost: 3750,
    duration_minutes: 150,
    image_url:
      ‘https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=800&q=80’,
  },
  {
    id: 102,
    city_id: 2,
    name: ‘Lisbon Sunset Sailing’,
    description: ‘A Tagus River cruise with skyline views and local wine pairings.’,
    type: ‘relaxation’,
    cost: 6200,
    duration_minutes: 180,
    image_url:
      ‘https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80’,
  },
  {
    id: 103,
    city_id: 5,
    name: ‘Ubud Culinary Trail’,
    description: ‘A small-group food walk across family kitchens and hidden stalls.’,
    type: ‘food’,
    cost: 5000,
    duration_minutes: 210,
    image_url:
      ‘https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80’,
  },
  {
    id: 104,
    city_id: 6,
    name: ‘South Coast Waterfall Expedition’,
    description: ‘A full-day photo-forward journey through Iceland’s dramatic coastal route.’,
    type: ‘adventure’,
    cost: 12000,
    duration_minutes: 540,
    image_url:
      ‘https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80’,
  },
  {
    id: 105,
    city_id: 4,
    name: ‘Seawall Bike + Brunch’,
    description: ‘A coastal bike circuit capped with a waterfront brunch reservation.’,
    type: ‘physical’,
    cost: 4600,
    duration_minutes: 180,
    image_url:
      ‘https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80’,
  },
  {
    id: 106,
    city_id: 3,
    name: ‘Medina Craft Workshop’,
    description: ‘Hands-on ceramics and leathercraft inside a restored riad atelier.’,
    type: ‘cultural’,
    cost: 2900,
    duration_minutes: 120,
    image_url:
      ‘https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80’,
  },
];

const seedTrips = [
  {
    id: 101,
    name: 'Mediterranean Summer Circuit',
    description:
      'A design-forward June trip balancing city energy in Lisbon with slower seaside time along the Algarve.',
    start_date: '2026-06-12',
    end_date: '2026-06-24',
    cover_photo_url:
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
    budget: 565000,
    is_public: true,
    traveler: {
      name: 'Mila Santos',
      location: 'Porto, Portugal',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    },
    progress: 82,
    sections: [
      {
        id: '101-1',
        type: 'stay',
        city: 'Lisbon',
        title: 'Design hotel base in Alfama',
        description: 'Three nights in a boutique stay with walking access to tram lines and late dinners.',
        start_date: '2026-06-12',
        end_date: '2026-06-15',
        budget: 100000,
      },
      {
        id: '101-2',
        type: 'experience',
        city: 'Lisbon',
        title: 'River sailing and food crawl',
        description: 'One curated sunset sail plus a chef-led route through local taverns.',
        start_date: '2026-06-14',
        end_date: '2026-06-14',
        budget: 23500,
      },
      {
        id: '101-3',
        type: 'transfer',
        city: 'Lagos',
        title: 'Scenic rail transfer to the Algarve',
        description: 'Reserved train seats with hotel pickup on arrival.',
        start_date: '2026-06-15',
        end_date: '2026-06-15',
        budget: 15000,
      },
      {
        id: '101-4',
        type: 'stay',
        city: 'Lagos',
        title: 'Cliffside villa stay',
        description: 'Ocean-facing suite, private breakfast deck, and flexible beach club access.',
        start_date: '2026-06-15',
        end_date: '2026-06-24',
        budget: 220000,
      },
    ],
    checklist: [
      { id: 'cl-1', name: 'Passport', category: 'Documents', is_packed: true },
      { id: 'cl-2', name: 'Universal adapter', category: 'Electronics', is_packed: true },
      { id: 'cl-3', name: 'Light linen outfits', category: 'Clothing', is_packed: false },
      { id: 'cl-4', name: 'Beach footwear', category: 'Clothing', is_packed: false },
      { id: 'cl-5', name: 'Travel insurance PDF', category: 'Documents', is_packed: true },
    ],
    notes: [
      {
        id: 'nt-1',
        filter: 'all',
        title: 'Dinner shortlist',
        body: 'Reserve Prado early and keep one night open for a spontaneous neighborhood spot.',
        timestamp: '2026-05-04T18:00:00Z',
      },
      {
        id: 'nt-2',
        filter: 'stop',
        title: 'Beach day buffer',
        body: 'Protect June 20 from over-scheduling in case the weather is perfect.',
        timestamp: '2026-05-06T08:45:00Z',
      },
    ],
  },
  {
    id: 102,
    name: 'Kyoto Quiet Luxury Escape',
    description:
      'A slower Japan itinerary focused on gardens, tea houses, and compact cultural experiences.',
    start_date: '2026-04-04',
    end_date: '2026-04-10',
    cover_photo_url:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    budget: 350000,
    is_public: false,
    traveler: {
      name: 'Noah Bennett',
      location: 'Seattle, USA',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    },
    progress: 100,
    sections: [
      {
        id: '102-1',
        type: 'stay',
        city: 'Kyoto',
        title: 'Ryokan in Higashiyama',
        description: 'Tatami suite, kaiseki dinner, and private bath reservations.',
        start_date: '2026-04-04',
        end_date: '2026-04-07',
        budget: 133000,
      },
      {
        id: '102-2',
        type: 'experience',
        city: 'Kyoto',
        title: 'Temple and tea pairing',
        description: 'Morning in Gion followed by a tea workshop with a local ceramic artist.',
        start_date: '2026-04-05',
        end_date: '2026-04-05',
        budget: 20000,
      },
      {
        id: '102-3',
        type: 'wellness',
        city: 'Kyoto',
        title: 'Garden spa afternoon',
        description: 'A soft recovery day with a massage and evening onsen session.',
        start_date: '2026-04-08',
        end_date: '2026-04-08',
        budget: 26600,
      },
    ],
    checklist: [
      { id: 'cl-6', name: 'eSIM activated', category: 'Electronics', is_packed: true },
      { id: 'cl-7', name: 'Camera battery', category: 'Electronics', is_packed: true },
      { id: 'cl-8', name: 'Pocket umbrella', category: 'General', is_packed: true },
    ],
    notes: [
      {
        id: 'nt-3',
        filter: 'day',
        title: 'Fushimi Inari timing',
        body: 'Go before 7:00 AM to avoid crowds and keep the rest of the day relaxed.',
        timestamp: '2026-03-22T07:10:00Z',
      },
    ],
  },
  {
    id: 103,
    name: 'Bali Creative Retreat',
    description:
      'A two-week work-and-reset trip with villa time, wellness sessions, and a few deliberate excursions.',
    start_date: '2026-08-18',
    end_date: '2026-09-01',
    cover_photo_url:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    budget: 290000,
    is_public: true,
    traveler: {
      name: 'Ava Kim',
      location: 'Singapore',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
    },
    progress: 56,
    sections: [
      {
        id: '103-1',
        type: 'stay',
        city: 'Ubud',
        title: 'Jungle villa base',
        description: 'Long-stay workspace villa with poolside mornings and a quiet writing nook.',
        start_date: '2026-08-18',
        end_date: '2026-08-25',
        budget: 112000,
      },
      {
        id: '103-2',
        type: 'experience',
        city: 'Ubud',
        title: 'Cooking lab + market walk',
        description: 'Hands-on Balinese cooking workshop with ingredients sourced that same morning.',
        start_date: '2026-08-20',
        end_date: '2026-08-20',
        budget: 7500,
      },
      {
        id: '103-3',
        type: 'stay',
        city: 'Canggu',
        title: 'Beach club close-out',
        description: 'Final coastal stretch for surf lessons, dinners, and a softer social rhythm.',
        start_date: '2026-08-25',
        end_date: '2026-09-01',
        budget: 81500,
      },
    ],
    checklist: [
      { id: 'cl-9', name: 'Portable SSD', category: 'Electronics', is_packed: false },
      { id: 'cl-10', name: 'Yoga set', category: 'Clothing', is_packed: true },
      { id: 'cl-11', name: 'Travel journal', category: 'General', is_packed: false },
    ],
    notes: [
      {
        id: 'nt-4',
        filter: 'all',
        title: 'Work cadence',
        body: 'Keep Tuesdays and Thursdays light on excursions so project calls stay calm.',
        timestamp: '2026-05-01T12:30:00Z',
      },
    ],
  },
];

export const communityTrips = [
  {
    ...seedTrips[0],
    social_proof: 'Copied 148 times',
    tags: ['Summer', 'Seaside', 'Food'],
    popularity_score: 98,
  },
  {
    ...seedTrips[2],
    social_proof: 'Saved by 92 creators',
    tags: ['Retreat', 'Wellness', 'Remote work'],
    popularity_score: 93,
  },
  {
    id: 204,
    name: 'Nordic Winter Cinematic Route',
    description: 'Oslo, Bergen, and Tromso with train windows, saunas, and aurora nights.',
    start_date: '2026-01-11',
    end_date: '2026-01-19',
    cover_photo_url:
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
    budget: 490000,
    is_public: true,
    traveler: {
      name: 'Lucas Meyer',
      location: 'Berlin, Germany',
      avatar:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    },
    progress: 100,
    social_proof: 'Featured this week',
    tags: ['Winter', 'Photography', 'Scenic rail'],
    popularity_score: 89,
    sections: [
      {
        id: '204-1',
        type: 'stay',
        city: 'Oslo',
        title: 'Design-forward first stop',
        description: 'Museum district hotel with fjord-facing architecture and short city walks.',
        start_date: '2026-01-11',
        end_date: '2026-01-13',
        budget: 91500,
      },
      {
        id: '204-2',
        type: 'transfer',
        city: 'Bergen',
        title: 'Bergen Railway day journey',
        description: 'Scenic windows, reserved seats, and a photo-first pace.',
        start_date: '2026-01-13',
        end_date: '2026-01-13',
        budget: 17500,
      },
    ],
    checklist: [],
    notes: [],
  },
];

export const adminInsights = {
  users: [
    { id: 1, name: 'Mila Santos', email: 'mila@example.com', role: 'traveler', trips: 6, joined: '2025-09-12' },
    { id: 2, name: 'Ava Kim', email: 'ava@example.com', role: 'traveler', trips: 3, joined: '2026-01-09' },
    { id: 3, name: 'Dev Admin', email: 'admin@traveloop.dev', role: 'admin', trips: 2, joined: '2025-07-22' },
  ],
  cities: [
    { name: 'Kyoto', trips: 184, growth: '+12%' },
    { name: 'Lisbon', trips: 159, growth: '+9%' },
    { name: 'Bali', trips: 148, growth: '+18%' },
    { name: 'Reykjavik', trips: 96, growth: '+22%' },
  ],
  activities: [
    { name: 'Sunset sailing', type: 'relaxation', bookings: 88 },
    { name: 'Food trail', type: 'food', bookings: 74 },
    { name: 'Temple walk', type: 'cultural', bookings: 70 },
    { name: 'Wellness day', type: 'relaxation', bookings: 51 },
  ],
  userTrends: [
    { month: 'Jan', signups: 120, trips: 210 },
    { month: 'Feb', signups: 140, trips: 245 },
    { month: 'Mar', signups: 168, trips: 288 },
    { month: 'Apr', signups: 192, trips: 334 },
    { month: 'May', signups: 226, trips: 372 },
  ],
};

export const profileFallback = {
  first_name: 'Aryan',
  last_name: 'Maurya',
  email: 'aryan@traveloop.dev',
  phone: '+91 98765 43210',
  city: 'Bengaluru',
  country: 'India',
  language_pref: 'en',
  role: 'admin',
  profile_photo_url:
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  saved_destinations: cityDirectory.slice(0, 4),
};

const LOCAL_TRIPS_KEY = 'traveloop.local.trips';

export const hydrateTrip = (trip) => {
  const sections = trip.sections ?? [];
  const budget = Number(trip.budget ?? sections.reduce((sum, section) => sum + Number(section.budget ?? 0), 0));
  const status = trip.status ?? deriveStatus(trip.start_date, trip.end_date);
  const duration = getTripDuration(trip.start_date, trip.end_date) ?? 'Plan in progress';
  const destinations = new Set(sections.map((section) => section.city).filter(Boolean));
  const spent = sections.reduce((sum, section) => sum + Number(section.budget ?? 0), 0);
  const invoiceStatus = spent > budget ? 'Over budget' : status === 'Completed' ? 'Paid' : 'Pending';

  return {
    ...trip,
    status,
    budget,
    progress: trip.progress ?? Math.min(100, 25 + sections.length * 18),
    duration,
    destinations_count: trip.destinations_count ?? (destinations.size || 1),
    date_range: formatDateRange(trip.start_date, trip.end_date),
    hero_fact:
      trip.hero_fact ??
      `${destinations.size || 1} stop${destinations.size === 1 ? '' : 's'} mapped across ${duration}.`,
    summary: trip.summary ?? trip.description,
    invoice:
      trip.invoice ??
      {
        invoice_id: `INV-${trip.id}`,
        status: invoiceStatus,
        subtotal: spent,
        tax: Math.round(spent * 0.05),
        discount: spent > 200000 ? 5000 : 0,
        total: Math.round(spent * 1.05) - (spent > 200000 ? 5000 : 0),
        line_items: sections.map((section, index) => ({
          id: `${trip.id}-li-${index + 1}`,
          category: section.type,
          description: `${section.title} • ${section.city}`,
          qty: 1,
          unit_cost: Number(section.budget ?? 0),
          amount: Number(section.budget ?? 0),
        })),
      },
  };
};

export const getSeedTrips = () => seedTrips.map(hydrateTrip);

export const getLocalTrips = () => {
  if (typeof window === 'undefined') return [];

  try {
    const stored = window.localStorage.getItem(LOCAL_TRIPS_KEY);
    if (!stored) return [];

    return JSON.parse(stored).map(hydrateTrip);
  } catch (error) {
    console.warn('Unable to read local trips', error);
    return [];
  }
};

const persistLocalTrips = (trips) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LOCAL_TRIPS_KEY, JSON.stringify(trips));
};

export const getAllTrips = () => {
  const localTrips = getLocalTrips();
  return [...localTrips, ...getSeedTrips()];
};

export const getTripById = (tripId) => getAllTrips().find((trip) => String(trip.id) === String(tripId));

export const createLocalTrip = (payload) => {
  const trip = hydrateTrip({
    id: Date.now(),
    name: payload.name,
    description: payload.description,
    start_date: payload.start_date,
    end_date: payload.end_date,
    cover_photo_url: payload.cover_photo_url || coverFallback,
    budget: Number(payload.budget ?? 0),
    is_public: Boolean(payload.is_public),
    progress: 18,
    traveler: profileFallback,
    sections: payload.destination
      ? [
          {
            id: `${Date.now()}-section-1`,
            type: 'stay',
            city: payload.destination,
            title: `First stay in ${payload.destination}`,
            description: 'Your first trip section is ready for itinerary planning.',
            start_date: payload.start_date,
            end_date: payload.end_date,
            budget: Number(payload.budget ?? 0) * 0.45 || 8000,
          },
        ]
      : [],
    checklist: [],
    notes: [],
  });

  const current = getLocalTrips();
  persistLocalTrips([trip, ...current]);
  return trip;
};

export const removeLocalTrip = (tripId) => {
  const current = getLocalTrips();
  persistLocalTrips(current.filter((trip) => String(trip.id) !== String(tripId)));
};

export const getDashboardSnapshot = () => {
  const trips = getAllTrips();
  const activeTrips = trips.filter((trip) => trip.status === 'Ongoing').length;
  const upcomingTrips = trips.filter((trip) => trip.status === 'Upcoming').length;
  const totalBudget = trips.reduce((sum, trip) => sum + Number(trip.budget ?? 0), 0);
  const packedItems = trips.reduce(
    (sum, trip) => sum + (trip.checklist ?? []).filter((item) => item.is_packed).length,
    0,
  );

  return {
    stats: [
      { label: 'Active journeys', value: activeTrips, hint: `${upcomingTrips} more upcoming` },
      { label: 'Tracked budget', value: formatCurrency(totalBudget), hint: 'Across your saved trips' },
      { label: 'Packed essentials', value: packedItems, hint: 'Checklist items already ready' },
    ],
    trips: trips.slice(0, 3),
  };
};

export const getChecklistProgress = (items) => {
  const packed = items.filter((item) => item.is_packed).length;
  return {
    packed,
    total: items.length,
    percent: toPercent(packed, items.length),
  };
};
