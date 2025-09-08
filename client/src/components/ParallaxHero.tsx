import { useRef, ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import Button from "./shared/Button";
import { cn } from "@/lib/utils";

const SECTION_HEIGHT = 2000;

// Main Hero Component
export default function ParallaxHero() {
  return (
    <div
      style={{ height: `calc(${SECTION_HEIGHT}px + 100vh)` }}
      className="relative w-full bg-transparent"
    >
      <CenterContent />
      <ParallaxContent />
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-b from-transparent to-background" />
    </div>
  );
};

// Center Image and Text
const CenterContent = () => {
  const { scrollY } = useScroll();
  
  const clipPath = useMotionTemplate`polygon(${useTransform(scrollY, [0, 1500], [25, 0])}% ${useTransform(scrollY, [0, 1500], [25, 0])}%, ${useTransform(scrollY, [0, 1500], [75, 100])}% ${useTransform(scrollY, [0, 1500], [25, 0])}%, ${useTransform(scrollY, [0, 1500], [75, 100])}% ${useTransform(scrollY, [0, 1500], [75, 100])}%, ${useTransform(scrollY, [0, 1500], [25, 0])}% ${useTransform(scrollY, [0, 1500], [75, 100])}%)`;
  const backgroundSize = useTransform(scrollY, [0, SECTION_HEIGHT + 500], ["170%", "100%"]);
  const opacity = useTransform(scrollY, [SECTION_HEIGHT, SECTION_HEIGHT + 500], [1, 0]);
  const contentOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const contentY = useTransform(scrollY, [0, 300], [0, -100]);
  const contentScale = useTransform(scrollY, [0, 1500], [1, 1.2]);

  return (
    <motion.div
      className="sticky top-0 h-screen w-full"
      style={{
        clipPath,
        opacity,
      }}
    >
        {/* --- NEW: Wrapper for feathering effect --- */}
        <div className="relative w-full h-full">
            {/* These divs create the soft gradient border */}
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-secondary via-transparent to-secondary from-0% to-100%"></div>
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-secondary via-transparent to-secondary from-0% to-100%"></div>
            
            <motion.div 
                className="w-full h-full"
                style={{
                    backgroundSize,
                    backgroundImage: "url('/images/hero/main.jpg')",
                    backgroundPosition: "center",
                }}
            />
        </div>

        <motion.div 
            className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white p-4"
            style={{ opacity: contentOpacity, y: contentY, scale: contentScale }}
        >
            <h1 className="font-sans text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl max-w-4xl mx-auto">
                Embark on Your Spiritual Journey
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base md:text-lg text-gray-300 px-4">
                Discover authentic products, services, and knowledge to enrich your spiritual life and find inner peace.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                <Button to="/products" size="lg">Explore Products</Button>
                <Button to="/services" size="lg" variant="outline">Book a Service</Button>
            </div>
        </motion.div>
    </motion.div>
  );
};

// Parallax Images and Text now use a wrapper component
const ParallaxContent = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-[200px] space-y-20">
      <ParallaxItem
        imgSrc="/images/hero/1.png"
        imgAlt="Statue"
        imgClass="w-2/3 ml-auto"
        start={-200}
        end={200}
      >
        <h3 className="text-2xl font-bold text-text-light">Authenticity You Can Trust.</h3>
        <p className="text-gray-300">Every item is sourced and certified for purity.</p>
      </ParallaxItem>

      <ParallaxItem
        imgSrc="/images/hero/2.png"
        imgAlt="Temple"
        imgClass="w-2/3"
        start={200}
        end={150}
        align="right"
      >
        <h3 className="text-2xl font-bold text-text-light">Products Energized For You.</h3>
        <p className="text-gray-300">Spiritually activated to enhance their divine potential.</p>
      </ParallaxItem>

      <ParallaxItem
        imgSrc="/images/hero/3.png"
        imgAlt="Diya"
        imgClass="w-2/3 ml-auto"
        start={150}
        end={200}
      >
        <h3 className="text-2xl font-bold text-text-light">Guidance from Ancient Traditions.</h3>
        <p className="text-gray-300">Connect with timeless wisdom and practices.</p>
      </ParallaxItem>

      <ParallaxItem
        imgSrc="/images/hero/4.png"
        imgAlt="Diya"
        imgClass="w-2/3"
        start={200}
        end={250}
        align="right"
      >
        <h3 className="text-2xl font-bold text-text-light">Energized from experts.</h3>
        <p className="text-gray-300">Connect with Our Experts for Better Knowledge.</p>
      </ParallaxItem>

    </div>
  );
};

// --- NEW: A single component to group scrolling text and images ---
interface ParallaxItemProps {
    children: ReactNode;
    imgSrc: string;
    imgAlt: string;
    imgClass: string;
    start: number;
    end: number;
    align?: 'left' | 'right';
}
const ParallaxItem = ({ children, imgSrc, imgAlt, imgClass, start, end, align = 'left'}: ParallaxItemProps) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: [`start end`, `end start`],
    });
    
    const y = useTransform(scrollYProgress, [0, 1], [start, end]);
    const opacity = useTransform(scrollYProgress, [0.3, 0.5, 0.8, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0.75, 1], [1, 0.85]);

    return (
        <motion.div ref={ref} className="relative grid grid-cols-2 gap-8 items-center" style={{ y, opacity, scale }}>
            <div className={`relative ${align === 'right' ? 'col-start-2' : 'col-start-1'}`}>
                <img src={imgSrc} alt={imgAlt} className={cn("w-full rounded-lg shadow-lg", imgClass)} />
            </div>
            <div className={`relative ${align === 'right' ? 'row-start-1 col-start-1 text-right' : 'col-start-2'}`}>
                {children}
            </div>
        </motion.div>
    )
}