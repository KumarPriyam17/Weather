'use client';

import { WeatherData } from '@/lib/weather';
import { MapPin, Cloud, Sun, Droplets, Snowflake } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroWeatherProps {
    data: WeatherData;
}

export default function HeroWeather({ data }: HeroWeatherProps) {
    const getWeatherIcon = (condition: string) => {
        switch (condition) {
            case 'Rain': return <Droplets className="w-24 h-24 text-blue-300 drop-shadow-lg" />;
            case 'Snow': return <Snowflake className="w-24 h-24 text-white drop-shadow-lg" />;
            case 'Clouds': return <Cloud className="w-24 h-24 text-gray-300 drop-shadow-lg" />;
            case 'Clear': return <Sun className="w-24 h-24 text-yellow-300 drop-shadow-lg" />;
            default: return <Sun className="w-24 h-24 text-yellow-300 drop-shadow-lg" />;
        }
    };

    return (
        
        <div className="flex flex-col justify-center h-full p-8 text-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex items-center gap-2 text-white/60 mb-4">
                    <MapPin className="w-5 h-5" />
                    <span className="text-xl font-medium tracking-wide">{data.location}</span>
                </div>

                <div className="flex items-center gap-8 mb-6">
                    <h1 className="text-[7rem] font-bold leading-none tracking-tight text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">{data.temperature}°</h1>
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="filter drop-shadow-2xl"
                    >
                        {getWeatherIcon(data.condition)}
                    </motion.div>
                </div>

                <div className="space-y-1">
                    <h2 className="text-4xl font-light tracking-tight">{data.condition}</h2>
                    <p className="text-white/40 text-lg">Feels like {data.feelsLike}°</p>
                </div>
            </motion.div>
        </div>
    );
}
