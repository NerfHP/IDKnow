import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import CartDrawer from '@/components/shared/CartDrawer';
import { ReactLenis } from 'lenis/react';
import ParticleBackground from '@/components/shared/ParticleBackground'; // Import the background

export default function RootLayout() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <ReactLenis root options={{ lerp: 0.08 }}>
      <div className="relative min-h-screen bg-transparent">
        {/* This component will render the animated background behind everything else */}
        <ParticleBackground />

        {/* Wrap main content in a relative div with z-index to ensure it's on top */}
        <div className="relative z-10 flex min-h-screen flex-col">
          <Header
            onSearchClick={() => setIsSearchOpen(true)}
            onCartClick={() => setIsCartOpen(true)}
          />
          <main className="flex-grow">
            <Outlet />
          </main>
          <Footer />
        </div>

        {/* Search Modal and Cart Drawer will render on top due to their high z-index */}
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
                className="bg-white rounded-lg shadow-xl w-full max-w-2xl mt-20"
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

        <AnimatePresence>
          {isCartOpen && (
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          )}
        </AnimatePresence>
      </div>
    </ReactLenis>
  );
}

