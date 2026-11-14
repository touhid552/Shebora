import { Link } from 'react-router-dom';
import { MapPin, Wrench } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';

const serviceLinks = [
  ['AC Repair', 'AC%20Repair'],
  ['Plumbing', 'Plumbing'],
  ['Electrical Repair', 'Electrical%20Repair'],
  ['Home Cleaning', 'Home%20Cleaning'],
  ['Appliance Repair', 'Appliance%20Repair'],
  ['Painting', 'Painting']
];

export default function Footer() {
  const { lang } = useLanguage();
  const isBangla = lang === 'bn';

  return (
    <footer className="mt-16 bg-[#102a24] text-emerald-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-[1.4fr_.8fr_.9fr_1fr] lg:gap-12">
          <div>
            <Link to="/" aria-label="Shebora home" className="inline-flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white p-0.5">
                <img src="/assets/brand/shebora-logo.png" alt="" className="h-full w-full object-contain" />
              </span>
              <span className="text-xl font-black tracking-tight text-white">Shebora</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-emerald-100/70">
              {isBangla
                ? '\u09A2\u09BE\u0995\u09BE\u09AF\u09BC \u09AC\u09BE\u09B8\u09BE\u09B0 \u09AA\u09CD\u09B0\u09AF\u09BC\u09CB\u099C\u09A8\u09C7 \u09A8\u09BF\u09B0\u09CD\u09AD\u09B0\u09AF\u09CB\u0997\u09CD\u09AF \u09B9\u09CB\u09AE \u09B8\u09BE\u09B0\u09CD\u09AD\u09BF\u09B8 \u09AC\u09C1\u0995 \u0995\u09B0\u09C1\u09A8\u0964'
                : 'Book trusted home services across Dhaka. Browse the catalogue, choose a time, and follow your booking from one place.'}
            </p>

          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[.16em] text-white">{isBangla ? '\u09B8\u09C7\u09AC\u09BE' : 'Services'}</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-emerald-100/70">
              {serviceLinks.map(([label, category]) => <li key={category}><Link className="transition hover:text-white" to={`/services?category=${category}`}>{label}</Link></li>)}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[.16em] text-white">{isBangla ? '\u09B6\u09C7\u09AC\u09CB\u09B0\u09BE' : 'Explore Shebora'}</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-emerald-100/70">
              <li><Link className="transition hover:text-white" to="/services">{isBangla ? '\u09B8\u09AC \u09B8\u09C7\u09AC\u09BE \u09A6\u09C7\u0996\u09C1\u09A8' : 'Browse services'}</Link></li>
              <li><Link className="transition hover:text-white" to="/map">{isBangla ? '\u09A2\u09BE\u0995\u09BE \u09AE\u09CD\u09AF\u09BE\u09AA' : 'Dhaka coverage map'}</Link></li>
              <li><Link className="transition hover:text-white" to="/book-service">{isBangla ? '\u09B8\u09BE\u09B0\u09CD\u09AD\u09BF\u09B8 \u09AC\u09C1\u0995 \u0995\u09B0\u09C1\u09A8' : 'Book a service'}</Link></li>
              <li><Link className="transition hover:text-white" to="/provider/login">{isBangla ? '\u09AA\u09CD\u09B0\u09CB\u09AD\u09BE\u0987\u09A1\u09BE\u09B0 \u09B2\u0997\u0987\u09A8' : 'Provider sign in'}</Link></li>
              <li><Link className="transition hover:text-white" to="/register">{isBangla ? '\u09AA\u09CD\u09B0\u09CB\u09AD\u09BE\u0987\u09A1\u09BE\u09B0 \u09B9\u09BF\u09B8\u09C7\u09AC\u09C7 \u09AF\u09CB\u0997 \u09A6\u09BF\u09A8' : 'Become a provider'}</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-white"><MapPin className="h-4 w-4 text-emerald-300" />{isBangla ? '\u09A2\u09BE\u0995\u09BE\u09AF\u09BC \u0986\u09AE\u09BE\u09A6\u09C7\u09B0 \u098F\u09B2\u09BE\u0995\u09BE' : 'Dhaka service areas'}</h2>
            <p className="mt-4 text-sm leading-6 text-emerald-100/70">Open a service listing to check its available Dhaka areas.</p>
            <Link to="/map" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 transition hover:text-white"><Wrench className="h-3.5 w-3.5" />See service coverage</Link>
          </div>
        </div>

        <div className="mt-9 flex flex-col gap-2 border-t border-white/10 pt-5 text-[11px] text-emerald-100/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Shebora · Dhaka, Bangladesh</p>
          <p>Prices are shown in Bangladeshi Taka (BDT).</p>
        </div>
      </div>
    </footer>
  );
}
