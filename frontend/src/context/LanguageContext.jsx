import { createContext, useContext, useEffect, useState } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    brandName: 'Shebora', tagline: 'Trusted Home Services in Dhaka', home: 'Home', services: 'Services',
    map: 'Dhaka map', bookService: 'Book a service', dashboard: 'Dashboard', login: 'Sign in',
    register: 'Create account', logout: 'Sign out', searchPlaceholder: 'Search AC repair, plumbing, cleaning…',
    findNearMe: 'Find services near me', popularCategories: 'Popular home services', whyChooseUs: 'Why Shebora',
    verifiedPros: 'Local service professionals', guaranteedWork: 'Service support', fixedPricing: 'Clear BDT pricing',
    emergencyDispatch: 'Flexible scheduling', bookNow: 'Book now', viewDetails: 'View details',
    pricingStartingAt: 'Starting from', currency: '\u09F3', area: 'Area', reviews: 'Reviews', rating: 'Rating',
    completedJobs: 'Completed jobs', approved: 'Approved', pending: 'Pending review', suspended: 'Suspended',
    customerRole: 'Customer', providerRole: 'Service provider', adminRole: 'Administrator', myBookings: 'My bookings',
    serviceAddress: 'Service address', selectOnMap: 'Select on map', switchRole: 'Switch account', invoice: 'Invoice',
    statusRequested: 'Requested', statusAccepted: 'Accepted', statusOnTheWay: 'On the way', statusArrived: 'Arrived',
    statusInProgress: 'In progress', statusCompleted: 'Completed', statusCancelled: 'Cancelled', statusRejected: 'Rejected',
    cashOnDelivery: 'Pay after service', onlinePayment: 'Digital payment'
  },
  bn: {
    brandName: '\u09B6\u09C7\u09AC\u09CB\u09B0\u09BE', tagline: '\u09A2\u09BE\u0995\u09BE\u09AF\u09BC \u09A8\u09BF\u09B0\u09CD\u09AD\u09B0\u09AF\u09CB\u0997\u09CD\u09AF \u09B9\u09CB\u09AE \u09B8\u09C7\u09AC\u09BE',
    home: '\u09B9\u09CB\u09AE', services: '\u09B8\u09C7\u09AC\u09BE\u09B8\u09AE\u09C2\u09B9', map: '\u09A2\u09BE\u0995\u09BE \u09AE\u09CD\u09AF\u09BE\u09AA',
    bookService: '\u09B8\u09C7\u09AC\u09BE \u09AC\u09C1\u0995 \u0995\u09B0\u09C1\u09A8', dashboard: '\u09A1\u09CD\u09AF\u09BE\u09B6\u09AC\u09CB\u09B0\u09CD\u09A1',
    login: '\u09B2\u0997\u0987\u09A8', register: '\u0985\u09CD\u09AF\u09BE\u0995\u09BE\u0989\u09A8\u09CD\u099F \u0996\u09C1\u09B2\u09C1\u09A8', logout: '\u09B2\u0997\u0986\u0989\u099F',
    searchPlaceholder: '\u098F\u09B8\u09BF, \u09AA\u09BE\u0987\u09AA, \u09AA\u09B0\u09BF\u09B7\u09CD\u0995\u09BE\u09B0 \u09B8\u09C7\u09AC\u09BE \u0996\u09C1\u0981\u099C\u09C1\u09A8…',
    findNearMe: '\u0995\u09BE\u099B\u09BE\u0995\u09BE\u099B\u09BF\u09B0 \u09B8\u09C7\u09AC\u09BE \u0996\u09C1\u0981\u099C\u09C1\u09A8',
    popularCategories: '\u099C\u09A8\u09AA\u09CD\u09B0\u09BF\u09AF\u09BC \u09B9\u09CB\u09AE \u09B8\u09C7\u09AC\u09BE',
    whyChooseUs: '\u0995\u09C7\u09A8 \u09B6\u09C7\u09AC\u09CB\u09B0\u09BE',
    verifiedPros: '\u09B8\u09CD\u09A5\u09BE\u09A8\u09C0\u09AF\u09BC \u09B8\u09C7\u09AC\u09BE\u09A6\u09BE\u09A4\u09BE',
    guaranteedWork: '\u09B8\u09C7\u09AC\u09BE \u09B8\u09B9\u09BE\u09AF\u09BC\u09A4\u09BE', fixedPricing: '\u09B8\u09CD\u09AA\u09B7\u09CD\u099F \u09AC\u09BF\u09A1\u09BF\u099F\u09BF \u09AE\u09C2\u09B2\u09CD\u09AF',
    emergencyDispatch: '\u09B8\u09C1\u09AC\u09BF\u09A7\u09BE\u099C\u09A8\u0995 \u09B8\u09AE\u09AF\u09BC \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8',
    bookNow: '\u098F\u0996\u09A8\u0987 \u09AC\u09C1\u0995 \u0995\u09B0\u09C1\u09A8', viewDetails: '\u09AC\u09BF\u09B8\u09CD\u09A4\u09BE\u09B0\u09BF\u09A4 \u09A6\u09C7\u0996\u09C1\u09A8',
    pricingStartingAt: '\u09B6\u09C1\u09B0\u09C1', currency: '\u09F3', area: '\u098F\u09B2\u09BE\u0995\u09BE', reviews: '\u09AE\u09A4\u09BE\u09AE\u09A4', rating: '\u09B0\u09C7\u099F\u09BF\u0982',
    completedJobs: '\u09B8\u09AE\u09CD\u09AA\u09A8\u09CD\u09A8 \u0995\u09BE\u099C', approved: '\u0985\u09A8\u09C1\u09AE\u09CB\u09A6\u09BF\u09A4', pending: '\u09AA\u09B0\u09CD\u09AF\u09BE\u09B2\u09CB\u099A\u09A8\u09BE\u09A7\u09C0\u09A8',
    suspended: '\u09B8\u09CD\u09A5\u0997\u09BF\u09A4', customerRole: '\u0997\u09CD\u09B0\u09BE\u09B9\u0995', providerRole: '\u09B8\u09C7\u09AC\u09BE\u09A6\u09BE\u09A4\u09BE',
    adminRole: '\u0985\u09CD\u09AF\u09BE\u09A1\u09AE\u09BF\u09A8', myBookings: '\u0986\u09AE\u09BE\u09B0 \u09AC\u09C1\u0995\u09BF\u0982',
    serviceAddress: '\u09B8\u09C7\u09AC\u09BE\u09B0 \u09A0\u09BF\u0995\u09BE\u09A8\u09BE', selectOnMap: '\u09AE\u09CD\u09AF\u09BE\u09AA\u09C7 \u0985\u09AC\u09B8\u09CD\u09A5\u09BE\u09A8 \u09AC\u09C7\u099B\u09C7 \u09A8\u09BF\u09A8',
    switchRole: '\u0985\u09CD\u09AF\u09BE\u0995\u09BE\u0989\u09A8\u09CD\u099F \u09AC\u09A6\u09B2\u09BE\u09A8', invoice: '\u09B0\u09B8\u09BF\u09A6',
    statusRequested: '\u0985\u09A8\u09C1\u09B0\u09CB\u09A7 \u09AA\u09BE\u09A0\u09BE\u09A8\u09CB \u09B9\u09AF\u09BC\u09C7\u099B\u09C7', statusAccepted: '\u0997\u09C3\u09B9\u09C0\u09A4',
    statusOnTheWay: '\u09AA\u09A5\u09C7 \u0986\u099B\u09C7', statusArrived: '\u09AA\u09CC\u0981\u099B\u09C7\u099B\u09C7', statusInProgress: '\u0995\u09BE\u099C \u099A\u09B2\u099B\u09C7',
    statusCompleted: '\u0995\u09BE\u099C \u09B8\u09AE\u09CD\u09AA\u09A8\u09CD\u09A8', statusCancelled: '\u09AC\u09BE\u09A4\u09BF\u09B2',
    statusRejected: '\u09AC\u09BE\u09A4\u09BF\u09B2 \u0995\u09B0\u09BE \u09B9\u09AF\u09BC\u09C7\u099B\u09C7',
    cashOnDelivery: '\u09B8\u09C7\u09AC\u09BE \u09B6\u09C7\u09B7\u09C7 \u09AA\u09B0\u09BF\u09B6\u09CB\u09A7', onlinePayment: '\u09A1\u09BF\u099C\u09BF\u099F\u09BE\u09B2 \u09AA\u09C7\u09AE\u09C7\u09A8\u09CD\u099F'
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('shebora_lang') === 'bn' ? 'bn' : 'en');

  useEffect(() => { localStorage.setItem('shebora_lang', lang); }, [lang]);
  const toggleLanguage = () => setLang(current => current === 'en' ? 'bn' : 'en');
  const t = (key) => translations[lang]?.[key] || translations.en[key] || key;

  return <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);
