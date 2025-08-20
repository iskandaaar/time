"use client";

import { useState, useEffect } from "react";
import { DateTime } from "luxon";
import { cities } from "@/cities";

// Define the structure of a city object
interface City {
  city: string;
  country: string;
  timezone: string;
}

// The main component for the World Clock page
export default function Home() {
  // State to hold the current time
  const [time, setTime] = useState(DateTime.now());
  // State to manage the dark mode setting
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Effect to update the time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(DateTime.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Effect to apply the dark mode class to the body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Get the current time in Kuala Lumpur to calculate differences
  const klTime = time.setZone("Asia/Kuala_Lumpur");

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 md:p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">World Clock</h1>
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-800 text-sm font-medium"
          >
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* 
          This is the main grid for the clocks.
          You can adjust the grid columns for different screen sizes here.
          - `grid-cols-1`: 1 column on small screens
          - `sm:grid-cols-2`: 2 columns on small screens and up
          - `md:grid-cols-3`: 3 columns on medium screens and up
          - `lg:grid-cols-4`: 4 columns on large screens and up
          - `xl:grid-cols-5`: 5 columns on extra-large screens and up
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {cities.map((city: City) => {
            const localTime = time.setZone(city.timezone);
            const offset = Math.round(localTime.offset / 60 - klTime.offset / 60);
            const isKl = city.timezone === "Asia/Kuala_Lumpur";

            return (
              <div
                key={city.timezone}
                className={`p-4 rounded-lg shadow-md transition-colors duration-300
                  ${isKl ? "bg-blue-200 dark:bg-blue-800" : "bg-white dark:bg-gray-800"}
                `}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-bold">{city.city}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{city.country}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-300">
                      {offset === 0 ? "KUL" : `KUL ${offset > 0 ? "+" : ""}${offset}h`}
                    </p>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-4xl sm:text-5xl font-mono font-bold">
                    {localTime.toFormat("HH:mm")}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {localTime.toFormat("ccc, dd LLL yyyy")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <footer className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
        <p>
          Built with Next.js, TailwindCSS, and Luxon. Deployed on Vercel.
        </p>
        <p>
          <a 
            href="https://github.com/iskandaaar/nnv-web-latest-greatest" 
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