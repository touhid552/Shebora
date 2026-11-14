import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { Bell, BriefcaseBusiness, ChevronDown, CircleUserRound, LogOut, MapPin, Menu, Moon, Sun, UserRound, X } from 'lucide-react';

const dashboardFor = (role) => ({
  admin: '/dashboard/admin',
  provider: '/dashboard/provider',
  customer: '/dashboard/customer'
}[role] || '/dashboard/customer');

const roleNames = { customer: 'Customer', provider: 'Provider', admin: 'Admin' };

export default function Navbar() {
  const { user, logout, notifications, unreadCount, markNotificationsRead } = useAuth();
  const { t, lang, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { to: '/', label: t('home') },
    { to: '/services', label: t('services') },
    { to: '/map', label: t('map'), icon: MapPin },
    { to: '/book-service', label: t('bookService') }
  ];
  const dashboardPath = dashboardFor(user?.role);
  const isCurrent = (path) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
  const linkClass = (path) => `inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-semibold transition-colors ${isCurrent(path) ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'text-neutral-600 hover:bg-neutral-50 hover:text-emerald-800 dark:text-neutral-300 dark:hover:bg-neutral-800'}`;
  const toggleLanguageLabel = lang === 'en' ? '\u09AC\u09BE\u0982\u09B2\u09BE' : 'EN';

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setNotifOpen(false);
  };

  const handleLogout = () => {
    closeMenus();
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/95 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-950/95">
      <div className="hidden border-b border-neutral-800 bg-[#102a24] text-emerald-50 sm:block">
        <div className="mx-auto flex h-8 max-w-7xl items-center justify-between px-4 text-[11px] sm:px-6 lg:px-8">
          <span className="text-emerald-100/80">Home services in Dhaka</span>
          <span className="font-medium text-emerald-100/80">Explore • Book • Manage</span>
        </div>
      </div>

      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link to="/" onClick={closeMenus} aria-label="Shebora home" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-emerald-100 bg-white p-0.5 shadow-sm dark:border-emerald-900">
            <img src="/assets/brand/shebora-logo.png" alt="" className="h-full w-full object-contain" />
          </span>
          <span className="leading-tight">
            <span className="block text-[17px] font-black tracking-[-.04em] text-neutral-900 dark:text-white">Shebora</span>
            <span className="block text-[10px] font-medium tracking-wide text-neutral-500">HOME SERVICES · DHAKA</span>
          </span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} className={linkClass(to)}>
              {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}{label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-1.5 md:flex">
          <button type="button" onClick={toggleLanguage} aria-label={`Switch language to ${lang === 'en' ? 'Bangla' : 'English'}`} className="rounded-lg px-2.5 py-2 text-xs font-bold text-neutral-600 transition hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800">
            {toggleLanguageLabel}
          </button>
          <button type="button" onClick={toggleTheme} aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'} title={theme === 'light' ? 'Dark theme' : 'Light theme'} className="rounded-lg p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800">
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          {user && (
            <div className="relative">
              <button type="button" onClick={() => { setNotifOpen(value => !value); setUserDropdownOpen(false); if (!notifOpen && unreadCount > 0) markNotificationsRead(); }} aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`} aria-expanded={notifOpen} className="relative rounded-lg p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-neutral-950" />}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-900">
                  <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3 dark:border-neutral-800">
                    <h2 className="text-sm font-bold text-neutral-900 dark:text-white">Notifications</h2>
                    <button type="button" onClick={markNotificationsRead} className="text-[11px] font-semibold text-emerald-700 hover:underline dark:text-emerald-300">Mark all read</button>
                  </div>
                  <div className="max-h-80 divide-y divide-neutral-100 overflow-y-auto dark:divide-neutral-800">
                    {notifications.length === 0 ? (
                      <p className="px-4 py-8 text-center text-xs text-neutral-500">You’re all caught up.</p>
                    ) : notifications.map(item => (
                      <div key={item.id} className={`px-4 py-3 ${!item.read ? 'bg-emerald-50/60 dark:bg-emerald-950/30' : ''}`}>
                        <p className="text-xs font-semibold text-neutral-900 dark:text-white">{lang === 'bn' && item.titleBn ? item.titleBn : item.title}</p>
                        <p className="mt-1 text-xs leading-5 text-neutral-600 dark:text-neutral-300">{item.message}</p>
                        <time className="mt-1 block text-[10px] text-neutral-400">{new Date(item.createdAt).toLocaleString()}</time>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {user ? (
            <div className="relative ml-1">
              <button type="button" onClick={() => { setUserDropdownOpen(value => !value); setNotifOpen(false); }} aria-expanded={userDropdownOpen} aria-label="Open account menu" className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white py-1 pl-1 pr-2.5 transition hover:border-emerald-300 dark:border-neutral-700 dark:bg-neutral-900">
                <img src={user.avatar || '/assets/brand/shebora-logo.png'} alt="" className="h-8 w-8 rounded-full bg-neutral-100 object-cover" />
                <span className="max-w-24 truncate text-xs font-semibold text-neutral-800 dark:text-neutral-100">{user.name?.split(' ')[0]}</span>
                <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
              </button>
              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-900">
                  <div className="border-b border-neutral-100 px-4 py-3 dark:border-neutral-800">
                    <p className="truncate text-sm font-bold text-neutral-900 dark:text-white">{user.name}</p>
                    <p className="truncate text-[11px] text-neutral-500">{user.email}</p>
                    <span className="mt-2 inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold capitalize text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">{roleNames[user.role] || user.role}</span>
                  </div>
                  <Link to="/profile" onClick={closeMenus} className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-neutral-700 hover:bg-neutral-50 dark:text-neutral-200 dark:hover:bg-neutral-800"><UserRound className="h-4 w-4 text-neutral-400" />Manage profile</Link>
                  <Link to={dashboardPath} onClick={closeMenus} className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-neutral-700 hover:bg-neutral-50 dark:text-neutral-200 dark:hover:bg-neutral-800"><BriefcaseBusiness className="h-4 w-4 text-neutral-400" />{roleNames[user.role] || 'Account'} dashboard</Link>
                  <button type="button" onClick={handleLogout} className="flex w-full items-center gap-2.5 border-t border-neutral-100 px-4 py-2.5 text-left text-xs font-semibold text-rose-700 hover:bg-rose-50 dark:border-neutral-800 dark:hover:bg-rose-950/40"><LogOut className="h-4 w-4" />Sign out</button>
                </div>
              )}
            </div>
          ) : (
            <div className="ml-1 flex items-center gap-2">
              <Link to="/login" className="rounded-lg px-3 py-2 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800">{t('login')}</Link>
              <Link to="/register" className="rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-800">{t('register')}</Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <button type="button" onClick={toggleLanguage} aria-label="Change language" className="rounded-lg px-2 py-2 text-[11px] font-bold text-neutral-600 dark:text-neutral-300">{toggleLanguageLabel}</button>
          <button type="button" onClick={() => setMobileMenuOpen(value => !value)} aria-expanded={mobileMenuOpen} aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'} className="rounded-lg p-2 text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-neutral-200 bg-white px-4 pb-5 pt-3 shadow-lg dark:border-neutral-800 dark:bg-neutral-950 md:hidden">
          <nav aria-label="Mobile navigation" className="grid gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} onClick={closeMenus} className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold ${isCurrent(to) ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'text-neutral-700 hover:bg-neutral-50 dark:text-neutral-200 dark:hover:bg-neutral-900'}`}>
                {Icon && <Icon className="h-4 w-4" />}{label}
              </Link>
            ))}
          </nav>
          {user ? (
            <div className="mt-3 grid gap-2 border-t border-neutral-100 pt-3 dark:border-neutral-800">
              <p className="px-3 text-xs text-neutral-500">Signed in as <strong className="text-neutral-800 dark:text-neutral-100">{user.name}</strong></p>
              <Link to={dashboardPath} onClick={closeMenus} className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"><BriefcaseBusiness className="h-4 w-4" />Open {roleNames[user.role]} dashboard</Link>
              <Link to="/profile" onClick={closeMenus} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-200 dark:hover:bg-neutral-900"><CircleUserRound className="h-4 w-4" />Manage profile</Link>
              <button type="button" onClick={toggleTheme} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-200 dark:hover:bg-neutral-900">{theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}{theme === 'light' ? 'Dark appearance' : 'Light appearance'}</button>
              <button type="button" onClick={handleLogout} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-rose-700 hover:bg-rose-50"><LogOut className="h-4 w-4" />Sign out</button>
            </div>
          ) : (
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-neutral-100 pt-3 dark:border-neutral-800">
              <Link to="/login" onClick={closeMenus} className="rounded-lg border border-neutral-200 py-2.5 text-center text-sm font-semibold text-neutral-700 dark:border-neutral-700 dark:text-neutral-200">{t('login')}</Link>
              <Link to="/register" onClick={closeMenus} className="rounded-lg bg-emerald-700 py-2.5 text-center text-sm font-bold text-white">{t('register')}</Link>
              <button type="button" onClick={toggleTheme} className="col-span-2 flex items-center justify-center gap-2 rounded-lg bg-neutral-50 py-2.5 text-xs font-semibold text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">{theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}{theme === 'light' ? 'Dark appearance' : 'Light appearance'}</button>
              <div className="col-span-2 flex justify-center gap-4 pt-1 text-[11px] text-neutral-500">
                <Link to="/customer/login" onClick={closeMenus}>Customer portal</Link>
                <Link to="/provider/login" onClick={closeMenus}>Provider portal</Link>
                <Link to="/admin/login" onClick={closeMenus}>Admin portal</Link>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
