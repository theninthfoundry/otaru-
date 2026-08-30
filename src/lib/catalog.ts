export interface Product {
  name: string;
  category: string;
  price: number;
  objectNumber: string;
  firstRelease: string;
  runQuantity: string;
  origin: string;
  material: string;
  construction: string;
  fitNotes: string;
  care: string;
  story: string;
  longevityStory: string;
  specs: [string, string][];
  sizes: [string, number][];
}

export const CARE_SETS: Record<string, string[]> = {
  indigo: [
    "Cold wash sparingly — the botanical indigo develops natural high-contrast fades at friction points",
    "Line dry out of direct harsh sun to preserve depth of dye",
    "Do not tumble dry",
    "Steam rather than iron to maintain natural canvas drape"
  ],
  silk: [
    "Hand wash cold with neutral detergent, or specialist eco-dry clean",
    "Lay flat in shade to dry",
    "Cool iron on the reverse only when completely dry"
  ],
  wool: [
    "Spot clean with cold water and natural wool soap",
    "Dry clean only for seasonal deep refreshes",
    "Do not machine wash or agitate while wet",
    "Store folded with cedar blocks, never hung"
  ],
  hemp: [
    "Machine wash cold on gentle cycle with minimal agitation",
    "Line dry — bast hemp fibers soften and drape more fluidly with every wash",
    "Skip synthetic fabric softeners; they coat the natural hollow fibers"
  ],
  linen: [
    "Machine wash cold, delicate cycle",
    "Line dry flat",
    "Iron warm while still slightly damp for crisp architectural creases"
  ],
  waxed: [
    "Brush off dried mud; sponge down with cold water",
    "Re-wax with natural beeswax blend once a year",
    "Never machine wash or expose to direct artificial heating"
  ],
  rawwool: [
    "Spot clean only with cold water",
    "Dry flat on clean towel",
    "Store folded in breathable canvas pouch"
  ]
};

export const PRODUCT_CATALOG: Record<string, Product> = {
  "041": {
    name: "Yama Field Jacket",
    category: "Outerwear",
    price: 480,
    objectNumber: "OBJECT 041",
    firstRelease: "MMXXVI · CHAPTER I",
    runQuantity: "44 PIECES WORLDWIDE",
    origin: "TOKUSHIMA · OTARU WAREHOUSE",
    material: "14.5oz raw indigo cotton canvas, woven on 1968 Toyoda G3 shuttle loom in Tokushima",
    construction: "Half-lined in undyed river-washed cotton, blackened brass hardware, triple-needle felled seams at all high-tension points",
    fitNotes: "Relaxed through the body. Designed to sit slightly away from the shoulder with room for heavy knitwear. Model is 185cm wearing Size M.",
    care: "indigo",
    story: "We cut the first run of this jacket from canvas originally rejected by an ocean sailmaker — the weight was slightly irregular, wrong for a high-tension mainsail, perfect for an archival jacket meant to soften and crease with ten winters of movement. Four seasons on, it remains the piece most often returned to our studio for a visible boro repair rather than a replacement.",
    longevityStory: "We do not believe a jacket ends when a seam gives way. Every Yama Field Jacket is covered under our lifetime canal studio repair ledger.",
    specs: [
      ["Object ID", "ARC-041-YMA"],
      ["Weave", "3/1 Right-Hand Botanical Twill"],
      ["Loom", "Toyoda G3 Vintage Shuttle"],
      ["Hardware", "Solid Raw Brass / Matte Finish"],
      ["Chest (M)", "56 cm, laid flat"],
      ["Length (M)", "71 cm"],
      ["Sleeve (M)", "64 cm"]
    ],
    sizes: [["XS", 2], ["S", 4], ["M", 0], ["L", 3], ["XL", 1]]
  },
  "042": {
    name: "Kiryū Wrap Trouser",
    category: "Trousers",
    price: 310,
    objectNumber: "OBJECT 042",
    firstRelease: "MMXXVI · CHAPTER I",
    runQuantity: "38 PIECES WORLDWIDE",
    origin: "KIRYŪ · OTARU WAREHOUSE",
    material: "Sandwashed raw silk and organic hemp blend, woven in historic Kiryū mills",
    construction: "Asymmetric wrap-front closure with interior herringbone tie, single rear welt pocket with hand-sewn bar tacks",
    fitNotes: "Wide architectural cut through thigh with gentle taper. Adjustable interior wrap ties allow 4cm of waist variance. Model is 182cm wearing Size M.",
    care: "silk",
    story: "The wrap closure was adapted from a woodworker's apron pattern discovered in a Kiryū timber mill archive — no restrictive belt loops, no plastic button fly, simply a soft herringbone tie that tightens exactly to the posture of your day.",
    longevityStory: "Constructed with French interior seams and reinforced crotch gusset to endure continuous daily wear.",
    specs: [
      ["Object ID", "ARC-042-KRY"],
      ["Weave", "Matte Crepe Habotai Blend"],
      ["Closure", "Zero-Hardware Internal Herringbone Tie"],
      ["Waist (M)", "74 cm, laid flat (adjustable)"],
      ["Inseam (M)", "72 cm"],
      ["Rise (M)", "32 cm"]
    ],
    sizes: [["XS", 3], ["S", 0], ["M", 5], ["L", 2], ["XL", 2]]
  },
  "043": {
    name: "Biratori Overshirt",
    category: "Tops",
    price: 395,
    objectNumber: "OBJECT 043",
    firstRelease: "MMXXVI · CHAPTER I",
    runQuantity: "32 PIECES WORLDWIDE",
    origin: "BIRATORI · OTARU WAREHOUSE",
    material: "480 gsm boiled melton wool, milled from northern Hokkaido sheep fleece in Biratori",
    construction: "Two reinforced chest map pockets, matte natural corozo nut buttons, raw clean-cut collar stand",
    fitNotes: "Structured box cut. Hangs straight from shoulder with clean vertical line. True to size. Model is 185cm wearing Size M.",
    care: "wool",
    story: "Named for the historic wool mill south of Otaru. We acquire the entire output of a single raw dye lot each season, allowing the subtle natural walnut husk variations to mark each batch.",
    longevityStory: "Boiled wool naturally repels light snow and wind without synthetic chemical membranes. Hand-finished edges.",
    specs: [
      ["Object ID", "ARC-043-BRT"],
      ["Weight", "480 gsm Heavy Boiled Boucle"],
      ["Buttons", "Matte Natural Corozo Nut"],
      ["Chest (M)", "58 cm, laid flat"],
      ["Length (M)", "74 cm"],
      ["Sleeve (M)", "63 cm"]
    ],
    sizes: [["XS", 1], ["S", 3], ["M", 3], ["L", 0], ["XL", 2]]
  },
  "044": {
    name: "Ōmi Hemp Tote",
    category: "Accessories",
    price: 165,
    objectNumber: "OBJECT 044",
    firstRelease: "MMXXVI · CHAPTER I",
    runQuantity: "26 PIECES (LIMITED OFFCUTS)",
    origin: "ŌMI · OTARU WAREHOUSE",
    material: "Unbleached raw Ōmi hemp canvas, hand-waxed vegetable-tanned bridle leather handles",
    construction: "Folded double-ply base gusset, solid copper saddle rivets peened by hand",
    fitNotes: "Substantial daily carry volume. Structured base stands upright unassisted.",
    care: "hemp",
    story: "Assembled strictly from offcuts of our Chapter I outerwear runs. When the bolt canvas is exhausted, the tote run closes permanently.",
    longevityStory: "Heavyweight bast hemp fibers gain supple patina and golden grain over decades of carry.",
    specs: [
      ["Object ID", "ARC-044-OMI"],
      ["Width", "38 cm"],
      ["Height", "34 cm"],
      ["Depth", "12 cm"],
      ["Handle Drop", "22 cm"]
    ],
    sizes: [["One Size", 8]]
  },
  "038": {
    name: "Otaru Deck Coat",
    category: "Outerwear",
    price: 540,
    objectNumber: "OBJECT 038",
    firstRelease: "MMXXVI · CHAPTER II",
    runQuantity: "28 PIECES WORLDWIDE",
    origin: "OTARU HARBOR CANAL STUDIO",
    material: "12oz high-density cotton canvas, hand-waxed with our cold-cured studio paraffin formula",
    construction: "Full storm placket, hidden corozo fly, fleece-lined dual-entry hand pockets, throat latch",
    fitNotes: "Generous overcoat silhouette designed to layer over heavy overshirts and suit jackets. Model wears Size M.",
    care: "waxed",
    story: "Hand-waxed on our harbor warehouse tables in four-piece micro batches. Scented with natural cedar and paraffin.",
    longevityStory: "Re-waxable year after year. Designed to acquire deep marbling and weather creases with every coastal storm.",
    specs: [
      ["Object ID", "ARC-038-DCK"],
      ["Weight", "12oz Custom Waxed Cotton"],
      ["Lining", "Brushed Undyed Cotton Flannel"],
      ["Chest (M)", "60 cm, laid flat"],
      ["Length (M)", "78 cm"],
      ["Sleeve (M)", "65 cm"]
    ],
    sizes: [["XS", 1], ["S", 2], ["M", 2], ["L", 1], ["XL", 0]]
  },
  "037": {
    name: "Tsukiji Apron Shirt",
    category: "Tops",
    price: 260,
    objectNumber: "OBJECT 037",
    firstRelease: "MMXXVI · CHAPTER II",
    runQuantity: "40 PIECES WORLDWIDE",
    origin: "ŌMI · OTARU WAREHOUSE",
    material: "Undyed pure linen woven in Ōmi on low-tension looms",
    construction: "Single-piece apron bib front, adjustable side herringbone ties, dropped shoulders",
    fitNotes: "Boxy, relaxed torso. Breathable and fluid.",
    care: "linen",
    story: "Referenced from original archival linen tunics worn by dock workers in coastal trade ports.",
    longevityStory: "Linen fibers increase in tensile strength when wet and soften into a buttery drape over years.",
    specs: [
      ["Object ID", "ARC-037-TSK"],
      ["Weight", "240 gsm Pure Ōmi Linen"],
      ["Chest (M)", "59 cm, laid flat"],
      ["Length (M)", "73 cm"],
      ["Sleeve (M)", "61 cm"]
    ],
    sizes: [["XS", 4], ["S", 4], ["M", 1], ["L", 3], ["XL", 1]]
  },
  "036": {
    name: "Hakodate Watch Cap",
    category: "Accessories",
    price: 95,
    objectNumber: "OBJECT 036",
    firstRelease: "MMXXVI · CHAPTER II",
    runQuantity: "50 PIECES WORLDWIDE",
    origin: "BIRATORI · HOKKAIDO",
    material: "100% boiled wool yarn, 4-ply tight rib knit",
    construction: "Seamless circular knit with 4-dart shaped crown",
    fitNotes: "Snug, structured fit that adapts to head contour after 2-3 wears without stretching loose.",
    care: "wool",
    story: "Knitted on vintage flat-bed circular machines in southern Hokkaido. Double-cuff for wind protection.",
    longevityStory: "Natural wool lanolin provides natural moisture resistance.",
    specs: [
      ["Object ID", "ARC-036-HKD"],
      ["Circumference", "56 cm, unstretched"],
      ["Height", "24 cm"]
    ],
    sizes: [["One Size", 12]]
  },
  "035": {
    name: "Nemuro Wide Trouser",
    category: "Trousers",
    price: 300,
    objectNumber: "OBJECT 035",
    firstRelease: "MMXXVI · CHAPTER II",
    runQuantity: "35 PIECES WORLDWIDE",
    origin: "ŌMI · OTARU WAREHOUSE",
    material: "10oz heavy raw hemp canvas, garment-washed in canal mineral water",
    construction: "Deep forward pleats, on-seam side pockets, welt rear pockets with horn button closures",
    fitNotes: "High-rise, ultra-wide leg silhouette with clean architectural break.",
    care: "hemp",
    story: "Structured to give dramatic volume while retaining complete freedom of movement in harsh weather.",
    longevityStory: "Hemp canvas resists fraying and abrasion, outlasting conventional denim.",
    specs: [
      ["Object ID", "ARC-035-NMR"],
      ["Waist (M)", "78 cm, laid flat"],
      ["Inseam (M)", "74 cm"],
      ["Rise (M)", "34 cm"]
    ],
    sizes: [["XS", 0], ["S", 2], ["M", 3], ["L", 3], ["XL", 1]]
  },
  "034": {
    name: "Rishiri Rain Shell",
    category: "Outerwear",
    price: 420,
    objectNumber: "OBJECT 034",
    firstRelease: "MMXXVI · CHAPTER III",
    runQuantity: "30 PIECES WORLDWIDE",
    origin: "OTARU WAREHOUSE",
    material: "9oz dry-touch paraffin waxed cotton, storm-proofed without synthetic membranes",
    construction: "Taped shoulder yoke seams, two-way brass zipper beneath protective storm baffle",
    fitNotes: "Regular fit with articulation at elbows for outdoor layering.",
    care: "waxed",
    story: "Tested through northern maritime squalls off Rishiri island.",
    longevityStory: "Zero delamination risk unlike 3-layer petroleum membranes.",
    specs: [
      ["Object ID", "ARC-034-RSH"],
      ["Chest (M)", "57 cm, laid flat"],
      ["Length (M)", "70 cm"],
      ["Sleeve (M)", "64 cm"]
    ],
    sizes: [["XS", 2], ["S", 1], ["M", 0], ["L", 2], ["XL", 1]]
  },
  "033": {
    name: "Wakkanai Muffler",
    category: "Accessories",
    price: 85,
    objectNumber: "OBJECT 033",
    firstRelease: "MMXXVI · CHAPTER III",
    runQuantity: "40 PIECES WORLDWIDE",
    origin: "WAKKANAI · HOKKAIDO",
    material: "Hand-spun raw wool, single-width shuttle loom woven",
    construction: "Hand-twisted fringe ends, natural undyed melange fleece",
    fitNotes: "190cm length allows double-loop wrap with generous shoulder drape.",
    care: "rawwool",
    story: "Woven on a narrow wooden loom operated by a master weaver in northern Hokkaido.",
    longevityStory: "Raw wool with natural unstripped lanolin for lifetime warmth.",
    specs: [
      ["Object ID", "ARC-033-WKN"],
      ["Length", "190 cm"],
      ["Width", "28 cm"]
    ],
    sizes: [["One Size", 15]]
  }
};

export const SIZE_CHARTS = {
  top: {
    headers: ['Size', 'Chest', 'Length', 'Sleeve'],
    rows: [
      ['XS', '52 cm (20.5")', '68 cm (26.8")', '61 cm (24")'],
      ['S', '54 cm (21.3")', '69.5 cm (27.4")', '62.5 cm (24.6")'],
      ['M', '56 cm (22")', '71 cm (28")', '64 cm (25.2")'],
      ['L', '59 cm (23.2")', '72.5 cm (28.5")', '65.5 cm (25.8")'],
      ['XL', '62 cm (24.4")', '74 cm (29.1")', '67 cm (26.4")']
    ]
  },
  bottom: {
    headers: ['Size', 'Waist', 'Inseam', 'Rise'],
    rows: [
      ['XS', '70 cm (27.6")', '70 cm (27.6")', '30 cm (11.8")'],
      ['S', '74 cm (29.1")', '71 cm (28")', '31 cm (12.2")'],
      ['M', '78 cm (30.7")', '72 cm (28.3")', '32 cm (12.6")'],
      ['L', '82 cm (32.3")', '73 cm (28.7")', '33 cm (13")'],
      ['XL', '86 cm (33.9")', '74 cm (29.1")', '34 cm (13.4")']
    ]
  }
};

export const MILESTONES = [
  {
    year: '2023',
    badge: 'First Experimental Weave',
    name: 'The First Loom Piece',
    story: 'Started developing experimental outerwear and natural indigo dyeing techniques on raw textiles in Hokkaido. We keep No. 001 in the studio.'
  },
  {
    year: '2024',
    badge: 'Canal Dyehouse',
    name: 'The Harbor Warehouse Prototype',
    story: 'Set up our workspace on the Otaru canal, prototyping the signature wrap trousers and deck coats through freezing Hokkaido winters.'
  },
  {
    year: '2025',
    badge: 'Permanent Core Weaves',
    name: 'The Four Materials',
    story: 'Perfected our four core textile weaves and lifetime visible repair philosophy before public release.'
  },
  {
    year: '2026',
    badge: 'Established MMXXVI',
    name: 'Living Image Archive Launch',
    story: 'Otaru Design House formally establishes the Living Image Archive with permanent numbered artifacts.'
  }
];

export const JOURNAL_POSTS = [
  {
    id: 'archive-of-a-life',
    cat: 'Philosophy',
    date: '24 Aug MMXXVI',
    title: 'The archive of a life',
    excerpt: 'Imagine opening a wardrobe ten years from now — not a collection of things purchased and forgotten, but a collection of evidence.'
  },
  {
    id: 'on-repair',
    cat: 'Philosophy',
    date: '12 Aug MMXXVI',
    title: 'On repair, and where the next chapter begins',
    excerpt: 'We don’t believe a garment’s story ends when something breaks. A repaired piece carries two histories — the making, and being worth saving.'
  },
  {
    id: 'what-remains',
    cat: 'Philosophy',
    date: '03 Aug MMXXVI',
    title: 'What remains, not what’s next',
    excerpt: 'Most fashion asks what’s next. We’ve always found the better question is what remains after the season forgets it asked.'
  },
  {
    id: 'on-imperfection',
    cat: 'Philosophy',
    date: '22 Jul MMXXVI',
    title: 'The first crease is not damage',
    excerpt: 'A garment that’s never worn remains untouched — and untouched things, we’d argue, are incomplete.'
  },
  {
    id: 'boro-loom',
    cat: 'Process',
    date: '22 Aug MMXXVI',
    title: 'The loom that’s older than the company',
    excerpt: 'We acquired our wooden shuttle loom during our 2023 founding research. It still runs every piece in Chapter II.'
  },
  {
    id: 'on-boro',
    cat: 'Process',
    date: '12 Aug MMXXVI',
    title: 'On boro, and the ethics of repair',
    excerpt: 'Why we mend visible seams instead of hiding them.'
  },
  {
    id: 'a-week-in-omi',
    cat: 'Process',
    date: '30 Jul MMXXVI',
    title: 'A week in Ōmi, where the hemp is cut',
    excerpt: 'Notes from the farm that supplies Chapter III.'
  },
  {
    id: 'no-sample-sales',
    cat: 'Process',
    date: '14 Jul MMXXVI',
    title: 'Why we don’t do sample sales',
    excerpt: 'The math behind keeping a small run small.'
  },
  {
    id: 'dyeing-in-winter',
    cat: 'Process',
    date: '02 Jul MMXXVI',
    title: 'Dyeing in winter, when the canal freezes',
    excerpt: 'The chemistry of cold-water indigo vat fermentation.'
  },
  {
    id: 'verify-explainer',
    cat: 'Process',
    date: '05 Jun MMXXVI',
    title: 'How the Verify tool actually works',
    excerpt: 'What’s on the tag, and what it checks against.'
  }
];

export const STUDIO_TIMELINE = [
  {
    year: '1907',
    text: 'The historic Otaru canal warehouse is constructed to shelter timber, coal, and cloth bound for Honshu.'
  },
  {
    year: '2023',
    text: 'Working on clothing begins: the founders begin development of experimental indigo dyeing and raw textile weaving in Hokkaido.'
  },
  {
    year: '2024',
    text: 'Canal Dyehouse: moved botanical dyeing in-house, drawing water directly from the historic harbor canal.'
  },
  {
    year: '2025',
    text: 'The Four Weaves: finalized our four signature textiles: Tokushima indigo cotton, Ōmi raw hemp, Biratori boiled wool, and Kiryū silk.'
  },
  {
    year: '2026',
    text: 'Established MMXXVI: Otaru Design House formally opens the Living Image Archive.'
  }
];

export const STUDIO_VALUES = [
  {
    title: 'Repair over replace',
    text: 'A repaired Otaru garment carries two histories: the making, and being worth saving. Free repairs for as long as we’re open — mended visibly, not hidden.'
  },
  {
    title: 'Material with a future',
    text: 'We choose materials not only for how they look new, but for how they soften, crease, fade, and respond to weather. The material is not decoration; it’s part of the story.'
  },
  {
    title: 'What remains, not what’s next',
    text: 'Most fashion asks what’s next. We ask what remains — a silhouette that still feels right in ten years, not one that needs explaining every morning.'
  },
  {
    title: 'Restraint as concentration',
    text: 'We make fewer things with greater intention. Restraint is not emptiness. It is concentration — and sometimes the most luxurious thing we can give an object is enough time to become itself.'
  }
];

export const STUDIO_TEAM = [
  { name: 'Aiko Nakamura', role: 'Dye master — 11 years' },
  { name: 'Ren Takahashi', role: 'Pattern cutting — 9 years' },
  { name: 'Sana Miyazaki', role: 'Finishing & repair — 11 years' },
  { name: 'Jun Watanabe', role: 'Studio lead — 14 years' }
];

export const CHAPTERS_DATA = [
  {
    numeral: 'Chapter III',
    title: 'Quiet Interior',
    season: 'SS26',
    pieces: 6,
    status: 'current',
    blurb: 'Undyed linen and washed silk, made for the rooms we don’t photograph.'
  },
  {
    numeral: 'Chapter II',
    title: 'Otaru Harbor',
    season: 'AW26',
    pieces: 8,
    status: 'current',
    blurb: 'Oiled canvas and raw wool, built for salt air and the walk from the ferry.'
  },
  {
    numeral: 'Chapter I',
    title: 'Kyoto Nights',
    season: 'AW26',
    pieces: 11,
    status: 'current',
    blurb: 'Indigo-dyed cotton, cut for the hours between dusk and the last train.'
  },
  {
    numeral: 'Chapter 0',
    title: 'First Run',
    season: 'AW25',
    pieces: 11,
    status: 'archived',
    blurb: 'The eleven jackets that started the archive. One never left the warehouse.'
  }
];
