import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
interface HeaderProps {
  onSearchClick: () => void;
  onCartClick: () => void;
}

// --- Menu Data ---
const menuItems: MenuItem[] = [
  {
    name: 'Bracelets',
    path: '/products/bracelets',
    subItems: [
      { name: 'Rudraksha Bracelets', path: '/products/rudraksha-bracelets' },
      { name: 'Crystal Bracelets', path: '/products/crystal-bracelets' },
    ],
  },
  {
    name: 'Rudraksha',
    path: '/products/rudraksha',
    subItems: [
      { name: '3 Mukhi Rudraksha', path: '/products/3-mukhi-rudraksha' },
      { 
        name: 'Ganesh Rudraksha',
        path: '/product/ganesh-rudraksha',
        isSingleProduct: true 
      },
    ],
  },
  {
    name: 'Mala',
    path: '/products/mala',
    subItems: [
      { name: 'Crystal Mala', path: '/products/crystal-mala',
        subSubItems: [
          { name: 'Amethyst Mala', path: '/products/amethyst-mala' },
          { name: 'Rose Quartz Mala', path: '/products/rose-quartz-mala' },
        ],
      },
    ],
  },
  { name: 'Aura Stones', path: '/products/aura-stones', subItems: [] },
  { name: 'Astro Stone', path: '/products/astro-stone', subItems: [] },
];

export default function Header({ onSearchClick, onCartClick }: HeaderProps) {
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [openMobileSubMenu, setOpenMobileSubMenu] = useState<string | null>(null);

  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { cartCount } = useCart();

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const getLinkClass = (path: string, isNavLink: boolean = false) => {
    const isActive = isNavLink
      ? location.pathname === path
      : location.pathname.startsWith(path);
      
    return `flex items-center gap-1 relative font-medium transition-colors hover:text-primary ${
      isActive ? 'text-primary' : 'text-text-main'
    }`;
  };
  
  return (
    <header className="sticky top-0 z-50 bg-white/90 shadow-sm backdrop-blur-md">
      {/* Top Announcement Bar */}
      <div className="bg-primary text-white">
        <div className="container mx-auto flex items-center justify-between py-2 px-6 text-sm">
          <p className="flex-grow text-center font-semibold">
            Ganesh Chaturthi Sale: <b>21% OFF Sitewide</b> (Auto Applied)
          </p>
          <div className="hidden md:flex items-center gap-3">
            <a href="#" aria-label="Facebook" className="hover:opacity-80"><Facebook size={16} /></a>
            <a href="#" aria-label="Instagram" className="hover:opacity-80"><Instagram size={16} /></a>
            <a href="#" aria-label="YouTube" className="hover:opacity-80"><Youtube size={16} /></a>
            <a href="#" aria-label="LinkedIn" className="hover:opacity-80"><Linkedin size={16} /></a>
            <a href="#" aria-label="Email" className="hover:opacity-80"><Mail size={16} /></a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link to="/" className="flex-shrink-0">
          <img src={logo} alt="Siddhi Divine Logo" className="h-12 w-auto" />
        </Link>
        
        {/* Desktop Menu & Icons */}
        <div className="hidden lg:flex items-center gap-8">
          <nav className="flex items-center gap-8">
            <NavLink to="/" className={({isActive}) => getLinkClass('/', isActive)}>Home</NavLink>
            {menuItems.map((item, i) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => setOpenMenu(i)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <Link to={item.path} className={getLinkClass(item.path)}>
                  <span>{item.name}</span>
                  <ChevronDown size={16} className={`transition-transform ${openMenu === i ? 'rotate-180' : ''}`} />
                </Link>
                <AnimatePresence>
                  {openMenu === i && item.subItems.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 top-full mt-2 w-56 bg-white shadow-lg rounded-md p-2 z-50 border"
                    >
                      {item.subItems.map((subItem) => (
                        <Link key={subItem.name} to={subItem.path} className="block px-4 py-2 text-text-main hover:bg-background rounded-md">
                          {subItem.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-5 text-text-main">
            <button onClick={onSearchClick} className="hover:text-primary"><Search size={22} /></button>
            <Link to={isAuthenticated ? '/account' : '/login'} className="hover:text-primary"><User size={22} /></Link>
            <button onClick={onCartClick} className="relative hover:text-primary">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-dark text-xs text-white">{cartCount}</span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="lg:hidden">
            <button onClick={() => setIsMobileMenuOpen(true)} aria-label="Open menu"><Menu size={24} /></button>
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