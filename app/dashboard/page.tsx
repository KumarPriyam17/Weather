'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Search, Bell, Map, Cloud } from 'lucide-react';
import { fetchWeather, fetchWeatherByCoords, WeatherData } from '@/lib/weather';
import { logout, getCurrentUser } from '@/lib/auth-client';
import HeroWeather from '../components/HeroWeather';
import WeatherSidebar from '../components/WeatherSidebar';
import ForecastStrip from '../components/ForecastStrip';
import WeatherAnimation from '../components/WeatherAnimation';
import FavoritesList from '../components/FavoritesList';

export default function Dashboard() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshFavorites, setRefreshFavorites] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const user = await getCurrentUser();
            if (!user) router.push('/');
        };
        checkAuth();

        // Try to get current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    setLoading(true);
                    try {
                        const { latitude, longitude } = position.coords;
                        const data = await fetchWeatherByCoords(latitude, longitude);
                        setWeather(data);
                        setLoading(false);
                    } catch (e) {
                        handleSearch('New York');
                    }
                },
                (error) => {
                    console.log('Geolocation denied or error:', error);
                    handleSearch('New York');
                }
            );
        } else {
            handleSearch('New York');
        }
    }, [router]);

    const handleSearch = async (city: string) => {
        setLoading(true);
        setError('');
        try {
            const data = await fetchWeather(city);
            setWeather(data);
        } catch (err) {
            setError('City not found');
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = async () => {
        if (!weather) return;
        try {
            await fetch('/api/weather/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    city_name: weather.location.split(',')[0],
                    latitude: weather.lat,
                    longitude: weather.lon
                }),
            });
            setRefreshFavorites(prev => prev + 1);
        } catch (error) {
            console.error('Error adding favorite:', error);
        }
    };

    return (
      <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e40af] to-[#38bdf8] text-white font-sans selection:bg-white/20">
        {/* Dynamic Background Layer */}
        <div className="absolute inset-0 z-0">
          {weather && (
            <WeatherAnimation
              condition={weather.condition}
              isDay={weather.isDay}
            />
          )}
          <div className="absolute inset-0 bg-black/30 pointer-events-none" />
        </div>

        <div className="relative z-10 container mx-auto p-6 h-screen flex flex-col gap-6">
          {/* Header */}
          <header className="flex justify-between items-center py-2">
            <div className="flex items-center gap-2 text-white/80">
              <Cloud className="w-6 h-6" />
              <span className="font-medium tracking-wide">forecast.now</span>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8 relative group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSearch(searchQuery)
                }
                placeholder="Search city..."
                className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm focus:bg-white/10 focus:border-white/20 transition-all outline-none placeholder-white/30"
              />
              <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white">
                <Map className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white">
                <Bell className="w-5 h-5" />
              </button>
              <div className="h-8 w-[1px] bg-white/10 mx-2" />
              <button
                onClick={() => logout()}
                className="flex items-center gap-2 hover:bg-white/10 px-3 py-1.5 rounded-full transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-medium">User</p>
                  <p className="text-[10px] text-white/40">Admin</p>
                </div>
              </button>
            </div>
          </header>

          {/* Main Grid Layout */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
            {/* Left Column: Hero Weather */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="flex-1 relative">
                {loading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
                  </div>
                ) : weather ? (
                  <HeroWeather data={weather} />
                ) : (
                  <div className="flex items-center justify-center h-full text-white/40">
                    Search for a city
                  </div>
                )}
              </div>

              {/* Bottom Forecast Strip */}
              <div className="h-48 glass-panel rounded-3xl p-4">
                <ForecastStrip lat={weather?.lat} lon={weather?.lon} />
              </div>
            </div>

            {/* Right Column: Sidebar Details */}
            <div className="lg:col-span-1 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
              {weather && <WeatherSidebar data={weather} />}

              {/* Favorites Section */}
              <div className="mt-6 glass-card rounded-3xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-white/80">Favorites</h3>
                  <button
                    onClick={toggleFavorite}
                    className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors"
                  >
                    + Add Current
                  </button>
                </div>
                <FavoritesList
                  onSelect={handleSearch}
                  refreshTrigger={refreshFavorites}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
}
