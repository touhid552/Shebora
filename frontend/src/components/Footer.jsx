import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, ShieldCheck, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-neutral-900 text-neutral-300 border-t border-neutral-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-white p-0.5 flex items-center justify-center overflow-hidden border border-neutral-700 shadow-xs">
                <img
                  src="/assets/aistudio/image_cc3069dd.png"
                  alt="Shebora Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-black tracking-tight text-white">SHEBORA</span>
            </Link>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Dhaka's verified home services marketplace. We connect homeowners and businesses with background-checked, skilled technicians for air conditioning, plumbing, electrical, home cleaning, and appliance repairs.
            </p>
            <div className="space-y-1.5 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Customer Care: <strong>09612-SHEBORA (743267)</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>support@shebora.bd</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Technician Dispatch: 7:00 AM – 11:00 PM (Everyday)</span>
              </div>
            </div>
          </div>

          {/* Service Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Home Services
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li><Link to="/services?category=AC%20Repair" className="hover:text-emerald-400">AC Repair & Servicing</Link></li>
              <li><Link to="/services?category=Plumbing" className="hover:text-emerald-400">Plumbing & Sanitary Solutions</Link></li>
              <li><Link to="/services?category=Electrical%20Repair" className="hover:text-emerald-400">Electrical & Circuit Wiring</Link></li>
              <li><Link to="/services?category=Home%20Cleaning" className="hover:text-emerald-400">Deep Home Cleaning</Link></li>
              <li><Link to="/services?category=Appliance%20Repair" className="hover:text-emerald-400">Refrigerator & Washing Machine</Link></li>
              <li><Link to="/services?category=Painting" className="hover:text-emerald-400">Wall Painting & Damp Proofing</Link></li>
            </ul>
          </div>

          {/* Dhaka Service Areas */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Dhaka Coverage
            </h4>
            <ul className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs text-neutral-400">
              <li>Gulshan 1 & 2</li>
              <li>Banani</li>
              <li>Dhanmondi</li>
              <li>Uttara (Sec 1-14)</li>
              <li>Mirpur & DOHS</li>
              <li>Mohammadpur</li>
              <li>Bashundhara R/A</li>
              <li>Baridhara</li>
              <li>Badda</li>
              <li>Motijheel</li>
              <li>Tejgaon</li>
              <li>Lalbagh</li>
            </ul>
          </div>

          {/* Safety & Portal Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Safety & Governance
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li><Link to="/map" className="hover:text-emerald-400">Live Coverage Map</Link></li>
              <li><Link to="/register" className="hover:text-emerald-400">Register as Technician</Link></li>
              <li><Link to="/dashboard/customer" className="hover:text-emerald-400">Customer Bookings & Invoices</Link></li>
              <li><Link to="/dashboard/admin" className="hover:text-emerald-400">Admin Verification Portal</Link></li>
              <li className="pt-2 text-[11px] text-neutral-500">
                All prices quoted in Bangladeshi Taka (৳). 30-day workmanship warranty included on eligible services.
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-3">
          <p>© {new Date().getFullYear()} Shebora Technologies Ltd. Dhaka, Bangladesh. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-neutral-400">Privacy Policy</span>
            <span className="hover:text-neutral-400">Terms of Service</span>
            <span className="hover:text-neutral-400">Provider Agreement</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
