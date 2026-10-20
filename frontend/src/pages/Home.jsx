import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, ArrowUpRight, BadgeCheck, Check, ChevronRight, Clock3,
  MapPin, Search, ShieldCheck, Sparkles, Star, Wrench, Zap, Wind,
  Droplets, Sofa, Paintbrush, Refrigerator, HeartHandshake, Menu
} from 'lucide-react';
import { api } from '../services/api.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import DhakaInteractiveMap from '../components/map/DhakaInteractiveMap.jsx';

const categories = [
  { name: 'AC Repair', bn: 'এসি মেরামত', icon: Wind, tone: 'mint', price: '৳1,200' },
  { name: 'Plumbing', bn: 'প্লাম্বিং', icon: Droplets, tone: 'blue', price: '৳800' },
  { name: 'Electrical Repair', bn: 'ইলেকট্রিক্যাল', icon: Zap, tone: 'yellow', price: '৳650' },
  { name: 'Home Cleaning', bn: 'ঘর পরিষ্কার', icon: Sparkles, tone: 'pink', price: '৳2,500' },
  { name: 'Appliance Repair', bn: 'যন্ত্রপাতি মেরামত', icon: Refrigerator, tone: 'purple', price: '৳950' },
  { name: 'Painting', bn: 'রং করা', icon: Paintbrush, tone: 'orange', price: '৳4,500' }
];

const benefits = [
  { icon: ShieldCheck, title: 'People you can trust', text: 'Technicians are reviewed and approved before they can accept jobs.' },
  { icon: BadgeCheck, title: 'Clear, upfront pricing', text: 'See service rates in Bangladeshi Taka before you make a booking.' },
  { icon: Clock3, title: 'Your time matters', text: 'Choose a time that works for your home and your schedule.' },
  { icon: HeartHandshake, title: 'Help when you need it', text: 'Keep booking details and service updates together in one place.' }
];

const testimonials = [
  { quote: 'Booking was simple, the technician explained the work clearly, and there were no surprises.', name: 'Nusrat A.', area: 'Dhanmondi, Dhaka' },
  { quote: 'I found the service I needed without calling around. The whole process felt straightforward.', name: 'Mahmud R.', area: 'Uttara, Dhaka' },
  { quote: 'The price and appointment details were easy to understand. That made the experience better.', name: 'Farhana S.', area: 'Mirpur, Dhaka' }
];

export default function Home() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadHomeData() {
      try {
        const [serviceResponse, providerResponse] = await Promise.all([
          api.getServices(),
          api.getApprovedProviders()
        ]);
        if (!active) return;
        if (Array.isArray(serviceResponse?.data)) setServices(serviceResponse.data);
        if (Array.isArray(providerResponse?.data)) setProviders(providerResponse.data);
      } catch (error) {
        console.error('Unable to load homepage data:', error);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadHomeData();
    return () => { active = false; };
  }, []);

  const featuredServices = useMemo(() => services.slice(0, 3), [services]);

  function submitSearch(event) {
    event.preventDefault();
    const query = searchTerm.trim();
    navigate(query ? `/services?searchTerm=${encodeURIComponent(query)}` : '/services');
  }

  return (
    <div className="shebora-home">
      <section className="home-hero">
        <div className="home-hero-glow home-hero-glow-one" aria-hidden="true" />
        <div className="home-hero-glow home-hero-glow-two" aria-hidden="true" />
        <div className="home-container home-hero-grid">
          <div className="home-hero-copy">
            <div className="home-eyebrow"><span className="home-eyebrow-dot" /> Better home care, right here in Dhaka</div>
            <h1>{lang === 'bn' ? <>আপনার ঘরের যত্নে <em>বিশ্বস্ত সেবা</em></> : <>Your home, in good hands<span className="home-heading-period">.</span></>}</h1>
            <p className="home-hero-description">
              {lang === 'bn'
                ? 'এসি মেরামত থেকে ঘর পরিষ্কার—বিশ্বস্ত পেশাদার খুঁজুন এবং সহজেই বুক করুন।'
                : 'From a quick repair to a fresh, clean home — book skilled local professionals without the hassle.'}
            </p>
            <form className="home-search" onSubmit={submitSearch} role="search">
              <Search size={20} aria-hidden="true" />
              <input
                aria-label="Search home services"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={t('searchPlaceholder') || 'What does your home need?'}
              />
              <button type="submit">Find a service <ArrowRight size={17} /></button>
            </form>
            <div className="home-trust-row">
              <span><Check size={15} /> Verified professionals</span>
              <span><Check size={15} /> Upfront pricing</span>
              <span><Check size={15} /> Easy booking</span>
            </div>
            <div className="home-social-proof">
              <div className="home-avatar-stack" aria-hidden="true"><span>N</span><span>R</span><span>M</span><span>+</span></div>
              <div><strong>Made for Dhaka homes</strong><small>Local services, all in one place</small></div>
            </div>
          </div>
          <div className="home-hero-visual">
            <div className="home-photo-card">
              <img
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1100&q=85"
                alt="Home service professional carefully working in a modern home"
                fetchPriority="high"
              />
              <div className="home-photo-shade" />
              <div className="home-photo-caption"><span className="home-caption-icon"><Wrench size={18} /></span><div><strong>Good work. Peace of mind.</strong><small>Help for the everyday things at home.</small></div></div>
            </div>
            <div className="home-floating-card home-floating-rating"><span className="home-rating-icon"><Star size={17} fill="currentColor" /></span><div><strong>Care you can count on</strong><small>Built around your home and time</small></div></div>
            <div className="home-floating-card home-floating-location"><MapPin size={17} /><span>Serving Dhaka, Bangladesh</span></div>
          </div>
        </div>
        <div className="home-container home-hero-bottom"><span>ONE SIMPLE PLACE FOR HOME SERVICES</span><span className="home-bottom-line" /><span>AC · PLUMBING · ELECTRICAL · CLEANING</span></div>
      </section>

      <section className="home-section home-category-section" id="services">
        <div className="home-container">
          <div className="home-section-heading">
            <div><span className="home-kicker">WHAT CAN WE HELP WITH?</span><h2>Little fixes. Big peace of mind.</h2><p>Find the right person for the job, without the runaround.</p></div>
            <Link className="home-text-link" to="/services">Explore all services <ArrowUpRight size={17} /></Link>
          </div>
          <div className="home-category-grid">
            {categories.map(({ name, bn, icon: Icon, tone, price }) => (
              <Link key={name} to={`/services?category=${encodeURIComponent(name)}`} className="home-category-card">
                <span className={`home-category-icon tone-${tone}`}><Icon size={25} strokeWidth={1.8} /></span>
                <span className="home-category-title">{lang === 'bn' ? bn : name}</span>
                <span className="home-category-bottom"><span>From {price}</span><ChevronRight size={17} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-featured-section">
        <div className="home-container">
          <div className="home-section-heading">
            <div><span className="home-kicker">POPULAR RIGHT NOW</span><h2>Help for your home</h2><p>Explore services people book for everyday home care.</p></div>
            <Link className="home-text-link" to="/services">See every service <ArrowUpRight size={17} /></Link>
          </div>
          {loading ? (
            <div className="home-service-grid">{[1, 2, 3].map((item) => <div className="home-service-skeleton" key={item} />)}</div>
          ) : featuredServices.length ? (
            <div className="home-service-grid">
              {featuredServices.map((service) => (
                <article className="home-service-card" key={service.id || service._id || service.name}>
                  <Link className="home-service-image" to={`/service-details/${service.id || service._id}`}>
                    <img src={service.image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80'} alt={service.name} loading="lazy" />
                    <span>{service.category}</span>
                  </Link>
                  <div className="home-service-content">
                    <div className="home-service-title-row"><h3>{lang === 'bn' && service.categoryBn ? service.categoryBn : service.name}</h3><span className="home-service-rating"><Star size={14} fill="currentColor" /> {service.rating || 'New'}</span></div>
                    <p>{service.description}</p>
                    <div className="home-service-footer"><div><small>Starting from</small><strong>৳{service.basePrice} <small>/ {service.priceUnit || 'service'}</small></strong></div><Link to={`/book-service?serviceId=${service.id || service._id}`} aria-label={`Book ${service.name}`}><ArrowUpRight size={19} /></Link></div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="home-empty-state"><Sofa size={28} /><p>Our services are being refreshed. Explore all categories to find what you need.</p><Link to="/services">Browse services <ArrowRight size={16} /></Link></div>
          )}
        </div>
      </section>

      <section className="home-section home-why-section">
        <div className="home-container home-why-grid">
          <div className="home-why-intro"><span className="home-kicker">THE SHEBORA DIFFERENCE</span><h2>Home service should feel <em>simple.</em></h2><p>We bring the details together, so you can spend less time searching and more time feeling at home.</p><Link className="home-dark-link" to="/services">Find your service <ArrowRight size={17} /></Link></div>
          <div className="home-benefits-grid">{benefits.map(({ icon: Icon, title, text }, index) => <article className="home-benefit" key={title}><span className="home-benefit-number">0{index + 1}</span><span className="home-benefit-icon"><Icon size={23} /></span><h3>{title}</h3><p>{text}</p></article>)}</div>
        </div>
      </section>

      <section className="home-section home-map-section">
        <div className="home-container">
          <div className="home-map-panel">
            <div className="home-map-copy"><span className="home-kicker home-kicker-light"><MapPin size={14} /> LOCAL KNOW-HOW</span><h2>Dhaka is our home, too.</h2><p>Explore service coverage and find professionals around your neighbourhood. Your location is only used when you choose to share it.</p><Link to="/map" className="home-map-button">Explore the Dhaka map <ArrowRight size={17} /></Link><div className="home-map-stats"><div><strong>16+</strong><span>Neighbourhoods</span></div><div><strong>{providers.length || 'Local'}</strong><span>{providers.length ? 'Approved providers' : 'Skilled professionals'}</span></div></div></div>
            <div className="home-map-frame"><DhakaInteractiveMap providers={providers} height="410px" showFilters={true} /></div>
          </div>
        </div>
      </section>

      <section className="home-section home-reviews-section">
        <div className="home-container">
          <div className="home-section-heading"><div><span className="home-kicker">A LITTLE MORE REASSURANCE</span><h2>Good service feels different.</h2><p>We want every booking to leave you feeling looked after.</p></div></div>
          <div className="home-testimonial-grid">{testimonials.map((item) => <article className="home-testimonial" key={item.name}><div className="home-stars" aria-label="5 out of 5 stars">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={15} fill="currentColor" />)}</div><blockquote>“{item.quote}”</blockquote><div className="home-review-person"><span>{item.name.charAt(0)}</span><div><strong>{item.name}</strong><small><MapPin size={12} /> {item.area}</small></div></div></article>)}</div>
        </div>
      </section>

      <section className="home-final-cta"><div className="home-container home-final-cta-inner"><div><span className="home-kicker home-kicker-light">READY WHEN YOU ARE</span><h2>Make home feel like home again.</h2><p>Tell us what you need. We’ll help you find the right service.</p></div><Link to="/services">Find a service <ArrowRight size={18} /></Link></div></section>
    </div>
  );
}
