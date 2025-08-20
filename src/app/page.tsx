
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

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-7xl">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">World Clock</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <FiSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-card border border-transparent focus:ring-2 focus:ring-primary focus:border-transparent rounded-lg py-2 pl-10 pr-4"
              />
            </div>
            <ThemeSwitcher />
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {filteredCities.map((city: City) => {
            const localTime = time.setZone(city.timezone);
            const offset = Math.round(localTime.offset / 60 - klTime.offset / 60);
            const isKl = city.timezone === "Asia/Kuala_Lumpur";

            return (
              <div
                key={city.timezone}
                className={`p-4 rounded-lg shadow-md transition-colors duration-300 border
                  ${isKl ? "bg-primary/10 border-primary" : "bg-card border-transparent"}
                `}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold">{city.city}</h2>
                    <p className="text-sm text-muted-foreground">{city.country}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-mono font-bold">{localTime.toFormat("HH:mm")}</p>
                  </div>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">{localTime.toFormat("ccc, dd LLL")}</p>
                  <p className="text-xs font-medium text-muted-foreground">
                    {offset === 0 ? "KUL" : `KUL ${offset > 0 ? "+" : ""}${offset}h`}
                  </p>
                </div>
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
