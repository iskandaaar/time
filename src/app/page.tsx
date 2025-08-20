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

  const filteredCities = cities
    .filter((city) => city.timezone !== "Asia/Kuala_Lumpur")
    .filter(
      (city) =>
        city.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.country.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <main className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-card border-2 border-border rounded-lg shadow-xl overflow-hidden">
        <header className="flex flex-col sm:flex-row justify-between items-center p-6 border-b border-border">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">World Time Buddy</h1>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-grow">
              <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for a city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background border border-border focus:ring-2 focus:ring-primary focus:border-transparent rounded-lg py-2 pl-9 pr-3"
              />
            </div>
            <ThemeSwitcher />
          </div>
        </header>

        <div className="p-6 border-b border-border">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Kuala Lumpur, Malaysia</h2>
              <p className="text-sm text-muted-foreground">{klTime.toFormat("cccc, LLLL d")}</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-mono font-bold">{klTime.toFormat("HH:mm:ss")}</p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-border">
          {filteredCities.map((city: City) => {
            const localTime = time.setZone(city.timezone);
            const gmtOffset = `GMT${localTime.toFormat("Z")}`;

            return (
              <div key={city.timezone} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                <div className="flex-grow">
                  <p className="text-lg font-bold">
                    {city.city}, {city.country} - {localTime.toFormat("HH:mm")} ({gmtOffset})
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <footer className="text-center p-6 text-sm text-muted-foreground border-t border-border">
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
      </div>
    </main>
  );
}