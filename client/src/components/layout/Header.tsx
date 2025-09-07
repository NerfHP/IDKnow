import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- Icon Imports ---
import {
  ChevronDown,
  ChevronRight,
  Search,
  User,
  ShoppingCart,
  Menu,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Mail,
  X,
} from 'lucide-react';

// --- Custom Hooks & Assets ---
import logo from '@/assets/LOGO.png';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';

// --- TypeScript Interfaces for Menu Data ---
interface SubSubItem {
  name: string;
  path: string;
}

interface SubItem {
  name: string;
  path: string;
  icon?: string;
  subSubItems?: SubSubItem[];
  isSingleProduct?: boolean;
}

interface MenuItem {
  name: string;
  path: string;
  subItems: SubItem[];
}

// --- Prop Definition for this Component ---
interface HeaderProps {
  onSearchClick: () => void;
  onCartClick: () => void;
}

// --- Menu Data ---
const rudrakshaSubItems = Array.from({ length: 14 }, (_, i) => ({
  name: `${i + 1} Mukhi`,
  path: `/products/${i + 1}-mukhi-rudraksha`, // CORRECTED PATH
  icon: `/rudraksha/${i + 1}-mukhi.png`, // Placeholder path
}));

const menuItems: MenuItem[] = [
  {
    name: 'Yantras',
    path: '/products/yantras', // CORRECTED PATH
    subItems: [
      { name: 'Shree Yantra', path: '/products/yantras/shree-yantra' },
      { name: 'Maha Lakshmi Yantra', path: '/products/yantras/lakshmi-yantra' },
      { name: 'Kuber Yantra', path: '/products/yantras/kuber-yantra' },
      { name: 'Navgraha Yantra', path: '/products/yantras/navgraha-yantra' },
    ],
  },
  {
    name: 'Bracelets',
    path: '/products/bracelets', // CORRECTED PATH
    subItems: [
      { name: 'Rudraksha Bracelets', path: '/products/bracelets/rudraksha' },
      { name: 'Crystal Bracelets', path: '/products/bracelets/crystal' },
      { name: 'Karungali Bracelets', path: '/products/bracelets/karungali' },
      { name: 'Gemstone Bracelets', path: '/products/bracelets/gemstone' },
    ],
  },
  {
    name: 'Rudraksha',
    path: '/products/rudraksha', // CORRECTED PATH
    subItems:[
      ...rudrakshaSubItems,
      // This is a category that is also a single product
      { name: 'Gauri Shanker Rudraksha',
        path: '/products/gauri-shanker-rudraksha', // Links directly to a PRODUCT page
        isSingleProduct: true 
      },
      { 
        name: 'Ganesh Rudraksha',
        path: '/products/ganesh-rudraksha', // Links directly to a PRODUCT page
        isSingleProduct: true 
      },
    ],
  },
  {
    name: 'Mala',
    path: '/products/mala', // CORRECTED PATH
    subItems: [
      { name: 'Karungali Malai', path: '/products/mala/karungali' },
      { name: 'Rudraksha Mala', path: '/products/mala/rudraksha' },
      { name: 'Crystal Mala',path: '/products/mala/crystal' },
      { name: 'Tulsi Mala',path: '/products/mala/tulsi' },
    ],
  },
  {
    name: 'Aura Stones',
    path: '/products/aura-stones', // CORRECTED PATH
    subItems: [
      { name: 'Healing Stones', path: '/products/aura-stones/healing' },
      { name: 'Chakra Stones', path: '/products/aura-stones/chakra' },
    ],
  },
  {
    name: 'Astro Stone',
    path: '/products/astro-stone', // CORRECTED PATH
    subItems: [
      { name: 'Gemstones', path: '/products/astro-stone/gemstones' },
      { name: 'Birth Stones', path: '/products/astro-stone/birthstones' },
    ],
  },
];

export default function Header({ onSearchClick, onCartClick }: HeaderProps) {
  // State that is truly local to the Header
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [openMobileSubMenu, setOpenMobileSubMenu] = useState<string | null>(null);
  
  // Hooks
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { cartCount } = useCart();

  // Effect to close mobile menu on ESC key press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

// AFTER (Corrected)
  const getLinkClass = (path: string, isNavLink: boolean = false) => {
    const isActive = isNavLink
      ? location.pathname === path
      : location.pathname.startsWith(path);
      
    return `flex items-center gap-1 relative font-medium transition-colors hover:text-primary ${
      isActive ? 'text-primary' : 'text-text-main'
    }`;
  };
  
  return (
    <header className="sticky top-0 z-50 bg-white/80 shadow-md backdrop-blur-md">
      {/* Top Announcement Bar */}
      <div className="bg-primary text-white text-sm">
        <div className="container mx-auto flex items-center justify-between py-1 px-6">
          <p className="flex-grow text-center font-semibold">
            Ganesh Chaturthi Sale: <b>21% OFF Sitewide</b> (Auto Applied)
          </p>
          <div className="hidden md:flex items-center gap-3">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook size={16} /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={16} /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><Youtube size={16} /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={16} /></a>
            <a href="mailto:support@example.com" aria-label="Email"><Mail size={16} /></a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto flex items-center justify-between py-3 px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Siddhi Divine Logo" className="h-10 w-auto" />
          <span className="text-xl font-bold text-text-main font-sans">Siddhi Divine</span>
        </Link>
        
        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-8">
          <NavLink to="/" className={({isActive}) => getLinkClass('/', isActive)}>Home</NavLink>
          {menuItems.map((item, i) => (
            <div
              key={item.name}
              className="relative"
              onMouseEnter={() => setOpenMenu(i)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <Link to={item.path} className={getLinkClass(item.path)}>
                {item.name}
                <ChevronDown size={14} className={`mt-0.5 transition-transform ${openMenu === i ? 'rotate-180' : ''}`} />
              </Link>
              <AnimatePresence>
                {openMenu === i && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute left-0 top-full bg-white shadow-lg rounded-lg p-4 z-50 ${item.name === 'Rudraksha' ? 'min-w-[320px]' : 'min-w-[240px]'}`}
                  >
                    <div className={item.name === 'Rudraksha' ? 'grid grid-cols-2 gap-3' : 'flex flex-col'}>
                      {item.subItems.map((subItem) => (
                        <div key={subItem.name} className="relative group/sub">
                          <Link to={subItem.path} className="flex items-center gap-2 px-3 py-2 rounded text-gray-700 hover:bg-orange-50 w-full">
                            {subItem.icon && <img src={subItem.icon} alt={subItem.name} className="w-6 h-6 object-contain"/>}
                            <span>{subItem.name}</span>
                            {subItem.subSubItems && <ChevronRight size={14} className="ml-auto" />}
                          </Link>
                          {subItem.subSubItems && (
                             <div className="absolute left-full top-0 ml-1 bg-white shadow-lg rounded-lg p-2 min-w-[180px] opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-opacity">
                               {subItem.subSubItems.map((deepItem) => (
                                 <Link key={deepItem.name} to={deepItem.path} className="block px-4 py-2 text-gray-700 hover:bg-orange-50 rounded">
                                   {deepItem.name}
                                 </Link>
                               ))}
                             </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Utility Icons */}
        <div className="flex items-center gap-5 text-xl text-text-main">
          <button onClick={onSearchClick} className="hover:text-primary transition-colors" aria-label="Search">
            <Search size={22} />
          </button>
          <Link to={isAuthenticated ? '/account' : '/login'} className="hover:text-primary transition-colors" aria-label="Account">
            <User size={22} />
          </Link>
          <button onClick={onCartClick} className="relative hover:text-primary transition-colors" aria-label="Shopping Cart">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-dark text-xs text-text-light">{cartCount}</span>
            )}
          </button>
          <button className="lg:hidden" onClick={() => setIsMobileMenuOpen(true)} aria-label="Open menu">
            <Menu size={24} />
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[99] lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute top-0 right-0 h-full w-4/5 max-w-sm bg-white"
              onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="font-bold text-lg">Menu</h2>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2"><X size={24}/></button>
                </div>
                <nav className="p-4">
                    <NavLink to="/" className={({isActive}) => `block py-2 px-3 rounded-md ${isActive ? 'bg-background font-bold' : ''}`}>Home</NavLink>
                    {menuItems.map(item => (
                        <div key={item.name} className="border-b">
                            <div
                                onClick={() => setOpenMobileSubMenu(openMobileSubMenu === item.name ? null : item.name)}
                                className="flex items-center justify-between py-2 px-3"
                            >
                                <Link to={item.path} className="-ml-3 p-3 flex-grow">{item.name}</Link>
                                {item.subItems.length > 0 && <ChevronDown size={20} className={`transition-transform ${openMobileSubMenu === item.name ? 'rotate-180' : ''}`} />}
                            </div>
                            {openMobileSubMenu === item.name && item.subItems.length > 0 && (
                                <div className="pl-6 pb-2">
                                    {item.subItems.map(subItem => (
                                        <NavLink key={subItem.name} to={subItem.path} className={({isActive}) => `block py-2 px-3 rounded-md text-sm ${isActive ? 'bg-background font-bold' : ''}`}>
                                            {subItem.name}
                                        </NavLink>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}