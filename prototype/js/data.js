// Prototype fixture data. Hand-written stand-ins for what the ingestion pipeline
// will eventually produce. Coverage figures are illustrative, not measured.
//
// `cov` = share of that perspective's tracked outlets carrying the event in the
// last 7 days, 0–1. `frame` = how that perspective characterises it.

window.PX_PERSPECTIVES = [
  { id: 'west', name: 'Western',  outlets: 'Reuters, AP, BBC, Guardian, NYT' },
  { id: 'ru',   name: 'Russian',  outlets: 'RT, TASS, Sputnik' },
  { id: 'cn',   name: 'Chinese',  outlets: 'CGTN, Xinhua, Global Times' },
  { id: 'in',   name: 'Indian',   outlets: 'NDTV, The Hindu, Indian Express' },
  { id: 'ar',   name: 'Arabic',   outlets: 'Al Jazeera, Arab News, Asharq Al-Awsat' }
];

window.PX_EVENTS = [
  {
    id: 'sahel',
    name: 'Sahel security corridor',
    where: 'Mali · Burkina Faso · Niger',
    iso: ['ML', 'BF', 'NE'],
    x: 506, y: 175, sev: 4,
    coords: '15.0°N 2.0°E',
    summary: 'Coordinated insurgent activity across the tri-border area, alongside the withdrawal of Western security missions and the arrival of replacement partners.',
    cov: { west: 0.22, ru: 0.81, cn: 0.44, in: 0.18, ar: 0.35 },
    frame: {
      west: 'A deteriorating counter-insurgency picture following junta takeovers; emphasis on jihadist expansion and lost Western influence.',
      ru:   'A sovereignty story — states expelling former colonial powers and choosing new security partners on their own terms.',
      cn:   'A development-and-stability framing: infrastructure and investment as the durable answer to insecurity.',
      in:   'Minimal standalone coverage; appears mainly inside broader African-security roundups.',
      ar:   'Regional spillover risk, with attention to displacement into North Africa and Gulf humanitarian response.'
    },
    articles: [
      { h: 'Militant attacks intensify in tri-border region as security vacuum widens', o: 'Reuters', p: 'west', d: '2026-08-19' },
      { h: 'Sahel states deepen defence cooperation after ending French deployments', o: 'TASS', p: 'ru', d: '2026-08-20' },
      { h: 'Infrastructure investment seen as key to Sahel stability, analysts say', o: 'Xinhua', p: 'cn', d: '2026-08-18' },
      { h: 'Displacement from Sahel conflict reaches record levels, agencies warn', o: 'Al Jazeera', p: 'ar', d: '2026-08-21' }
    ]
  },
  {
    id: 'sudan',
    name: 'Sudan civil war',
    where: 'Sudan',
    iso: ['SD'],
    x: 583, y: 176, sev: 5,
    coords: '15.5°N 32.5°E',
    summary: 'Continued fighting between rival military factions, with famine conditions confirmed in multiple states and the largest displacement crisis currently recorded.',
    cov: { west: 0.24, ru: 0.19, cn: 0.14, in: 0.11, ar: 0.58 },
    frame: {
      west: 'Intermittent coverage pegged to famine declarations and aid access; little sustained political reporting.',
      ru:   'Framed through external interference and the failure of Western mediation.',
      cn:   'Brief, largely procedural coverage centred on evacuation and diplomatic statements.',
      in:   'Sparse; surfaces mainly around evacuation of nationals.',
      ar:   'Sustained frontline and humanitarian reporting, with detailed attention to regional mediation efforts.'
    },
    articles: [
      { h: 'Famine confirmed in further states as aid convoys remain blocked', o: 'Al Jazeera', p: 'ar', d: '2026-08-21' },
      { h: 'Displacement from Sudan passes twelve million, UN says', o: 'Reuters', p: 'west', d: '2026-08-17' },
      { h: 'Mediation efforts stall amid competing external backing', o: 'Asharq Al-Awsat', p: 'ar', d: '2026-08-20' }
    ]
  },
  {
    id: 'donbas',
    name: 'Eastern Ukraine front',
    where: 'Ukraine',
    iso: ['UA'],
    x: 606, y: 82, sev: 5,
    coords: '48.5°N 38.0°E',
    summary: 'Sustained fighting along the eastern front with associated strikes on energy infrastructure.',
    cov: { west: 0.96, ru: 0.93, cn: 0.51, in: 0.44, ar: 0.38 },
    frame: {
      west: 'Defence against invasion; emphasis on territorial integrity and materiel supply.',
      ru:   'A security operation framed around protection of Russian-speaking populations and NATO expansion.',
      cn:   'A crisis to be resolved through negotiation, with criticism of sanctions as escalatory.',
      in:   'Neutral-toned reporting focused on energy prices, grain supply and diplomatic balance.',
      ar:   'Coverage weighted toward economic consequences and grain supply to the region.'
    },
    articles: [
      { h: 'Strikes on power grid leave regions without electricity ahead of winter', o: 'BBC', p: 'west', d: '2026-08-21' },
      { h: 'Defence ministry reports advances along eastern line', o: 'RT', p: 'ru', d: '2026-08-21' },
      { h: 'Call for renewed negotiations as conflict enters new phase', o: 'Global Times', p: 'cn', d: '2026-08-19' },
      { h: 'Grain corridor disruption pushes regional prices higher', o: 'The Hindu', p: 'in', d: '2026-08-18' }
    ]
  },
  {
    id: 'redsea',
    name: 'Red Sea shipping corridor',
    where: 'Yemen · Bab-el-Mandeb',
    iso: ['YE'],
    x: 622, y: 182, sev: 4,
    coords: '12.6°N 43.3°E',
    summary: 'Attacks on commercial shipping through the strait, with associated naval deployments and rerouting around the Cape.',
    cov: { west: 0.79, ru: 0.55, cn: 0.72, in: 0.68, ar: 0.85 },
    frame: {
      west: 'Freedom of navigation and the protection of commercial shipping lanes.',
      ru:   'Consequence of Western regional policy rather than an isolated security problem.',
      cn:   'Trade-route disruption and its cost to global supply chains.',
      in:   'Direct economic exposure — shipping costs, insurance premiums, export delays.',
      ar:   'Embedded in the wider regional conflict, with attention to Yemeni internal politics.'
    },
    articles: [
      { h: 'Shipping insurers raise premiums as attacks continue', o: 'Reuters', p: 'west', d: '2026-08-20' },
      { h: 'Exporters count cost of longer routes around the Cape', o: 'Indian Express', p: 'in', d: '2026-08-19' },
      { h: 'Supply chain disruption weighs on regional trade volumes', o: 'CGTN', p: 'cn', d: '2026-08-18' },
      { h: 'Strait tensions tied to broader regional escalation', o: 'Al Jazeera', p: 'ar', d: '2026-08-21' }
    ]
  },
  {
    id: 'haiti',
    name: 'Haiti armed group control',
    where: 'Haiti',
    iso: ['HT'],
    x: 299, y: 164, sev: 4,
    coords: '18.9°N 72.3°W',
    summary: 'Armed groups controlling large parts of the capital, with collapse of policing capacity and an interrupted multinational support mission.',
    cov: { west: 0.61, ru: 0.06, cn: 0.09, in: 0.05, ar: 0.04 },
    frame: {
      west: 'State collapse and gang control; framed around the international support mission and migration pressure.',
      ru:   'Occasional mention as evidence of failed Western intervention.',
      cn:   'Minimal coverage; appears in UN procedural reporting only.',
      in:   'Effectively absent.',
      ar:   'Effectively absent.'
    },
    articles: [
      { h: 'Armed groups extend control over capital districts', o: 'AP', p: 'west', d: '2026-08-20' },
      { h: 'Support mission deployment delayed again amid funding shortfall', o: 'Guardian', p: 'west', d: '2026-08-16' }
    ]
  },
  {
    id: 'xinjiang',
    name: 'Xinjiang detention system',
    where: 'China',
    iso: ['CN'],
    x: 736, y: 103, sev: 4,
    coords: '41.0°N 85.0°E',
    summary: 'Continued reporting on mass detention, labour transfer programmes and surveillance infrastructure in the region.',
    cov: { west: 0.66, ru: 0.04, cn: 0.01, in: 0.21, ar: 0.07 },
    frame: {
      west: 'Human rights violations and forced labour in supply chains; sanctions and import restrictions.',
      ru:   'Largely absent; occasionally framed as Western information pressure on China.',
      cn:   'Presented as vocational training and counter-extremism policy where mentioned at all.',
      in:   'Intermittent coverage, generally sourced to Western reporting.',
      ar:   'Very limited; occasional coverage in relation to Muslim-world diplomatic positions.'
    },
    articles: [
      { h: 'Import restrictions extended over forced labour concerns', o: 'Reuters', p: 'west', d: '2026-08-15' },
      { h: 'Regional development and employment programmes expanded', o: 'Xinhua', p: 'cn', d: '2026-08-12' }
    ]
  },
  {
    id: 'scs',
    name: 'South China Sea disputes',
    where: 'Philippines · Spratly Islands',
    iso: ['PH'],
    x: 817, y: 183, sev: 3,
    coords: '12.0°N 114.0°E',
    summary: 'Repeated confrontations around contested reefs and resupply missions, including water-cannon and ramming incidents.',
    cov: { west: 0.72, ru: 0.31, cn: 0.88, in: 0.49, ar: 0.12 },
    frame: {
      west: 'Coercion against a treaty ally; framed around international law and the 2016 arbitration ruling.',
      ru:   'Framed as a consequence of external powers introducing rivalry into the region.',
      cn:   'Sovereignty and territorial integrity; framed as provocation by outside interference.',
      in:   'Freedom of navigation and regional balance, tied to its own maritime interests.',
      ar:   'Minimal coverage.'
    },
    articles: [
      { h: 'Resupply mission met with water cannon near contested reef', o: 'Reuters', p: 'west', d: '2026-08-21' },
      { h: 'Coast guard responds to unauthorised entry into territorial waters', o: 'Global Times', p: 'cn', d: '2026-08-21' },
      { h: 'Regional navies increase patrol tempo amid rising incidents', o: 'NDTV', p: 'in', d: '2026-08-19' }
    ]
  },
  {
    id: 'essequibo',
    name: 'Essequibo territorial dispute',
    where: 'Guyana · Venezuela',
    iso: ['GY', 'VE'],
    x: 333, y: 200, sev: 2,
    coords: '5.0°N 60.0°W',
    summary: 'Escalating claims over the Essequibo region following offshore oil discoveries, with troop movements near the border.',
    cov: { west: 0.28, ru: 0.12, cn: 0.15, in: 0.08, ar: 0.06 },
    frame: {
      west: 'Territorial threat against a neighbour, framed around oil interests and regional stability.',
      ru:   'Framed as a sovereignty question with sympathy for the Venezuelan claim.',
      cn:   'Neutral procedural coverage centred on ICJ proceedings.',
      in:   'Effectively absent.',
      ar:   'Effectively absent.'
    },
    articles: [
      { h: 'Troop movements reported near disputed border region', o: 'Reuters', p: 'west', d: '2026-08-14' },
      { h: 'Court proceedings continue over territorial claim', o: 'CGTN', p: 'cn', d: '2026-08-11' }
    ]
  }
];
