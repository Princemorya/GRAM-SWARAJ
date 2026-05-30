import { VillageCommunity, Incident, MarketplaceItem, GroupMessage, EmergencyBroadcast } from '../types';

export const INITIAL_COMMUNITIES: VillageCommunity[] = [
  {
    id: 'up_baheri',
    name: 'Baheri Block North',
    state: 'Uttar Pradesh',
    district: 'Bareilly',
    region: 'North Bareilly Zone',
    population: 1850
  },
  {
    id: 'up_faridpur',
    name: 'Faridpur Devra',
    state: 'Uttar Pradesh',
    district: 'Bareilly',
    region: 'South Bareilly Highway Zone',
    population: 2400
  }
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'inc_up_1',
    title: 'Broken Handpump near High School (नल खराब है)',
    description: 'The main handpump handle is completely broken near the junior high school. Small children and neighborhood farmers are unable to fetch clean drinking water. Ground water is also slightly turbid.',
    category: 'Water',
    severity: 'High',
    status: 'Investigating',
    villageId: 'up_baheri',
    reporterName: 'Amit Patel',
    reporterPhone: '+91 94501 23456',
    reporterId: 'user_resident_1',
    isAnonymous: false,
    imageUrl: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=600',
    createdAt: '2026-05-27T10:30:00Z',
    updatedAt: '2026-05-28T14:15:00Z',
    upvotes: 14,
    upvotedBy: ['+91 98765 43210', '+91 94112 23344'],
    comments: [
      {
        id: 'c_1',
        authorName: 'Ramesh Singh',
        authorRole: 'Resident',
        message: 'Direct sun is heavy, and safe water is needed urgently for classes.',
        createdAt: '2026-05-27T12:00:00Z'
      }
    ],
    progressUpdates: [
      {
        id: 'prog_1',
        updaterName: 'Pradhan Rajesh Kumar',
        status: 'Investigating',
        notes: 'Sanctioned INR 1800 from development fund. Hardware merchant in Baheri contacted for spares.',
        timestamp: '2026-05-27T16:00:00Z'
      }
    ]
  },
  {
    id: 'inc_up_2',
    title: 'Primary Electric Line Hanging Low (बिजली का तार बहुत नीचे है)',
    description: 'Following Tuesday winds, a thick grid connection cable snapped from the pole and is hanging low just 5 feet above the canal path. Highly dangerous for sugarcane carts and cattle.',
    category: 'Power',
    severity: 'Critical',
    status: 'Scheduled',
    villageId: 'up_faridpur',
    reporterName: 'Sanjay Yadav',
    reporterPhone: '+91 91223 34455',
    reporterId: 'user_resident_2',
    isAnonymous: true,
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=600',
    createdAt: '2026-05-28T08:00:00Z',
    updatedAt: '2026-05-28T09:00:00Z',
    upvotes: 27,
    upvotedBy: ['+91 94501 23456'],
    comments: [],
    progressUpdates: [
      {
        id: 'prog_2',
        updaterName: 'Pradhan Shanti Devi',
        status: 'Scheduled',
        notes: 'Informed Bareilly rural electricity subdivision. Distribution line is isolated temporarily.',
        timestamp: '2026-05-28T09:00:00Z'
      }
    ]
  },
  {
    id: 'inc_up_3',
    title: 'Potholes Blocking Baheri Supply Road (सड़क पर गहरे गड्ढे हैं)',
    description: 'Massive craters have expanded on the central link road leading to the cooperative sugar mill. Tractors are getting stuck, halting harvest freight transportation.',
    category: 'Roads',
    severity: 'Medium',
    status: 'Pending',
    villageId: 'up_baheri',
    reporterName: 'Vijay Maurya',
    reporterPhone: '+91 99887 76655',
    reporterId: 'user_resident_3',
    isAnonymous: false,
    imageUrl: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=600',
    createdAt: '2026-05-29T09:00:00Z',
    updatedAt: '2026-05-29T09:00:00Z',
    upvotes: 9,
    upvotedBy: [],
    comments: [],
    progressUpdates: []
  }
];

export const INITIAL_MARKETPLACE: MarketplaceItem[] = [
  {
    id: 'm_1',
    title: 'Sonalika DI 35 Tractor for Hire (जोताई के लिए ट्रैक्टर)',
    description: 'Available for daily or hourly hire with rotavator and cultivator attachments. Expert driver provided. Fuel costs borne by hirer.',
    price: '₹800 / hour',
    category: 'Services',
    contactName: 'Sohan Singh',
    contactPhone: '+91 98876 54321',
    imageUrl: 'https://images.unsplash.com/photo-1605117882932-f9e32b03fea9?auto=format&fit=crop&q=80&w=600',
    isAvailable: true,
    createdAt: '2026-05-27T15:00:00Z',
    postedBy: '+91 98876 54321'
  },
  {
    id: 'm_2',
    title: 'Paddy Harvesting Labor Needed (धान कटाई के लिए मजदूर)',
    description: 'Need 12 daily-wage workers for paddy/rice harvesting starting Monday. Mid-day meal and filter drinking water provided on site.',
    price: '₹400 / day',
    category: 'Jobs',
    contactName: 'Ram Kishan',
    contactPhone: '+91 94112 23344',
    isAvailable: true,
    createdAt: '2026-05-28T11:00:00Z',
    postedBy: '+91 94112 23344'
  },
  {
    id: 'm_3',
    title: 'Certified Basmati Rice Seeds (बासमती धान बीज)',
    description: 'High-yield certified Pusa Basmati seeds, treated for disease prevention. 25kg bags available. Best quality for farm block Bareilly.',
    price: '₹1,200 / bag',
    category: 'Goods',
    contactName: 'Kalyan Agro Spares',
    contactPhone: '+91 94220 11002',
    imageUrl: 'https://images.unsplash.com/photo-1574325131876-a799ed791500?auto=format&fit=crop&q=80&w=600',
    isAvailable: true,
    createdAt: '2026-05-29T08:30:00Z',
    postedBy: '+91 94220 11002'
  }
];

export const INITIAL_GROUP_MESSAGES: GroupMessage[] = [
  {
    id: 'msg_f_1',
    group: 'Farmers',
    senderName: 'Sohan Das',
    senderPhone: '+91 98876 54321',
    message: 'Is anyone noticing brown spots on their paddy nursery seedlings this week? BAU experts suggest a light copper hydroxide spray.',
    isAnonymous: false,
    createdAt: '2026-05-28T16:30:00Z'
  },
  {
    id: 'msg_f_2',
    group: 'Farmers',
    senderName: 'Anonymous Farmer',
    senderPhone: '+91 94112 23344',
    message: 'Yes, neighbor! I did the spray yesterday, spots are controlled. Let’s clean the outlet canal as well to avoid clogging.',
    isAnonymous: true,
    createdAt: '2026-05-29T07:45:00Z'
  },
  {
    id: 'msg_y_1',
    group: 'Youth',
    senderName: 'Vikas Patel',
    senderPhone: '+91 94501 23456',
    message: 'We are organizing a clean-up drive around the community center pond this Sunday at 8 AM. Please join and bring spades if available!',
    isAnonymous: false,
    createdAt: '2026-05-29T10:00:00Z'
  },
  {
    id: 'msg_w_1',
    group: 'Women',
    senderName: 'Sushila Devi',
    senderPhone: '+91 91223 34455',
    message: 'The self-help group accounts are updated. Loan applications for purchase of sewing machines are ready for submissions in standard office.',
    isAnonymous: false,
    createdAt: '2026-05-29T12:30:00Z'
  }
];

export const INITIAL_BROADCASTS: EmergencyBroadcast[] = [
  {
    id: 'br_1',
    title: 'Monsoon Heavy Thunderstorm Warning (आंधी-तूफान की चेतावनी)',
    message: 'Bareilly Met Office issues yellow warning. Heavy rainfall and lightning expected within next 12 hours. Farmers are advised to move sugar/paddy stocks to covered storage and keep livestock protected indoors.',
    createdAt: '2026-05-29T16:00:00Z',
    severity: 'Immediate',
    postedBy: 'Pradhan Rajesh Kumar'
  },
  {
    id: 'br_2',
    title: 'Free Polio Vaccination Camp (मुफ्त टीकाकरण शिविर)',
    message: 'Primary Health Center of Baheri division is conducting a comprehensive polio and immunization camp for children below 5 years on Sunday morning in Panchayat Bhawan. Asha workers will visit. Ensure full participation!',
    createdAt: '2026-05-29T11:00:00Z',
    severity: 'Important',
    postedBy: 'Pradhan Rajesh Kumar'
  }
];
