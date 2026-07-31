// Shared content for the 2026 Midwest Open Lockpicking Competition page.
// Two layout variants (Competition.tsx / CompetitionAlt.tsx) render this same data.

export const EVENT = {
  name: '2026 LPU Midwest Open Lockpicking Competition',
  tagline:
    "Whether you're brand new to lockpicking, an experienced locksporter, or just curious, come join us for a full day of learning, friendly competition, and hands-on fun. Free to attend. Free to compete. No experience required. Spectators are welcome!",
  intro:
    'Lockpicks and practice locks will be provided. Feel free to bring your own tools if you prefer. Be part of the first Midwest Open Lockpicking Competition and help establish what we hope becomes an annual Midwest tradition.',
  dateLabel: 'Saturday, November 14, 2026',
  timeLabel: '12:00 PM - 7:00 PM',
  isoStart: '2026-11-14T12:00:00-06:00',
  isoEnd: '2026-11-14T19:00:00-06:00',
  venueName: 'The Babylon',
  venueAddress: '4744 Mid Rivers Mall Dr, St. Peters, MO',
  mapsUrl: 'https://maps.google.com/?q=The+Babylon,+4744+Mid+Rivers+Mall+Dr,+St.+Peters,+MO',
  meetupUrl: 'https://www.meetup.com/gateway-locksport/events/315638644/',
  facebookUrl: 'https://www.facebook.com/share/1FaWKQXPMY/',
}

export const QUICK_FACTS = [
  'Free to attend',
  'Free to compete',
  'No experience required',
  'Picks & locks provided',
  'Spectators welcome',
]

export const RECORDING_NOTICE =
  "Heads up: photos and video will be taken throughout the event for Lockpickers United's promotional and social media use. By attending, you consent to being recorded. If you'd rather not appear on camera, just let a staff member know."

export type ScheduleIcon = 'door' | 'pick' | 'food' | 'escape' | 'trophy'

export interface ScheduleBlock {
  time: string
  endTime?: string
  title: string
  items: string[]
  icon: ScheduleIcon
  highlight?: boolean // main events get the yellow edge + badge treatment
  anchor?: string     // id of the detail section this row links to
}

export const SCHEDULE: ScheduleBlock[] = [
  {
    time: '12:00 PM',
    title: 'Doors Open',
    items: [
      'Babylon opens for casual lockpicking while we finish setting up.',
      'Raffle tickets available for all attendees.',],
    icon: 'door',
  },
  {
    time: '12:30 PM',
    endTime: '3:30 PM',
    title: 'Open Picking & Training',
    items: [
      'Open lockpicking featuring padlocks, deadbolts, combination locks, and more.',
      'Lockpicking 101 presentation - training and practice.',
      'Under the Door Tool Competition starts.',
      'Meet other locksport enthusiasts.',
      'Try the interactive locks and physical security displays.',
    ],
    icon: 'pick',
  },
  {
    time: '3:30 PM',
    endTime: '4:00 PM',
    title: 'Dinner Break',
    items: [
      'Food and drinks available from Babylon.',
      'Raffle winners drawn.',
      'Under the Door competition winner announced. We may extend the time for this event until after the Spy Escape Competition if there are still people trying to beat their best time.',
      'Competition prep.',
    ],
    icon: 'food',
  },
  {
    time: '4:00 PM',
    endTime: '5:30 PM',
    title: 'Spy Escape Competition',
    items: [
      'One of the most exciting events of the day and always a crowd favorite!',
      'Open picking continues at the tables while this is taking place.',
    ],
    icon: 'escape',
    highlight: true,
    anchor: 'spy-escape',
  },
  {
    time: '5:30 PM',
    endTime: '7:00 PM',
    title: 'Midwest Open Lockpicking Competition',
    items: [
      'Three elimination rounds to crown the 2026 Midwest Open Lockpicking Champion.',
    ],
    icon: 'trophy',
    highlight: true,
    anchor: 'midwest-open',
  },
]

export const SPY_ESCAPE_RULES = [
  'Begin with both hands secured in handcuffs.',
  'Pick or shim both handcuffs to free yourself.',
  'Pick the padlock securing the bag in front of you.',
  'Retrieve the Nerf blaster inside the bag.',
  'Hit the gong at the end of the table before your opponent to win!',
]

export const MIDWEST_OPEN_RULES = [
  'Competitors are divided into groups, with each table receiving the same set of locks.',
  'Each competitor has 5 minutes to pick the lock in front of them.',
  'When you successfully open your lock, loudly call "OPEN!" A judge will announce your completion time, write it down.',
  'When the 5-minute timer expires, everyone will pass their lock to the competitor on the left.',
  'A new 5-minute attempt begins with the next lock, until everyone at the table has attempted every lock.',
  'Ranking: most locks opened, with lowest combined times as the tiebreaker.',
  'The top two from each group in Round 1 will advance to Round 2. The winner of each Round 2 group advances to the Final Round.',
]

// For image fields below: set to a path under /public (e.g. '/competition/spy-escape.jpg')
// once photos are ready. An empty string renders a "photo coming soon" placeholder frame.

export interface MainEvent {
  id: string
  title: string
  time: string
  prize: string
  desc: string
  rules: string[]
  image: string
  imageAlt: string
  // YouTube video URL to embed in place of the photo. Leave '' for a
  // "video coming soon" placeholder. When set, this takes priority over image.
  video?: string
  showPrepVideos?: boolean
}

export const MAIN_EVENTS: MainEvent[] = [
  {
    id: 'spy-escape',
    title: 'Spy Escape Competition',
    time: '4:00 PM - 5:30 PM',
    prize: 'Engraved handcuffs for 1st & 2nd place',
    desc: 'One of the most exciting events of the day and always a crowd favorite! This is a bracket head-to-head style competition. Everyone can still pick and practice at the tables while this is taking place.',
    rules: SPY_ESCAPE_RULES,
    image: '',
    imageAlt: 'Spy Escape Competition',
    video: 'https://youtube.com/shorts/tH1MZCNWgH4',
    showPrepVideos: true,
  },
  {
    id: 'midwest-open',
    title: 'Midwest Open Lockpicking Competition',
    time: '5:30 PM - 7:00 PM',
    prize: 'Engraved PacLock for 1st, 2nd, & 3rd place',
    desc: 'Three elimination rounds to crown the 2026 Midwest Open Lockpicking Champion.',
    rules: MIDWEST_OPEN_RULES,
    image: '',
    imageAlt: 'Midwest Open Lockpicking Competition',
  },
]

export interface Contest {
  title: string
  prize?: string
  details: string[]
  image: string
  imageAlt: string
}

export const SIDE_CONTESTS: Contest[] = [
  {
    title: 'Under the Door Tool Competition',
    prize: 'Fastest time wins',
    details: [
      'Use the under-door tool entry technique on our half door training station.',
      'Multiple attempts allowed - keep trying to beat your best time all afternoon.',
    ],
    image: '/competition/Half door.jfif',
    imageAlt: 'Under the door tool station',
  },
  {
    title: 'Door Raffle',
    prize: 'Multiple winners',
    details: [
      'Every person that shows up gets a raffle ticket.',
      'Winners drawn during the dinner break.',
    ],
    image: '/competition/raffle.jfif',
    imageAlt: 'Door raffle prizes',
  },
]

export interface PrepVideo {
  title: string
  tag: string
  url: string
}

export const PREP_VIDEOS: PrepVideo[] = [
  {
    title: 'How-To Pick Handcuffs with a Bobby Pin',
    tag: 'Short Video',
    url: 'https://www.youtube.com/watch?v=PS-8U_dcTzs',
  },
  {
    title: 'How to Pick Handcuffs with a Bobby Pin',
    tag: 'Full tutorial',
    url: 'https://www.youtube.com/watch?v=j036yjyKlmQ',
  },
  {
    title: 'How to Shim Handcuffs with a Hair Clip',
    tag: 'Short Video',
    url: 'https://www.youtube.com/watch?v=dOy9MMHJTY4',
  },
  {
    title: 'How to Shim & Bypass Handcuffs',
    tag: 'Full tutorial',
    url: 'https://www.youtube.com/watch?v=qc5ulBP_lgc',
  },
]

export interface Activity {
  title: string
  desc: string
  image: string
  imageAlt: string
}

export const ACTIVITIES: Activity[] = [
  {
    title: 'Swappable Practice Door',
    desc: 'Mini door with swappable knobs and deadbolts to test the most common residential locks in the USA - Kwikset and Schlage.',
    image: '/competition/swappable door.jfif',
    imageAlt: 'Mni door with swappable knob and deadbolt',
  },
  {
    title: 'Handcuff Table',
    desc: 'Learn to pick and shim handcuffs with bobby pins and hair clips - great practice for the Spy Escape Competition.',
    image: '/competition/Handcuffs.jfif',
    imageAlt: 'Handcuffs',
  },
  {
    title: 'Escape Station',
    desc: 'Learn to break out of zip ties.',
    // desc: 'Learn to break out of zip ties and riot cuffs.',
    image: '/competition/Zip Ties.jfif',
    imageAlt: 'Zip Ties and Riot Cuffs',
  },
  {
    title: 'Locktopus Timed Trials',
    desc: 'Test your speed and skill against the clock with the Locktopus. Perfect practice for the Midwest Open Lockpicking Competition.',
    image: '/competition/Locktopus.png',
    imageAlt: '',
  },
  // {
  //   title: 'Gun Lock Cable Cutting Station',
  //   desc: 'Feel for yourself how easily hand bolt cutters go through gun lock cables.',
  //   image: '/competition/Cable gun locks with Bolt Cutters.jfif',
  //   imageAlt: 'Gun lock cables with bolt cutters',
  // },
  {
    title: 'Cutaway & Gutted Locks',
    desc: 'See exactly how different locking mechanisms work - including "ungutable" locks, gutted.',
    image: '/competition/american lock cutaway.jfif',
    imageAlt: 'American Lock cutaway lock',
  },
  {
    title: 'Locks from Around the World',
    desc: 'See how physical security varies dramatically between countries.',
    image: '/competition/Fichet Display.jpeg',
    imageAlt: '',
  },
]

export const BRING_LOCKS =
  'Have locks to show off, sell, or donate to the group? Bring them!'

export interface Sponsor {
  name: string
  url: string
  urlLabel: string
  blurb: string
  logo: string
  logoAlt: string
  pending?: boolean // dims the card and disables its link until they confirm
}

// Set logo to a path under /public (e.g. '/competition/paclock-logo.png') once
// logo files are ready. An empty string renders the sponsor name in large type instead.
export const SPONSORS: Sponsor[] = [
  {
    name: 'PACLOCK',
    url: 'https://paclock.com/',
    urlLabel: 'PACLOCK.com',
    blurb: 'American-made padlocks and security products, built in the USA.',
    logo: '/competition/Paclock.png',
    logoAlt: 'PACLOCK logo',
  },
  {
    name: 'Covert Instruments',
    url: 'https://covertinstruments.com/',
    urlLabel: 'CovertInstruments.com',
    blurb: 'Quality lockpicks and covert entry tools for locksport enthusiasts.',
    logo: '/competition/CI.png',
    logoAlt: 'Covert Instruments logo',
  },
  // {
  //   name: 'Handcuff Sponsor Name Here',
  //   url: 'https://Sponsor.com/',
  //   urlLabel: 'Sponsor.com',
  //   blurb: 'Handcuffs and restraint gear for the Spy Escape Competition.',
  //   logo: '',
  //   logoAlt: 'Handcuff sponsor logo',
  //   pending: true,
  // },
]

export interface SaleItem {
  title: string
  desc: string
  price: string
  image: string
  imageAlt: string
}

// price is displayed as-is (e.g. '$20'); leave it '' to hide the price chip.
export const SALE_ITEMS: SaleItem[] = [
  {
    title: 'Beginner Lockpick Set',
    desc: 'Everything you need to start picking - a great first kit to take home.',
    price: '',
    image: '/competition/CI Genesis - Square.JPG',
    imageAlt: 'Beginner lockpick set',
  },
  {
    title: 'Full Lockpick Set',
    desc: 'A larger set of picks and turning tools for pickers ready to go deeper.',
    price: '',
    image: '',
    imageAlt: 'Full lockpick set',
  },
  {
    title: 'Practice Lock Set',
    desc: 'Progressively pinned practice locks that grow with your skills.',
    price: '',
    image: '/products/Practice Lock Kit.JPG',
    imageAlt: 'Practice lock set',
  },
  {
    title: 'Clear Practice Lock Set',
    desc: 'See-through locks that show exactly what your pick is doing inside.',
    price: '',
    image: '',
    imageAlt: 'Clear practice lock set',
  },
]
