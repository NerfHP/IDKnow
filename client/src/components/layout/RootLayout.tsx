import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import CartDrawer from '../shared/CartDrawer'; // Import the CartDrawer
import { ReactLenis } from 'lenis/react'; // Import Lenis
import LiquidEther from '../shared/LiquidEther';

export default function RootLayout() {
  // State for both modals is now managed here
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const liquidColors = ['#f0a500', '#1a2a4a', '#f5f5f5'];

  return (
    <ReactLenis root options={{ lerp: 0.08 }}>
      <LiquidEther 
        colors={liquidColors} 
        className="fixed inset-0 w-full h-full -z-10" 
      />
      <div className="flex min-h-screen flex-col bg-transparent">
        <Header
          onSearchClick={() => setIsSearchOpen(true)}
          onCartClick={() => setIsCartOpen(true)} // Pass the cart click handler
        />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />

        {/* Search Modal */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-60 flex items-start justify-center z-[99]"
              onClick={() => setIsSearchOpen(false)}
            >
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl w-full max-w-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                  <input 
                    type="text" 
                    placeholder="Search for spiritual products..." 
                    className="flex-1 px-4 py-3 focus:outline-none"
                    autoFocus
                  />
                  <button className="px-4 text-gray-600 bg-gray-50 hover:bg-gray-100">
                    <Search />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cart Drawer is now also rendered here */}
        <AnimatePresence>
          {isCartOpen && (
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          )}
        </AnimatePresence>
      </div>
    </ReactLenis>
  );
}