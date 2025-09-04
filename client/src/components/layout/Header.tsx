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
import logo from '@/assets/New Logoo.png';
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
  path: `/rudraksha/${i + 1}-mukhi`,
  icon: `/path/to/your/icons/${i + 1}-mukhi.png`, // Placeholder path
}));

const menuItems: MenuItem[] = [
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
      { name: '3 Mukhi Rudraksha', 
        path: '/products/3-mukhi-rudraksha',
        isSingleProduct: true 
      },
      { 
        name: 'Ganesh Rudraksha',
        path: '/product/ganesh-rudraksha', // Links directly to a PRODUCT page
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
      {
        name: 'Crystal Mala',
        path: '/products/mala/crystal',
        subSubItems: [
          { name: 'Amethyst', path: '/products/mala/crystal/amethyst' },
          { name: 'Rose Quartz', path: '/products/mala/crystal/rose-quartz' },
        ],
      },
      {
        name: 'Tulsi Mala',
        path: '/products/mala/tulsi',
        subSubItems: [
          { name: 'Small Beads', path: '/products/mala/tulsi/small' },
          { name: 'Big Beads', path: '/products/mala/tulsi/big' },
        ],
      },
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

  const menuLinkClasses = (path: string) => 
    `flex items-center gap-1 relative font-medium transition-colors hover:text-primary ${
      location.pathname.startsWith(path) ? 'text-primary-dark' : 'text-gray-600'
    }`;
  
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
          <img src={logo} alt="Siddhi Aura Stones Logo" className="h-10 w-auto" />
          <span className="text-xl font-bold text-primary-dark font-serif">Siddhi Aura Stones</span>
        </Link>
        
        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-8">
          <NavLink to="/" className={({isActive}) => menuLinkClasses(isActive ? '/' : '')}>Home</NavLink>
          {menuItems.map((item, i) => (
            <div
              key={item.name}
              className="relative"
              onMouseEnter={() => setOpenMenu(i)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <Link to={item.path} className={menuLinkClasses(item.path)}>
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
        <div className="flex items-center gap-5 text-xl text-gray-700">
          <button onClick={onSearchClick} className="hover:text-primary transition-colors" aria-label="Search">
            <Search size={22} />
          </button>
          <Link to={isAuthenticated ? '/account' : '/login'} className="hover:text-primary transition-colors" aria-label="Account">
            <User size={22} />
          </Link>
          <button onClick={onCartClick} className="relative hover:text-primary transition-colors" aria-label="Shopping Cart">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-dark text-xs text-white">{cartCount}</span>
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
               transition={{ type: 'spring', stiffness: 300, damping: 30 }}
               className="absolute top-0 right-0 h-full w-4/5 max-w-sm bg-white p-6"
               onClick={(e) => e.stopPropagation()}
             >
                <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-4 right-4 p-2">
                  <X size={24}/>
                </button>
                <h2 className="font-bold text-lg mb-4">Menu</h2>
                <p className="text-sm text-gray-500">Mobile menu to be implemented.</p>
             </motion.div>
           </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}