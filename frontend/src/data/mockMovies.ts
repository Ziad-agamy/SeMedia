export type Movie = {
  id: string;
  title: string;
  year: number;
  director: string;
  genres: string[];
  runtime: string;
  imdb: number;
  rt: number;
  match: number;
  platform: string;
  posterGradient: string;   
  bannerGradient: string;
  explanation: string;
  shortExplanation: string;
  cast: string[];
  reviewSnippets: { author: string; text: string }[];
};

export const moodSummary =
  "You're craving something emotionally heavy but ultimately redemptive — a film that leaves you feeling wrung out and hopeful at the same time.";

export const moodTags = ["Melancholic", "Hopeful", "Slow Burn", "Character-Driven"];

export const mockMovies: Movie[] = [
  {
    id: "1",
    title: "Eternal Sunshine of the Spotless Mind",
    year: 2004,
    director: "Michel Gondry",
    genres: ["Drama", "Romance", "Sci-Fi"],
    runtime: "1h 48m",
    imdb: 8.3,
    rt: 92,
    match: 96,
    platform: "Prime Video",
    posterGradient: "from-[#3b0764] via-[#0c1445] to-[#4a0030]",
    bannerGradient: "from-[#4a0030] via-[#0c1445] to-[#3b0764]",
    explanation:
      "You mentioned wanting something 'wrung out but hopeful' — this is exactly that. Joel and Clementine's fractured memories unfold like a watercolor running in the rain, painful and luminous in the same breath. It earns its melancholy without ever letting go of tenderness.",
    shortExplanation:
      "Wrung-out and luminous — heartbreak that learns to hope again, painted in fractured memory.",
    cast: ["Jim Carrey", "Kate Winslet", "Mark Ruffalo", "Kirsten Dunst", "Elijah Wood"],
    reviewSnippets: [
      { author: "Roger Ebert", text: "A film that uses science fiction to explore something achingly human." },
      { author: "Letterboxd user", text: "Watched it three times in a row and cried differently each time." },
    ],
  },
  {
    id: "2",
    title: "The Tree of Life",
    year: 2011,
    director: "Terrence Malick",
    genres: ["Drama"],
    runtime: "2h 19m",
    imdb: 6.8,
    rt: 84,
    match: 91,
    platform: "Criterion",
    posterGradient: "from-[#0c1445] via-[#3b0764] to-[#080810]",
    bannerGradient: "from-[#080810] via-[#3b0764] to-[#0c1445]",
    explanation:
      "Cosmic in scope and intimate in detail. Malick's whispered prayer of a film moves through grief like sunlight through leaves — slow, weightless, and quietly redemptive.",
    shortExplanation: "A whispered prayer for the grieving — cosmic, hushed, and quietly redemptive.",
    cast: ["Brad Pitt", "Jessica Chastain", "Sean Penn"],
    reviewSnippets: [{ author: "The Guardian", text: "An astonishing, prayerful film." }],
  },
  {
    id: "3",
    title: "Past Lives",
    year: 2023,
    director: "Celine Song",
    genres: ["Drama", "Romance"],
    runtime: "1h 45m",
    imdb: 7.8,
    rt: 96,
    match: 94,
    platform: "Paramount+",
    posterGradient: "from-[#4a0030] via-[#080810] to-[#0c1445]",
    bannerGradient: "from-[#0c1445] via-[#080810] to-[#4a0030]",
    explanation:
      "A slow burn that aches in the spaces between words. Past Lives understands the particular sadness of paths not taken, and lets it breathe without ever resolving into easy comfort — yet you leave feeling held.",
    shortExplanation: "Aches in the silences. The particular sadness of paths not taken — and held gently.",
    cast: ["Greta Lee", "Teo Yoo", "John Magaro"],
    reviewSnippets: [{ author: "IndieWire", text: "A debut of devastating restraint." }],
  },
  {
    id: "4",
    title: "Manchester by the Sea",
    year: 2016,
    director: "Kenneth Lonergan",
    genres: ["Drama"],
    runtime: "2h 17m",
    imdb: 7.8,
    rt: 96,
    match: 89,
    platform: "Prime Video",
    posterGradient: "from-[#0c1445] via-[#080810] to-[#3b0764]",
    bannerGradient: "from-[#3b0764] via-[#080810] to-[#0c1445]",
    explanation:
      "Heavy in the way you asked for — but it earns every gram of weight. Lonergan refuses catharsis and somehow that refusal becomes its own quiet form of grace.",
    shortExplanation: "Refuses catharsis and finds grace in that refusal. Every ounce of weight earned.",
    cast: ["Casey Affleck", "Michelle Williams", "Lucas Hedges"],
    reviewSnippets: [{ author: "Variety", text: "A masterwork of contained devastation." }],
  },
  {
    id: "5",
    title: "Aftersun",
    year: 2022,
    director: "Charlotte Wells",
    genres: ["Drama"],
    runtime: "1h 42m",
    imdb: 7.6,
    rt: 96,
    match: 93,
    platform: "Mubi",
    posterGradient: "from-[#c026d3]/40 via-[#0c1445] to-[#080810]",
    bannerGradient: "from-[#0c1445] via-[#c026d3]/30 to-[#080810]",
    explanation:
      "A memory film that hums with hindsight. The melancholy here lives in what we can't quite reach — a father, a summer, a feeling — and the hope lives in the act of reaching anyway.",
    shortExplanation: "A memory film humming with hindsight. Hope lives in the reaching.",
    cast: ["Paul Mescal", "Frankie Corio"],
    reviewSnippets: [{ author: "Sight & Sound", text: "An unbearably tender debut." }],
  },
  {
    id: "6",
    title: "Moonlight",
    year: 2016,
    director: "Barry Jenkins",
    genres: ["Drama"],
    runtime: "1h 51m",
    imdb: 7.4,
    rt: 98,
    match: 90,
    platform: "Netflix",
    posterGradient: "from-[#06b6d4]/30 via-[#0c1445] to-[#3b0764]",
    bannerGradient: "from-[#3b0764] via-[#06b6d4]/20 to-[#080810]",
    explanation:
      "Three movements, one tender heartbeat. Moonlight is character-driven in the deepest sense — every frame asks who we become when we are finally allowed to be ourselves.",
    shortExplanation: "Three movements, one tender heartbeat. A film that listens before it speaks.",
    cast: ["Mahershala Ali", "Naomie Harris", "Trevante Rhodes"],
    reviewSnippets: [{ author: "NYT", text: "A film of profound beauty and rare tenderness." }],
  },
  {
    id: "7",
    title: "A Ghost Story",
    year: 2017,
    director: "David Lowery",
    genres: ["Drama", "Fantasy"],
    runtime: "1h 32m",
    imdb: 6.8,
    rt: 92,
    match: 87,
    platform: "Max",
    posterGradient: "from-[#080810] via-[#3b0764] to-[#4a0030]",
    bannerGradient: "from-[#4a0030] via-[#3b0764] to-[#080810]",
    explanation:
      "Patient, strange, unbearably tender. A meditation on time and longing wearing the silliest possible costume — and somehow it shatters you anyway.",
    shortExplanation: "Patient and strange — a meditation on time wearing the silliest costume.",
    cast: ["Casey Affleck", "Rooney Mara"],
    reviewSnippets: [{ author: "AV Club", text: "Quietly devastating." }],
  },
];
