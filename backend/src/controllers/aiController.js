import { dbStore } from '../config/db.js';

// These aliases map to the six actual catalogue service IDs. Keep this matcher
// local and conservative: if the top results are weak or ambiguous, abstain.
const serviceKeywords = {
  'srv-ac-repair': [
    'ac repair', 'air conditioner', 'air conditioning', 'aircon', 'split ac', 'window ac',
    'ac not cooling', 'ac is not cooling', 'ac running but not cooling',
    'ac is running but not cooling', 'ac no cooling', 'running but not cooling',
    'ac not getting cold', 'ac is not cold', 'ac servicing', 'ac maintenance', 'ac gas',
    'ac leaking', 'ac water leaking', 'ac leaking water', 'water leaking from ac',
    'water leaking from my ac', 'water dripping from ac', 'water dripping from my ac',
    'ac water dripping', 'ac dripping water', 'ac water leak',
    'ac water lickig', 'ac nosto', 'ac noshto', 'ac kharap', 'ac kaj korche na', 'ac kaj kore na',
    'ac making noise', 'ac smells', 'ac te pani pore', 'ac e pani pore',
    'ac er pani pore', 'ac theke pani pore', 'ac theke pani porche', 'ac pani pore',
    'amar ac te pani pore', 'amar ac e pani pore', 'amr ac te pai pore',
    'amar ac theke pani porche', 'ac thanda korche na', 'ac thanda hocche na', '\u098f\u09b8\u09bf \u09a0\u09be\u09a8\u09cd\u09a1\u09be \u0995\u09b0\u099b\u09c7 \u09a8\u09be', '\u098f\u09b8\u09bf \u09a5\u09c7\u0995\u09c7 \u09aa\u09be\u09a8\u09bf \u09aa\u09dc\u099b\u09c7',
    'এসি', 'এসি নষ্ট', 'এসি ঠান্ডা করছে না', 'এসি থেকে পানি পড়ছে', 'এসি থেকে পানি পড়ছে', 'এসি পানি লিক করছে'
  ],
  'srv-plumbing': [
    'plumbing', 'water leaking', 'water leakage', 'leaking water', 'leaking pipe',
    'pipe burst', 'broken pipe', 'sink leaking', 'kitchen sink', 'water leaking under sink',
    'tap leaking', 'dripping tap', 'faucet', 'faucet leaking', 'faucet dripping',
    'blocked drain', 'drain blockage', 'toilet blockage', 'toilet repair', 'toilet won t flush',
    'bathroom leak', 'water supply', '\u09aa\u09be\u09a8\u09bf \u09b2\u09bf\u0995 \u0995\u09b0\u099b\u09c7', '\u09b0\u09be\u09a8\u09cd\u09a8\u09be\u0998\u09b0\u09c7\u09b0 \u09b8\u09bf\u0999\u09cd\u0995\u09c7 \u09aa\u09be\u09a8\u09bf \u09aa\u09dc\u099b\u09c7', 'পানি লিক', 'পানি পড়ছে', 'পাইপ লিক', 'কল নষ্ট',
    'কল দিয়ে পানি পড়ছে', 'ড্রেন বন্ধ', 'বেসিন লিক', 'টয়লেট ফ্লাশ কাজ করছে না'
  ],
  'srv-electrical': [
    'electrical', 'electric problem', 'electricity problem', 'wiring', 'short circuit',
    'power socket', 'socket stopped working', 'power outlet', 'switch not working',
    'light switch', 'light not working', 'fan not working', 'ceiling fan', 'electric shock',
    'circuit breaker', 'breaker keeps tripping', 'power keeps tripping', 'no electricity',
    'no power', 'burning wire smell', '\u09b8\u09c1\u0987\u099a \u0995\u09be\u099c \u0995\u09b0\u099b\u09c7 \u09a8\u09be', '\u09b2\u09be\u0987\u099f \u0986\u09b0 \u09b8\u09c1\u0987\u099a \u099a\u09b2\u099b\u09c7 \u09a8\u09be', 'ফ্যান নষ্ট', 'লাইট জ্বলছে না', 'বিদ্যুৎ সমস্যা',
    'বিদ্যুৎ নেই', 'সুইচ নষ্ট', 'ওয়্যারিং', 'সার্কিট ব্রেকার'
  ],
  'srv-home-cleaning': [
    'home cleaning', 'house cleaning', 'deep cleaning', 'deep clean', 'apartment cleaning',
    'clean apartment', 'clean my apartment', 'kitchen cleaning', 'dirty kitchen',
    'bathroom cleaning', 'room cleaning', 'clean my house', 'cleaning service',
    'dust cleaning', 'dirty floor', 'deep clean my apartment', 'apartment needs deep cleaning', 'sofa cleaning', 'dirty sofa', 'sofa stains',
    'carpet cleaning', 'move out cleaning', 'বাসা পরিষ্কার', 'ঘর পরিষ্কার',
    'রান্নাঘর পরিষ্কার', 'বাথরুম পরিষ্কার', 'সোফা পরিষ্কার'
  ],
  'srv-appliance': [
    'refrigerator', 'fridge', 'freezer', 'fridge not cooling', 'refrigerator not cooling',
    'refrigerator is not getting cold', 'fridge not getting cold', 'fridge not cold',
    'washing machine', 'washing machine not working', 'washing machine repair',
    'washing machine leaking', 'washing machine making noise', 'appliance repair',
    'fridge making noise', 'fridge not working', 'freezer not freezing',
    'refrigerator leaking', 'microwave not heating', 'microwave repair',
    'ফ্রিজ নষ্ট', 'ফ্রিজ ঠান্ডা করছে না', 'ফ্রিজ কাজ করছে না', 'ওয়াশিং মেশিন', 'মাইক্রোওয়েভ'
  ],
  'srv-painting': [
    'painting', 'wall painting', 'bedroom painting', 'paint my room', 'house painting',
    'wall color', 'paint peeling', 'paint is peeling', 'wall paint peeling', 'peeling paint',
    'paint coming off', 'wall paint coming off', 'paint is coming off', 'paint is bubbling',
    'cracked wall paint', 'wall needs repainting', 'interior painting', 'bedroom wall paint peeling', 'paint coming off my bedroom wall',
    'দেয়ালে রং', 'রং করা', 'বাসা রং', 'দেয়ালের রং উঠে যাচ্ছে'
  ]
};

const bengaliKeywords = {
  'srv-ac-repair': ['\u098f\u09b8\u09bf\u09b0 \u09aa\u09be\u09a8\u09bf \u09aa\u09dc\u099b\u09c7', '\u098f\u09b8\u09bf \u09a0\u09be\u09a8\u09cd\u09a1\u09be \u0995\u09b0\u099b\u09c7 \u09a8\u09be', '\u098f\u09b8\u09bf \u099a\u09b2\u099b\u09c7 \u0995\u09bf\u09a8\u09cd\u09a4\u09c1 \u09a0\u09be\u09a8\u09cd\u09a1\u09be \u09b9\u099a\u09cd\u099b\u09c7 \u09a8\u09be'],
  'srv-plumbing': ['\u09b0\u09be\u09a8\u09cd\u09a8\u09be\u0998\u09b0\u09c7\u09b0 \u09b8\u09bf\u0999\u09cd\u0995\u09c7 \u09aa\u09be\u09a8\u09bf \u09aa\u09dc\u099b\u09c7', '\u0995\u09b2 \u09a5\u09c7\u0995\u09c7 \u09aa\u09be\u09a8\u09bf \u09aa\u09dc\u099b\u09c7', '\u09aa\u09be\u0987\u09aa \u09b2\u09bf\u0995', '\u09ac\u09c7\u09b8\u09bf\u09a8\u09c7 \u09aa\u09be\u09a8\u09bf \u099c\u09ae\u09c7'],
  'srv-electrical': ['\u09aa\u09be\u0993\u09df\u09be\u09b0 \u09b8\u0995\u09c7\u099f \u0995\u09be\u099c \u0995\u09b0\u099b\u09c7 \u09a8\u09be', '\u09b2\u09be\u0987\u099f\u09c7\u09b0 \u09b8\u09c1\u0987\u099a \u0995\u09be\u099c \u0995\u09b0\u099b\u09c7 \u09a8\u09be', '\u09ac\u09bf\u09a6\u09cd\u09af\u09c1\u09ce \u09b8\u09ae\u09b8\u09cd\u09af\u09be'],
  'srv-home-cleaning': ['\u09ac\u09be\u09b8\u09be \u09aa\u09b0\u09bf\u09b7\u09cd\u0995\u09be\u09b0', '\u0985\u09cd\u09af\u09be\u09aa\u09be\u09b0\u09cd\u099f\u09ae\u09c7\u09a8\u09cd\u099f \u09aa\u09b0\u09bf\u09b7\u09cd\u0995\u09be\u09b0', '\u0997\u09ad\u09c0\u09b0\u09ad\u09be\u09ac\u09c7 \u09aa\u09b0\u09bf\u09b7\u09cd\u0995\u09be\u09b0', '\u09b0\u09be\u09a8\u09cd\u09a8\u09be\u0998\u09b0 \u09aa\u09b0\u09bf\u09b7\u09cd\u0995\u09be\u09b0'],
  'srv-appliance': ['\u09ab\u09cd\u09b0\u09bf\u099c \u09a0\u09be\u09a8\u09cd\u09a1\u09be \u09b9\u099a\u09cd\u099b\u09c7 \u09a8\u09be', '\u09b0\u09c7\u09ab\u09cd\u09b0\u09bf\u099c\u09be\u09b0\u09c7\u099f\u09b0 \u09a0\u09be\u09a8\u09cd\u09a1\u09be \u09b9\u099a\u09cd\u099b\u09c7 \u09a8\u09be', '\u0993\u09df\u09be\u09b6\u09bf\u0982 \u09ae\u09c7\u09b6\u09bf\u09a8'],
  'srv-painting': ['\u09a6\u09c7\u09df\u09be\u09b2\u09c7\u09b0 \u09b0\u0982 \u0989\u09a0\u09c7 \u09af\u09be\u099a\u09cd\u099b\u09c7', '\u09ac\u09c7\u09a1\u09b0\u09c1\u09ae\u09c7\u09b0 \u09a6\u09c7\u09df\u09be\u09b2\u09c7\u09b0 \u09b0\u0982 \u0989\u09a0\u09c7 \u09af\u09be\u099a\u09cd\u099b\u09c7', '\u09b0\u0982 \u0996\u09b8\u09c7 \u09aa\u09dc\u099b\u09c7']
};

const spellingCorrections = [
  [/\b(?:lickig|leakig|leeking|leacking|leakin)\b/g, 'leaking'],
  [/\blicking\b/g, 'leaking'],
  [/\bappartment\b/g, 'apartment'],
  [/\brefregerator\b/g, 'refrigerator'],
  [/\brefridgerator\b/g, 'refrigerator'],
  [/\beletrical\b/g, 'electrical'],
  [/\bcleanning\b/g, 'cleaning'],
  [/\bpealing\b/g, 'peeling'],
  [/\bamr\b/g, 'amar'],
  [/\bpai\b/g, 'pani'],
  [/\bpaani\b/g, 'pani'],
  [/\bporche\b/g, 'pore'],
  [/\bwater lick(?:ing)?\b/g, 'water leaking'],
  [/\bfrige\b/g, 'fridge'],
  [/\bnoshto\b/g, 'nosto'],
  [/\bnashto\b/g, 'nosto'],
  [/\bbed room\b/g, 'bedroom'],
  [/\bpaaint\b/g, 'paint'],
  [/\bporeche\b/g, 'pore'],
  [/\bki korbo\b/g, ''],
  [/\bki kora jay\b/g, '']
];

function normalizeText(value) {
  let normalized = value.toLowerCase().normalize('NFC');
  for (const [pattern, replacement] of spellingCorrections) {
    normalized = normalized.replace(pattern, replacement);
  }
  const ignoredFillers = new Set(['is', 'my', 'the', 'a', 'an', 'off']);
  return normalized
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(word => word && !ignoredFillers.has(word))
    .join(' ');
}

function findBestMatch(problem, services) {
  const normalizedProblem = ` ${normalizeText(problem)} `;
  const candidates = [];

  for (const service of services) {
    const matches = [...new Set([...(serviceKeywords[service.id] || []), ...(bengaliKeywords[service.id] || [])]
      .map(keyword => normalizeText(keyword))
      .filter(keyword => keyword && normalizedProblem.includes(` ${keyword} `)))];

    if (!matches.length) continue;

    matches.sort((a, b) => b.split(' ').length - a.split(' ').length || b.length - a.length);
    const weights = matches.map(keyword => Math.min(8, 2 + keyword.split(' ').length * 2));
    const score = weights[0] + Math.min(3, weights.slice(1).reduce((sum, weight) => sum + weight * 0.25, 0));
    if (score >= 4) candidates.push({ service, score, matchedPhrase: matches[0] });
  }

  candidates.sort((a, b) => b.score - a.score);
  if (!candidates.length) return null;
  if (candidates[1] && candidates[0].score - candidates[1].score < 0.5) return null;
  return candidates[0];
}

export function findBestService(problem, services) {
  return findBestMatch(problem, services)?.service || null;
}


function detectLanguage(problem) {
  if (/[\u0980-\u09FF]/u.test(problem)) return 'bn';
  return /\b(amar|amr|ac te|pani|kora jay|hocche|naki|korbo|nasto)\b/i.test(problem) ? 'roman' : 'en';
}

function safeAdvice(serviceId, language) {
  const tips = {
    'srv-ac-repair': ['If water is dripping, turn the AC off and keep it away from electrical outlets until checked.', '\u09aa\u09be\u09a8\u09bf \u09aa\u09dc\u09b2\u09c7 AC \u09ac\u09a8\u09cd\u09a7 \u0995\u09b0\u09c1\u09a8 \u098f\u09ac\u0982 \u09aa\u09b0\u09c0\u0995\u09cd\u09b7\u09be\u09b0 \u0986\u0997\u09c7 \u09b8\u0995\u09c7\u099f \u09a5\u09c7\u0995\u09c7 \u09a6\u09c2\u09b0\u09c7 \u09b0\u09be\u0996\u09c1\u09a8\u0964', 'Pani porle AC bondho korun, ar check na kora porjonto electrical socket theke dure rakhun.'],
    'srv-electrical': ['Do not touch exposed wires or the faulty switch. If safe, turn off the affected circuit at the breaker.', '\u0996\u09cb\u09b2\u09be \u09a4\u09be\u09b0 \u09ac\u09be \u09a8\u09b7\u09cd\u099f \u09b8\u09c1\u0987\u099a \u09b8\u09cd\u09aa\u09b0\u09cd\u09b6 \u0995\u09b0\u09ac\u09c7\u09a8 \u09a8\u09be\u0964 \u09a8\u09bf\u09b0\u09be\u09aa\u09a6 \u09b9\u09b2\u09c7 \u09ac\u09cd\u09b0\u09c7\u0995\u09be\u09b0 \u09a5\u09c7\u0995\u09c7 \u09b8\u09be\u09b0\u09cd\u0995\u09bf\u099f \u09ac\u09a8\u09cd\u09a7 \u0995\u09b0\u09c1\u09a8\u0964', 'Khola tar ba faulty switch dhorben na. Nirapod hole breaker theke oi circuit bondho korun.'],
    'srv-plumbing': ['If water is actively leaking, close the nearest shutoff valve if you can reach it safely.', '\u09aa\u09be\u09a8\u09bf \u09aa\u09dc\u09a4\u09c7 \u09a5\u09be\u0995\u09b2\u09c7 \u09a8\u09bf\u09b0\u09be\u09aa\u09a6\u09ad\u09be\u09ac\u09c7 \u09aa\u09be\u09b0\u09b2\u09c7 \u0995\u09be\u099b\u09c7\u09b0 \u09ad\u09be\u09b2\u09ad \u09ac\u09a8\u09cd\u09a7 \u0995\u09b0\u09c1\u09a8\u0964', 'Pani porte thakle nirapode parle kacher water valve bondho korun.'],
    'srv-home-cleaning': ['Keep children and pets away from cleaning products and ventilate the room.', '\u09aa\u09b0\u09bf\u09b7\u09cd\u0995\u09be\u09b0\u0995\u09c7\u09b0 \u09a5\u09c7\u0995\u09c7 \u09b6\u09bf\u09b6\u09c1 \u0993 \u09aa\u09b6\u09c1\u09a6\u09c7\u09b0 \u09a6\u09c2\u09b0\u09c7 \u09b0\u09be\u0996\u09c1\u09a8 \u098f\u09ac\u0982 \u0998\u09b0\u09c7 \u09ac\u09be\u09a4\u09be\u09b8 \u099a\u09b2\u09be\u09a8\u0964', 'Cleaning products shishu o poshu theke dure rakhun, ghore batas cholachol rakhun.'],
    'srv-appliance': ['If there is a burning smell or sparking, unplug it only if safe and stop using it until inspected.', '\u09aa\u09cb\u09dc\u09be \u0997\u09a8\u09cd\u09a7 \u09ac\u09be \u09b8\u09cd\u09aa\u09be\u09b0\u09cd\u0995 \u09b9\u09b2\u09c7 \u09a8\u09bf\u09b0\u09be\u09aa\u09a6 \u09b9\u09b2\u09c7 \u09aa\u09cd\u09b2\u09be\u0997 \u0996\u09c1\u09b2\u09c1\u09a8 \u098f\u09ac\u0982 \u09aa\u09b0\u09c0\u0995\u09cd\u09b7\u09be \u09a8\u09be \u09b9\u0993\u09df\u09be \u09aa\u09b0\u09cd\u09af\u09a8\u09cd\u09a4 \u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0 \u0995\u09b0\u09ac\u09c7\u09a8 \u09a8\u09be\u0964', 'Porar gondho ba spark hole nirapod hole plug khulun, check na kora porjonto use korben na.'],
    'srv-painting': ['Ventilate the room while painting and follow the product label for drying and re-entry.', '\u09b0\u0982 \u0995\u09b0\u09be\u09b0 \u09b8\u09ae\u09df \u0998\u09b0\u09c7 \u09ac\u09be\u09a4\u09be\u09b8 \u099a\u09b2\u09be\u09a8 \u098f\u09ac\u0982 \u09b6\u09c1\u0995\u09be\u09a8\u09cb\u09b0 \u09a8\u09bf\u09b0\u09cd\u09a6\u09c7\u09b6\u09a8\u09be \u09ae\u09c7\u09a8\u09c7 \u099a\u09b2\u09c1\u09a8\u0964', 'Painting er shomoy room e batas cholachol rakhun, drying instruction mene cholun.']
  };
  return tips[serviceId]?.[language === 'bn' ? 1 : language === 'roman' ? 2 : 0] || '';
}

export async function recommendService(req, res) {
  try {
    const problem = typeof req.body?.problem === 'string' ? req.body.problem.trim() : '';
    if (!problem || problem.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Please describe your problem using 1 to 500 characters.'
      });
    }

    const match = findBestMatch(problem, dbStore.getServices());
    const language = detectLanguage(problem);
    if (!match) {
      return res.json({
        success: true,
        recommendation: null,
        language,
        message: language === 'bn' ? '\u09b8\u09ae\u09b8\u09cd\u09af\u09be\u099f\u09bf \u09a8\u09bf\u09b6\u09cd\u099a\u09bf\u09a4\u09ad\u09be\u09ac\u09c7 \u09ae\u09c7\u09b2\u09be\u09a4\u09c7 \u09aa\u09be\u09b0\u09bf\u09a8\u09bf\u0964 \u0986\u09b0\u0993 \u09ac\u09bf\u09ac\u09b0\u09a3 \u09a6\u09bf\u09a8 \u09ac\u09be \u098f\u0995\u099f\u09bf \u0989\u09a6\u09be\u09b9\u09b0\u09a3 \u09ac\u09be\u099b\u09c1\u09a8\u0964' : language === 'roman' ? 'Ei shomosshati nishchitbhabe melate parini. Arektu details din ba example bachun.' : 'I couldn?t confidently match that problem to a Shebora service. Try adding a detail, or choose one of the example prompts.'
      });
    }

    const selectedService = match.service;
    return res.json({
      success: true,
      recommendation: {
        id: selectedService.id,
        name: selectedService.name,
        category: selectedService.category,
        description: selectedService.description,
        basePrice: selectedService.basePrice,
        priceUnit: selectedService.priceUnit,
        image: selectedService.image
      },
      reason: language === 'bn' ? `\u0986\u09aa\u09a8\u09be\u09b0 \u09ac\u09b0\u09cd\u09a3\u09a8\u09be\u09b0 \u09b8\u09ae\u09b8\u09cd\u09af\u09be\u099f\u09bf ${selectedService.name} \u09b8\u09c7\u09ac\u09be\u09b0 \u09b8\u09be\u09a5\u09c7 \u09ae\u09c7\u09b2\u09c7\u0964` : language === 'roman' ? `Apnar barnonar shomosshay ${selectedService.name} shahajjo korte pare.` : `You mentioned ${match.matchedPhrase}, which is commonly handled by ${selectedService.name}.`,
      language,
      advice: safeAdvice(selectedService.id, language)
    });
  } catch (error) {
    console.error('Shebora smart recommendation error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Unable to process your recommendation right now. Please try again.'
    });
  }
}
