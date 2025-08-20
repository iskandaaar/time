
"use client";

import { useState, useEffect } from "react";
import { DateTime } from "luxon";
import { cities } from "@/cities";
import { FiSearch } from "react-icons/fi";
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
  const [openCity, setOpenCity] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(DateTime.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const klTime = time.setZone("Asia/Kuala_Lumpur");

  const filteredCities = cities
    .filter((city) => city.timezone !== "Asia/Kuala_Lumpur")
    .filter(
      (city) =>
        city.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.country.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const toggleCity = (timezone: string) => {
    setOpenCity(openCity === timezone ? null : timezone);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-2xl">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">World Clock</h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48 bg-card border border-border focus:ring-2 focus:ring-primary focus:border-transparent rounded-lg py-2 pl-9 pr-3"
              />
            </div>
            <ThemeSwitcher />
          </div>
        </header>

        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Kuala Lumpur</h2>
              <p className="text-sm text-muted-foreground">Malaysia</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-mono font-bold">{klTime.toFormat("HH:mm")}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {filteredCities.map((city: City) => {
            const localTime = time.setZone(city.timezone);
            const gmtOffset = `GMT${localTime.toFormat("Z")}`;

            return (
              <div key={city.timezone} className="bg-card border border-border rounded-lg">
                <button
                  onClick={() => toggleCity(city.timezone)}
                  className="w-full flex justify-between items-center p-4 text-left"
                >
                  <div>
                    <h2 className="font-bold">{city.city}</h2>
                    <p className="text-xs text-muted-foreground">{city.country}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-mono font-bold">{localTime.toFormat("HH:mm")}</p>
                  </div>
                </button>
                {openCity === city.timezone && (
                  <div className="p-4 border-t border-border">
                    <div className="flex justify-between items-center">
                      <p className="text-sm">Timezone</p>
                      <p className="text-sm font-mono">{gmtOffset}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
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
