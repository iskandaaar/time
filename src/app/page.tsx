"use client";

import { useState, useEffect } from "react";
import { DateTime } from "luxon";
import { cities } from "@/cities";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

// Define the structure of a city object
interface City {
  city: string;
  country: string;
  timezone: string;
}

// The main component for the World Clock page
export default function Home() {
  const [time, setTime] = useState(DateTime.now());
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCity, setExpandedCity] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(DateTime.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const klTime = time.setZone("Asia/Kuala_Lumpur");

  const filteredCities = cities.filter(
    (city) =>
      city.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCity = (timezone: string) => {
    if (expandedCity === timezone) {
      setExpandedCity(null);
    } else {
      setExpandedCity(timezone);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4 sm:p-6 md:p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">World Clock</h1>
          <ThemeSwitcher />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold">Kuala Lumpur, Malaysia</h2>
                <p className="text-6xl font-mono font-bold mt-4">{klTime.toFormat("HH:mm:ss")}</p>
                <p className="text-lg text-muted-foreground mt-2">{klTime.toFormat("cccc, dd LLLL yyyy")}</p>
              </div>
              <div className="mt-8">
                <div className="relative">
                  <FiSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search for a city or country..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-card border border-transparent focus:ring-2 focus:ring-primary focus:border-transparent rounded-lg py-3 pl-12 pr-4"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="space-y-4">
              {filteredCities.map((city: City) => {
                const localTime = time.setZone(city.timezone);
                const offset = Math.round(localTime.offset / 60 - klTime.offset / 60);
                const isExpanded = expandedCity === city.timezone;

                return (
                  <div key={city.timezone} className="bg-card rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                    <button
                      onClick={() => toggleCity(city.timezone)}
                      className="w-full flex justify-between items-center p-4"
                    >
                      <div>
                        <h2 className="text-lg font-bold">{city.city}</h2>
                        <p className="text-sm text-muted-foreground">{city.country}</p>
                      </div>
                      <div className="flex items-center">
                        <p className="text-2xl font-mono font-bold mr-4">{localTime.toFormat("HH:mm")}</p>
                        <FiChevronDown
                          className={`transform transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </div>
                    </button>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center">
                              <p className="text-sm text-muted-foreground">{localTime.toFormat("cccc, dd LLLL yyyy")}</p>
                              <p className="text-xs font-medium text-muted-foreground">
                                {offset === 0 ? "KUL" : `KUL ${offset > 0 ? "+" : ""}${offset}h`}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <footer className="text-center mt-8 py-4 text-sm text-muted-foreground">
        <p>
          Built with Next.js, TailwindCSS, and Luxon. Deployed on Vercel.
        </p>
        <p>
          <a 
            href="https://github.com/iskandaaar/time"
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:underline"
          >
            View on GitHub
          </a>
        </p>
      </footer>
    </main>
  );
}