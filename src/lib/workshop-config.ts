/**
 * Workshop configuration — edit these values in one place.
 * Dates, price, seats, UPI details are all here.
 */

export const WORKSHOP_CONFIG = {
  // ── Session Dates ──────────────────────────────────────────────────
  saturday: {
    label: 'Saturday',
    date: 'Saturday, 29 November 2025',
    time: '4:00 PM – 7:00 PM',
    key: 'saturday',
  },
  sunday: {
    label: 'Sunday',
    date: 'Sunday, 30 November 2025',
    time: '10:00 AM – 1:00 PM',
    key: 'sunday',
  },

  // ── Pricing ───────────────────────────────────────────────────────
  fee: 1299,
  feeDisplay: '₹1,299',

  // ── Capacity ──────────────────────────────────────────────────────
  maxSeatsPerSession: 20,

  // ── Venue ─────────────────────────────────────────────────────────
  venue: {
    name: 'Vaibhav\'s Tullia',
    address: 'E1/F3, Vaibhav\'s Tullia, Ottiyambakkam Main Road,\nNear VRG Mahal, Sithalapakkam, Chennai.',
    mapUrl: 'https://maps.google.com/?q=Sithalapakkam,+Chennai',
  },

  // ── UPI Payment ───────────────────────────────────────────────────
  upi: {
    id: 'aswinivrsbio@okaxis',
    name: 'Aswini T L',
    qrImage: '/images/upi-qr.jpg',
    // Deep-link UPI intent (opens GPay / PhonePe / BHIM)
    intentUrl: (amount: number, refId: string) =>
      `upi://pay?pa=aswinivrsbio@okaxis&pn=Aswini+T+L&am=${amount}&cu=INR&tn=Workshop+Reg+${refId}`,
  },

  // ── Craft Activities ──────────────────────────────────────────────
  activities: [
    { id: 'silk-jewellery', label: 'Silk Jewellery Making', emoji: '💎', desc: 'Create elegant handmade jewellery with silk thread, beads and beautiful details.' },
    { id: 'crochet', label: 'Crochet', emoji: '🧶', desc: 'Learn basic crochet techniques and turn colourful yarn into adorable handmade creations.' },
    { id: 'hair-bow', label: 'Hair Bow Making', emoji: '🎀', desc: 'Design pretty handmade bows using beautiful fabrics, ribbons and colours.' },
    { id: 'scrunchie', label: 'Scrunchie Making', emoji: '✨', desc: 'Make stylish fabric scrunchies that are perfect for everyday wear or gifting.' },
  ],

  // ── Age Groups ────────────────────────────────────────────────────
  ageGroups: ['Under 15', '15–20', '21–30', '31–40', '41+'],

  // ── Contact ───────────────────────────────────────────────────────
  contact: {
    whatsapp: '+91 7708905419', // Update with real number
    email: 'loopandloom@gmail.com',   // Update with real email
  },
};

export type SessionKey = 'saturday' | 'sunday';
export type WorkshopSession = typeof WORKSHOP_CONFIG.saturday;

