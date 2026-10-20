// Shebora - Database Configuration and In-Memory / MongoDB Adapter
import dotenv from 'dotenv';
dotenv.config();

// Default seed data for Dhaka Home Services
export const initialServices = [
  {
    id: "srv-ac-repair",
    name: "AC Repair & Servicing",
    category: "AC Repair",
    categoryBn: "এসি মেরামত ও সার্ভিসিং",
    description: "Comprehensive AC checkup, gas refill, master cleaning, cooling coil repair, and compressor servicing by certified technicians.",
    basePrice: 1200,
    priceUnit: "unit",
    estimatedDuration: "60-90 mins",
    warrantyDays: 30,
    image: "/src/assets/why_choose_us/service-1.jpg",
    rating: 4.8,
    reviewsCount: 142,
    serviceAreas: ["Gulshan", "Banani", "Dhanmondi", "Uttara", "Mirpur", "Mohammadpur", "Bashundhara", "Badda"],
    features: [
      "Filter and coil deep water-jet cleaning",
      "Gas pressure & electrical amp check",
      "30-day service warranty",
      "Genuine spare parts available"
    ]
  },
  {
    id: "srv-plumbing",
    name: "Plumbing & Sanitary Solutions",
    category: "Plumbing",
    categoryBn: "প্লাম্বিং ও স্যানিটারি সেবা",
    description: "Expert leak repairs, pipe fitting, water pump troubleshooting, toilet flush & commode installation, and blockage clearing.",
    basePrice: 800,
    priceUnit: "visit",
    estimatedDuration: "45-60 mins",
    warrantyDays: 15,
    image: "/src/assets/why_choose_us/service-2.jpg",
    rating: 4.7,
    reviewsCount: 98,
    serviceAreas: ["Dhanmondi", "Mohammadpur", "Lalbagh", "Mirpur", "Gulshan", "Tejgaon", "Motijheel"],
    features: [
      "High-pressure drainage clearing",
      "Concealed pipe leak detection",
      "Sanitary fixture fitting",
      "Emergency night service available"
    ]
  },
  {
    id: "srv-electrical",
    name: "Electrical Repair & Wiring",
    category: "Electrical Repair",
    categoryBn: "ইলেকট্রিক্যাল মেরামত ও ওয়্যারিং",
    description: "Certified electricians for circuit breaker issues, short circuit fixing, ceiling fan repair, switchboard installation, and complete home wiring.",
    basePrice: 650,
    priceUnit: "job",
    estimatedDuration: "30-60 mins",
    warrantyDays: 14,
    image: "/src/assets/why_choose_us/service-3.jpg",
    rating: 4.9,
    reviewsCount: 175,
    serviceAreas: ["Uttara", "Mirpur", "Gulshan", "Banani", "Dhanmondi", "Khilgaon", "Malibagh"],
    features: [
      "Full electrical load assessment",
      "BRB / BBS certified cable installation",
      "Safe multimeter testing",
      "Rapid response within 1 hour"
    ]
  },
  {
    id: "srv-home-cleaning",
    name: "Deep Home & Kitchen Cleaning",
    category: "Home Cleaning",
    categoryBn: "বাড়ি ও কিচেন ডিপ ক্লিনিং",
    description: "Thorough deep cleaning of bathrooms, kitchens, balconies, tile scrubbing, sofa shampooing, and post-renovation cleaning.",
    basePrice: 2500,
    priceUnit: "home",
    estimatedDuration: "3-4 hours",
    warrantyDays: 7,
    image: "/src/assets/why_choose_us/service-4.jpg",
    rating: 4.85,
    reviewsCount: 210,
    serviceAreas: ["Gulshan", "Banani", "Baridhara", "Bashundhara", "Uttara", "Dhanmondi", "Mohammadpur"],
    features: [
      "Industrial grade eco-friendly disinfectant",
      "Deep grout & grease extraction",
      "Trained 2-3 person cleaning crew",
      "Spotless inspection guarantee"
    ]
  },
  {
    id: "srv-appliance",
    name: "Refrigerator & Washing Machine Repair",
    category: "Appliance Repair",
    categoryBn: "ফ্রিজ ও ওয়াশিং মেশিন মেরামত",
    description: "Prompt troubleshooting for refrigerators, microwave ovens, washing machines, and water purifiers of all top brands (Singer, Walton, LG, Samsung).",
    basePrice: 950,
    priceUnit: "unit",
    estimatedDuration: "60-120 mins",
    warrantyDays: 30,
    image: "/src/assets/book_service/all.jpg",
    rating: 4.65,
    reviewsCount: 88,
    serviceAreas: ["Mirpur", "Dhanmondi", "Mohammadpur", "Uttara", "Badda", "Tejgaon"],
    features: [
      "Brand-authorized parts replacement",
      "Gas charging and PCB circuit repair",
      "Free doorstep diagnostics with repair",
      "Detailed invoice provided"
    ]
  },
  {
    id: "srv-painting",
    name: "Interior & Wall Painting",
    category: "Painting",
    categoryBn: "পেইন্টিং ও দেয়াল রং সেবা",
    description: "Professional interior wall painting, damp proofing, Berger/Asian Paints color consultation, and wall putty finishing.",
    basePrice: 4500,
    priceUnit: "room",
    estimatedDuration: "1-2 days",
    warrantyDays: 90,
    image: "/src/assets/why_choose_us/service-1.jpg",
    rating: 4.9,
    reviewsCount: 64,
    serviceAreas: ["Gulshan", "Banani", "Dhanmondi", "Uttara", "Bashundhara", "Mirpur"],
    features: [
      "Berger / Asian Paints licensed painters",
      "Furniture masking & floor protection",
      "Moisture meter wall inspection",
      "Free color shade card consultation"
    ]
  }
];

export const initialProviders = [
  {
    id: "prv-1",
    userId: "usr-p1",
    name: "Rafiqul Islam (AC Specialist)",
    nameBn: "রফিকুল ইসলাম (এসি স্পেশালিস্ট)",
    phone: "01711223344",
    email: "rafiq.ac@shebora.bd",
    photo: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80",
    categories: ["AC Repair", "Appliance Repair"],
    experienceYears: 7,
    rating: 4.9,
    reviewsCount: 118,
    approvalStatus: "approved", // approved, pending, rejected, suspended
    serviceRadiusKm: 8,
    location: {
      address: "House 14, Road 7, Sector 3, Uttara, Dhaka",
      area: "Uttara",
      lat: 23.8688,
      lng: 90.3995
    },
    verificationDoc: {
      type: "NID Card & HVAC Certificate",
      status: "verified",
      submittedAt: "2026-01-15T10:00:00Z"
    },
    workingHours: "08:00 AM - 09:00 PM",
    isAvailable: true,
    totalEarnings: 84500,
    completedJobs: 94
  },
  {
    id: "prv-2",
    userId: "usr-p2",
    name: "Khorshed Alam (Master Plumber)",
    nameBn: "খোরশেদ আলম (মাস্টার প্লাম্বার)",
    phone: "01819334455",
    email: "khorshed.plumbing@shebora.bd",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    categories: ["Plumbing"],
    experienceYears: 10,
    rating: 4.8,
    reviewsCount: 89,
    approvalStatus: "approved",
    serviceRadiusKm: 10,
    location: {
      address: "32/A Satmasjid Road, Dhanmondi, Dhaka",
      area: "Dhanmondi",
      lat: 23.7461,
      lng: 90.3742
    },
    verificationDoc: {
      type: "National ID & Trade License",
      status: "verified",
      submittedAt: "2026-02-10T12:00:00Z"
    },
    workingHours: "07:30 AM - 08:30 PM",
    isAvailable: true,
    totalEarnings: 62000,
    completedJobs: 78
  },
  {
    id: "prv-3",
    userId: "usr-p3",
    name: "Shahidul Hasan (Senior Electrician)",
    nameBn: "শাহিদুল হাসান (সিনিয়র ইলেকট্রিশিয়ান)",
    phone: "01912445566",
    email: "shahid.electric@shebora.bd",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    categories: ["Electrical Repair"],
    experienceYears: 8,
    rating: 4.95,
    reviewsCount: 145,
    approvalStatus: "approved",
    serviceRadiusKm: 12,
    location: {
      address: "Plot 8, Avenue 4, Mirpur DOHS, Dhaka",
      area: "Mirpur",
      lat: 23.8223,
      lng: 90.3654
    },
    verificationDoc: {
      type: "BBS Electrical License & NID",
      status: "verified",
      submittedAt: "2026-01-20T09:30:00Z"
    },
    workingHours: "08:00 AM - 10:00 PM",
    isAvailable: true,
    totalEarnings: 93200,
    completedJobs: 112
  },
  {
    id: "prv-4",
    userId: "usr-p4",
    name: "Nusrat Jahan (Cleaning Team Lead)",
    nameBn: "নুসরাত জাহান (ক্লিনিং টিম লিড)",
    phone: "01611556677",
    email: "nusrat.clean@shebora.bd",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    categories: ["Home Cleaning"],
    experienceYears: 5,
    rating: 4.88,
    reviewsCount: 130,
    approvalStatus: "approved",
    serviceRadiusKm: 15,
    location: {
      address: "Road 11, Block C, Banani, Dhaka",
      area: "Banani",
      lat: 23.7937,
      lng: 90.4066
    },
    verificationDoc: {
      type: "Trade Registration & Police Clearance",
      status: "verified",
      submittedAt: "2026-02-01T15:00:00Z"
    },
    workingHours: "09:00 AM - 06:00 PM",
    isAvailable: true,
    totalEarnings: 115000,
    completedJobs: 82
  },
  {
    id: "prv-5",
    userId: "usr-p5",
    name: "Tariqul Anam (Master Painter)",
    nameBn: "তারিকুল আনাম (মাস্টার পেইন্টার)",
    phone: "01722667788",
    email: "tariq.paint@shebora.bd",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
    categories: ["Painting"],
    experienceYears: 12,
    rating: 4.75,
    reviewsCount: 52,
    approvalStatus: "approved",
    serviceRadiusKm: 15,
    location: {
      address: "Road 3, Block D, Bashundhara R/A, Dhaka",
      area: "Bashundhara",
      lat: 23.8191,
      lng: 90.4526
    },
    verificationDoc: {
      type: "Berger Certified Applicator & NID",
      status: "verified",
      submittedAt: "2026-03-01T11:00:00Z"
    },
    workingHours: "08:30 AM - 07:00 PM",
    isAvailable: true,
    totalEarnings: 78000,
    completedJobs: 44
  },
  {
    id: "prv-6",
    userId: "usr-p6",
    name: "Kamal Hossain (Appliance Tech - Pending Approval)",
    nameBn: "কামাল হোসেন (অনুমোদনের অপেক্ষায়)",
    phone: "01511889900",
    email: "kamal.pending@shebora.bd",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
    categories: ["Appliance Repair"],
    experienceYears: 4,
    rating: 0,
    reviewsCount: 0,
    approvalStatus: "pending", // Provider must NOT receive customer bookings until approved
    serviceRadiusKm: 6,
    location: {
      address: "Ring Road, Mohammadpur, Dhaka",
      area: "Mohammadpur",
      lat: 23.7658,
      lng: 90.3584
    },
    verificationDoc: {
      type: "NID Card & Diploma Certificate",
      status: "under_review",
      submittedAt: "2026-10-15T08:00:00Z"
    },
    workingHours: "09:00 AM - 08:00 PM",
    isAvailable: false,
    totalEarnings: 0,
    completedJobs: 0
  }
];

export const initialUsers = [
  {
    id: "usr-admin",
    name: "Shebora Admin",
    email: "admin@shebora.bd",
    // hashed representation for password123
    passwordHash: "$2a$10$7R6vY7F0gH0pCq2P0/O1q.N4nF4fS1W2E3r4T5y6U7i8O9p0Q1w2e",
    role: "admin",
    phone: "01700000000",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
    createdAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "usr-customer",
    name: "Tanvir Ahmed",
    email: "customer@shebora.bd",
    passwordHash: "$2a$10$7R6vY7F0gH0pCq2P0/O1q.N4nF4fS1W2E3r4T5y6U7i8O9p0Q1w2e",
    role: "customer",
    phone: "01822334455",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
    address: {
      area: "Gulshan-2",
      road: "Road 71",
      building: "Green Valley Apt, Flat 4B",
      lat: 23.7925,
      lng: 90.4167
    },
    createdAt: "2026-01-10T00:00:00Z"
  },
  {
    id: "usr-p1",
    name: "Rafiqul Islam",
    email: "provider@shebora.bd",
    passwordHash: "$2a$10$7R6vY7F0gH0pCq2P0/O1q.N4nF4fS1W2E3r4T5y6U7i8O9p0Q1w2e",
    role: "provider",
    phone: "01711223344",
    avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=200",
    createdAt: "2026-01-15T00:00:00Z"
  }
];

export const initialBookings = [
  {
    id: "bk-1001",
    bookingNumber: "SHB-2026-1001",
    customerId: "usr-customer",
    customerName: "Tanvir Ahmed",
    customerPhone: "01822334455",
    customerEmail: "customer@shebora.bd",
    serviceId: "srv-ac-repair",
    serviceName: "AC Repair & Servicing",
    providerId: "prv-1",
    providerName: "Rafiqul Islam (AC Specialist)",
    providerPhone: "01711223344",
    scheduledDate: "2026-10-22",
    scheduledTime: "10:30 AM",
    status: "accepted", // requested, accepted, on_the_way, arrived, in_progress, completed, cancelled, rejected
    address: {
      area: "Gulshan-2",
      road: "Road 71",
      building: "Green Valley Apt",
      apartment: "Flat 4B",
      landmarks: "Near Gulshan 2 DCC Market",
      lat: 23.7925,
      lng: 90.4167
    },
    pricing: {
      baseAmount: 1200,
      materialsCost: 0,
      platformFee: 120, // 10%
      totalAmount: 1320,
      currency: "BDT"
    },
    payment: {
      method: "cash_on_delivery",
      status: "pending", // pending, paid, refunded, failed
      transactionId: null,
      paidAt: null
    },
    notes: "Master bedroom 1.5 ton Inverter AC cooling is weak.",
    timeline: [
      { status: "requested", timestamp: "2026-10-19T09:15:00Z", note: "Booking placed by customer" },
      { status: "accepted", timestamp: "2026-10-19T09:40:00Z", note: "Job accepted by Rafiqul Islam" }
    ],
    createdAt: "2026-10-19T09:15:00Z",
    hasReview: false
  },
  {
    id: "bk-1002",
    bookingNumber: "SHB-2026-1002",
    customerId: "usr-customer",
    customerName: "Tanvir Ahmed",
    customerPhone: "01822334455",
    customerEmail: "customer@shebora.bd",
    serviceId: "srv-plumbing",
    serviceName: "Plumbing & Sanitary Solutions",
    providerId: "prv-2",
    providerName: "Khorshed Alam (Master Plumber)",
    providerPhone: "01819334455",
    scheduledDate: "2026-10-18",
    scheduledTime: "03:00 PM",
    status: "completed",
    address: {
      area: "Dhanmondi",
      road: "Road 8A",
      building: "House 24",
      apartment: "3rd Floor",
      landmarks: "Opposite Abahani Ground",
      lat: 23.7480,
      lng: 90.3750
    },
    pricing: {
      baseAmount: 800,
      materialsCost: 350,
      platformFee: 80,
      totalAmount: 1230,
      currency: "BDT"
    },
    payment: {
      method: "cash_on_delivery",
      status: "paid",
      transactionId: "TXN-COD-98213",
      paidAt: "2026-10-18T16:30:00Z"
    },
    notes: "Kitchen sink drain blockage cleared and valve replaced.",
    timeline: [
      { status: "requested", timestamp: "2026-10-18T11:00:00Z", note: "Booking placed" },
      { status: "accepted", timestamp: "2026-10-18T11:30:00Z", note: "Accepted by Khorshed Alam" },
      { status: "on_the_way", timestamp: "2026-10-18T14:15:00Z", note: "Technician en route" },
      { status: "arrived", timestamp: "2026-10-18T14:50:00Z", note: "Arrived at location" },
      { status: "in_progress", timestamp: "2026-10-18T15:00:00Z", note: "Drain clearing started" },
      { status: "completed", timestamp: "2026-10-18T16:20:00Z", note: "Work completed & tested" }
    ],
    createdAt: "2026-10-18T11:00:00Z",
    hasReview: true
  }
];

export const initialReviews = [
  {
    id: "rev-1",
    bookingId: "bk-1002",
    serviceId: "srv-plumbing",
    providerId: "prv-2",
    customerId: "usr-customer",
    customerName: "Tanvir Ahmed",
    rating: 5,
    comment: "Khorshed bhai was very punctual, arrived on time in Dhanmondi and fixed the kitchen blockage cleanly. Very reasonable price in BDT.",
    createdAt: "2026-10-18T17:00:00Z"
  }
];

export const initialComplaints = [
  {
    id: "cmp-101",
    bookingId: "bk-1002",
    customerId: "usr-customer",
    customerName: "Tanvir Ahmed",
    providerId: "prv-2",
    providerName: "Khorshed Alam",
    issueType: "Minor Leakage Notice",
    description: "After the technician left, observed a tiny drop from the main valve connection.",
    status: "resolved", // open, under_investigation, resolved, dismissed
    adminResolution: "Provider sent an apprentice next morning to tighten the joint for free. Customer verified satisfaction.",
    resolvedAt: "2026-10-19T08:00:00Z",
    createdAt: "2026-10-18T19:00:00Z"
  }
];

// Persistent storage in memory with copy fallback
class SheboraDataStore {
  constructor() {
    this.services = [...initialServices];
    this.providers = [...initialProviders];
    this.users = [...initialUsers];
    this.bookings = [...initialBookings];
    this.reviews = [...initialReviews];
    this.complaints = [...initialComplaints];
    this.notifications = [
      {
        id: "notif-1",
        userId: "usr-customer",
        title: "Booking Accepted",
        titleBn: "বুকিং নিশ্চিত হয়েছে",
        message: "Your AC Repair booking has been accepted by Rafiqul Islam for Oct 22.",
        read: false,
        createdAt: "2026-10-19T09:40:00Z"
      }
    ];
    this.auditLogs = [
      {
        id: "log-1",
        action: "PROVIDER_APPROVED",
        performedBy: "admin@shebora.bd",
        targetId: "prv-1",
        details: "Approved Rafiqul Islam after NID and HVAC certificate verification",
        timestamp: "2026-01-15T11:00:00Z"
      }
    ];
  }

  // Getters
  getServices() { return this.services; }
  getServiceById(id) { return this.services.find(s => s.id === id); }
  
  getProviders(status = null) {
    if (status) return this.providers.filter(p => p.approvalStatus === status);
    return this.providers;
  }
  getProviderById(id) { return this.providers.find(p => p.id === id); }
  getProviderByUserId(userId) { return this.providers.find(p => p.userId === userId); }

  getUsers() { return this.users; }
  getUserByEmail(email) { return this.users.find(u => u.email.toLowerCase() === email.toLowerCase()); }
  getUserById(id) { return this.users.find(u => u.id === id); }

  getBookings(filter = {}) {
    let list = [...this.bookings];
    if (filter.customerId) list = list.filter(b => b.customerId === filter.customerId);
    if (filter.providerId) list = list.filter(b => b.providerId === filter.providerId);
    if (filter.status) list = list.filter(b => b.status === filter.status);
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  getBookingById(id) { return this.bookings.find(b => b.id === id || b.bookingNumber === id); }

  getReviews(serviceId = null) {
    if (serviceId) return this.reviews.filter(r => r.serviceId === serviceId);
    return this.reviews;
  }

  getComplaints() { return this.complaints; }
  getNotifications(userId) { return this.notifications.filter(n => n.userId === userId); }
  getAuditLogs() { return this.auditLogs; }

  // Mutations
  addUser(user) {
    this.users.push(user);
    return user;
  }

  addProvider(provider) {
    this.providers.push(provider);
    return provider;
  }

  updateProvider(id, updates) {
    const idx = this.providers.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.providers[idx] = { ...this.providers[idx], ...updates };
      return this.providers[idx];
    }
    return null;
  }

  addBooking(booking) {
    this.bookings.unshift(booking);
    // Auto-create notification for provider and customer
    if (booking.providerId) {
      const provider = this.getProviderById(booking.providerId);
      if (provider) {
        this.addNotification({
          userId: provider.userId,
          title: "New Booking Request",
          titleBn: "নতুন বুকিং অনুরোধ",
          message: `New booking request for ${booking.serviceName} in ${booking.address.area}`,
          read: false,
          createdAt: new Date().toISOString()
        });
      }
    }
    return booking;
  }

  updateBooking(id, updates) {
    const idx = this.bookings.findIndex(b => b.id === id || b.bookingNumber === id);
    if (idx !== -1) {
      this.bookings[idx] = { ...this.bookings[idx], ...updates };
      return this.bookings[idx];
    }
    return null;
  }

  addReview(review) {
    this.reviews.unshift(review);
    // Mark booking as reviewed
    const booking = this.getBookingById(review.bookingId);
    if (booking) {
      booking.hasReview = true;
    }
    // Update service and provider ratings
    this.recalculateRatings(review.serviceId, review.providerId);
    return review;
  }

  recalculateRatings(serviceId, providerId) {
    if (serviceId) {
      const srvReviews = this.reviews.filter(r => r.serviceId === serviceId);
      const srv = this.getServiceById(serviceId);
      if (srv && srvReviews.length > 0) {
        const avg = srvReviews.reduce((sum, r) => sum + r.rating, 0) / srvReviews.length;
        srv.rating = Math.round(avg * 10) / 10;
        srv.reviewsCount = srvReviews.length;
      }
    }
    if (providerId) {
      const prvReviews = this.reviews.filter(r => r.providerId === providerId);
      const prv = this.getProviderById(providerId);
      if (prv && prvReviews.length > 0) {
        const avg = prvReviews.reduce((sum, r) => sum + r.rating, 0) / prvReviews.length;
        prv.rating = Math.round(avg * 10) / 10;
        prv.reviewsCount = prvReviews.length;
      }
    }
  }

  addComplaint(complaint) {
    this.complaints.unshift(complaint);
    this.addAuditLog({
      action: "COMPLAINT_FILED",
      performedBy: complaint.customerName,
      targetId: complaint.id,
      details: `Complaint filed for Booking ${complaint.bookingId}: ${complaint.issueType}`
    });
    return complaint;
  }

  updateComplaint(id, updates) {
    const idx = this.complaints.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.complaints[idx] = { ...this.complaints[idx], ...updates };
      return this.complaints[idx];
    }
    return null;
  }

  addNotification(notif) {
    notif.id = "notif-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4);
    this.notifications.unshift(notif);
    return notif;
  }

  markNotificationsRead(userId) {
    this.notifications.forEach(n => {
      if (n.userId === userId) n.read = true;
    });
  }

  addAuditLog(log) {
    log.id = "log-" + Date.now();
    log.timestamp = new Date().toISOString();
    this.auditLogs.unshift(log);
    return log;
  }
}

export const dbStore = new SheboraDataStore();
