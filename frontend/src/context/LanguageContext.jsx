import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    brandName: "Shebora",
    tagline: "Trusted Home Services in Dhaka",
    home: "Home",
    services: "All Services",
    map: "Dhaka Map",
    bookService: "Book Service",
    dashboard: "Dashboard",
    login: "Log In",
    register: "Register",
    logout: "Log Out",
    searchPlaceholder: "Search AC repair, plumbing, electrician, cleaning...",
    findNearMe: "Find Services Near Me",
    popularCategories: "Popular Home Services",
    whyChooseUs: "Why Choose Shebora",
    verifiedPros: "Verified Dhaka Professionals",
    guaranteedWork: "30-Day Work Warranty",
    fixedPricing: "Clear BDT Pricing (No Hidden Fees)",
    emergencyDispatch: "Rapid Emergency Response",
    bookNow: "Book Now",
    viewDetails: "View Details",
    pricingStartingAt: "Starting from",
    currency: "৳",
    area: "Area",
    reviews: "Reviews",
    rating: "Rating",
    completedJobs: "Completed Jobs",
    approved: "Approved",
    pending: "Pending Verification",
    suspended: "Suspended",
    customerRole: "Customer",
    providerRole: "Technician / Provider",
    adminRole: "Administrator",
    myBookings: "My Bookings",
    serviceAddress: "Service Address in Dhaka",
    selectOnMap: "Select Location on Map",
    switchRole: "Quick Switch Role",
    invoice: "Invoice",
    statusRequested: "Requested",
    statusAccepted: "Accepted",
    statusOnTheWay: "On the Way",
    statusArrived: "Arrived",
    statusInProgress: "In Progress",
    statusCompleted: "Completed",
    statusCancelled: "Cancelled",
    statusRejected: "Rejected",
    cashOnDelivery: "Cash on Service (COD)",
    onlinePayment: "Digital Payment (bKash / Card / SSLCommerz)"
  },
  bn: {
    brandName: "শেবোরা",
    tagline: "ঢাকায় বিশ্বস্ত হোম সার্ভিস মার্কেটপ্লেস",
    home: "হোম",
    services: "সকল সেবা",
    map: "ঢাকা ম্যাপ",
    bookService: "সার্ভিস বুক করুন",
    dashboard: "ড্যাশবোর্ড",
    login: "লগইন",
    register: "নিবন্ধন",
    logout: "লগআউট",
    searchPlaceholder: "এসি মেরামত, প্লাম্বিং, ইলেকট্রিশিয়ান, ক্লিনিং খুঁজুন...",
    findNearMe: "আমার নিকটস্থ সেবা খুঁজুন",
    popularCategories: "জনপ্রিয় হোম সার্ভিস সমূহ",
    whyChooseUs: "কেন শেবোরা বেছে নেবেন",
    verifiedPros: "যাচাইকৃত দক্ষ টেকনিশিয়ান",
    guaranteedWork: "৩০ দিনের সার্ভিস ওয়ারেন্টি",
    fixedPricing: "স্বচ্ছ বিডিটি মূল্য (লুকানো চার্জ নেই)",
    emergencyDispatch: "জরুরি সেবা প্রদান",
    bookNow: "এখনই বুক করুন",
    viewDetails: "বিস্তারিত দেখুন",
    pricingStartingAt: "শুরু",
    currency: "৳",
    area: "এলাকা",
    reviews: "মতামত",
    rating: "রেটিং",
    completedJobs: "সম্পন্ন কাজ",
    approved: "অনুমোদিত",
    pending: "যাচাইকরণাধীন",
    suspended: "স্থগিত",
    customerRole: "গ্রাহক",
    providerRole: "সার্ভিস প্রোভাইডার / মিস্ত্রি",
    adminRole: "অ্যাডমিনিস্ট্রেটর",
    myBookings: "আমার বুকিংস",
    serviceAddress: "ঢাকার সার্ভিস ঠিকানা",
    selectOnMap: "ম্যাপে লোকেশন নির্বাচন করুন",
    switchRole: "রোল পরিবর্তন করুন",
    invoice: "রসিদ / চালান",
    statusRequested: "অনুরোধ জমা",
    statusAccepted: "গৃহীত",
    statusOnTheWay: "পথিমধ্যে",
    statusArrived: "পৌঁছেছেন",
    statusInProgress: "কাজ চলমান",
    statusCompleted: "কাজ সম্পন্ন",
    statusCancelled: "বাতিলকৃত",
    statusRejected: "প্রত্যাখ্যাত",
    cashOnDelivery: "ক্যাশ অন সার্ভিস (হাতে হাতে বিল)",
    onlinePayment: "ডিজিটাল পেমেন্ট (বিকাশ / কার্ড / অনলাইন)"
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('shebora_lang') || 'en');

  useEffect(() => {
    localStorage.setItem('shebora_lang', lang);
  }, [lang]);

  const toggleLanguage = () => {
    setLang(prev => (prev === 'en' ? 'bn' : 'en'));
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
