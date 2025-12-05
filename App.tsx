import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, ZoomControl, LayersControl, LayerGroup, useMap } from 'react-leaflet';
import {
  MapPin,
  Loader2,
  Compass,
  History,
  Sparkles,
  Landmark,
  Paperclip,
  X,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

// Fix for Leaflet default icon
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = icon;

// --- Types ---
interface AIResponse {
  title: string;
  location: string;
  description: string;
  history?: string;
  architecture?: string;
  vibe: string;
  food: string;
  funFact: string;
  rating: number;
  isLocation: boolean;
  fallbackMessage?: string;
  geographicalContext?: {
    state: string;
    mainRiver: string;
    climate: string;
    elevation: string;
  };
  culturalPractices?: {
    regionalFestivals?: string[];
    traditionalArts: {
      dance: string;
      music: string;
      craft: string;
    };
    regionalCuisine?: string[];
    localHandicrafts?: string[];
  };
  trivia?: string[];
  nearbyPlaces?: string[];
  importantTimeline?: { year: string; event: string }[];
}

// Initialize API Key
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const APP_PASSWORD = import.meta.env.VITE_APP_PASSWORD || "AmbujAI";

// Map Resizer Component - Forces Leaflet to recalculate dimensions
function MapResizer() {
  const map = useMap();

  useEffect(() => {
    // Wait for DOM to settle, then invalidate size
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => clearTimeout(timer);
  }, [map]);

  return null;
}


// --- Components ---

// 1. Login Component - ArcGIS Enterprise Style
const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const howItWorksRef = React.useRef<HTMLDivElement>(null);

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));

    if (pass === APP_PASSWORD) {
      onLogin();
    } else {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 overflow-y-auto">
      {/* Header */}
      <header className="px-8 py-4 flex items-center justify-between border-b border-slate-800 sticky top-0 bg-slate-950/95 backdrop-blur-sm z-50">
        <div className="flex items-center gap-3">
          <Compass className="w-8 h-8 text-cyan-400" />
          <span className="text-white font-bold text-xl">Geo-Narrator</span>
        </div>
        <nav className="flex items-center gap-6">
          <span className="text-cyan-400 text-sm border-b-2 border-cyan-400 pb-1 cursor-pointer">Overview</span>
          <span onClick={scrollToHowItWorks} className="text-slate-400 text-sm hover:text-white cursor-pointer transition-colors">How It Works</span>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="min-h-[calc(100vh-65px)] flex flex-col lg:flex-row">
        {/* Left Side - Branding & Overview */}
        <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 py-12">
          {/* Logo */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Compass className="w-8 h-8 text-slate-900" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Geo-Narrator <span className="text-cyan-400">AI</span>
          </h1>
          <p className="text-xl text-slate-400 mb-8">
            AI-Powered Geospatial Intelligence Platform
          </p>

          {/* Overview Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">What is Geo-Narrator AI?</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              Geo-Narrator AI is an intelligent geospatial platform that transforms any location
              into a rich narrative experience. Click anywhere on Earth and discover the
              <span className="text-amber-400 font-semibold"> history, culture, architecture, and hidden stories </span>
              of that place using advanced AI.
            </p>
            <p className="text-slate-400 leading-relaxed">
              Built by <span className="text-white font-medium">Ambuj Kumar Tripathi</span>, it integrates
              Google's Gemini AI with interactive mapping to provide comprehensive location insights
              including famous landmarks, local cuisine, climate data, and fascinating facts.
            </p>
          </div>

          {/* Login Form */}
          <div className="max-w-sm">
            <p className="text-slate-500 text-sm uppercase tracking-wider mb-3">Enter Access Code</p>
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="password"
                value={pass}
                onChange={(e) => {
                  setPass(e.target.value);
                  setError(false);
                }}
                placeholder="••••••••"
                className={`flex-1 px-4 py-3 bg-slate-900 border rounded-lg text-white tracking-widest font-medium transition-all
                  ${error ? 'border-red-500' : 'border-slate-700 focus:border-cyan-400'}
                  focus:outline-none focus:ring-2 focus:ring-cyan-500/20`}
              />
              <button
                type="submit"
                disabled={loading || !pass}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-900 font-bold rounded-lg transition-all
                  disabled:opacity-40 hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "UNLOCK"}
              </button>
            </form>
            {error && (
              <p className="text-red-400 text-sm mt-2">Invalid access code</p>
            )}
          </div>
        </div>

        {/* Right Side - Realistic Rotating Earth with NASA Texture */}
        <div className="flex-1 flex items-center justify-center relative overflow-hidden min-h-[400px] lg:min-h-0" style={{ background: 'radial-gradient(ellipse at center, #1e1b4b 0%, #0f0d24 30%, #020617 60%, #000000 100%)' }}>
          {/* Dense Stars Background - 150 stars */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(150)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: Math.random() * 3 + 1 + 'px',
                  height: Math.random() * 3 + 1 + 'px',
                  top: Math.random() * 100 + '%',
                  left: Math.random() * 100 + '%',
                  background: i % 5 === 0 ? '#fcd34d' : i % 7 === 0 ? '#93c5fd' : '#ffffff',
                  opacity: Math.random() * 0.8 + 0.2,
                  animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
                  animationDelay: Math.random() * 2 + 's',
                  boxShadow: i % 5 === 0 ? '0 0 4px #fcd34d' : 'none'
                }}
              />
            ))}
          </div>

          {/* Nebula/Galaxy Effects - More near Earth */}
          <div className="absolute inset-0">
            <div className="absolute top-[20%] right-[20%] w-80 h-80 bg-purple-600/15 rounded-full blur-3xl" />
            <div className="absolute bottom-[20%] left-[25%] w-72 h-72 bg-blue-600/12 rounded-full blur-3xl" />
            <div className="absolute top-[40%] right-[30%] w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
            <div className="absolute top-[30%] left-[40%] w-56 h-56 bg-violet-500/10 rounded-full blur-3xl" />
            {/* Close to Earth glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-3xl" />
          </div>

          {/* 3D Globe with Real Earth Texture */}
          <motion.div
            className="relative w-72 h-72 lg:w-96 lg:h-96"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Earth with Fully Lit Texture - No dark terminator */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full overflow-hidden"
              style={{
                backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Earth_Western_Hemisphere_transparent_background.png/600px-Earth_Western_Hemisphere_transparent_background.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '0 0 100px rgba(56, 189, 248, 0.5), 0 0 60px rgba(56, 189, 248, 0.3)'
              }}
            />

            {/* Bright Edge Glow to fill any dark spots */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 50% 50%, transparent 45%, rgba(56, 189, 248, 0.15) 48%, rgba(56, 189, 248, 0.3) 50%)',
              }}
            />

            {/* Atmosphere Glow Layer */}
            <div
              className="absolute inset-[-4px] rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 30% 30%, rgba(135, 206, 250, 0.25) 0%, transparent 35%)',
                boxShadow: '0 0 80px rgba(56, 189, 248, 0.5), 0 0 150px rgba(56, 189, 248, 0.3), inset 0 0 30px rgba(56, 189, 248, 0.1)'
              }}
            />

            {/* Sun Reflection Highlight */}
            <div
              className="absolute top-[15%] left-[20%] w-16 h-16 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 60%)',
              }}
            />

            {/* Outer Atmosphere Rings */}
            <div className="absolute inset-[-6px] rounded-full border border-cyan-400/20" />
            <div className="absolute inset-[-12px] rounded-full border border-cyan-400/10" />

            {/* Tilted Orbital Ring 1 - Orange/Gold Satellite */}
            <div className="absolute inset-[-50px]" style={{ transform: 'rotateX(70deg) rotateZ(-20deg)', transformStyle: 'preserve-3d' }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-orange-400/60"
                style={{ boxShadow: '0 0 20px rgba(251, 146, 60, 0.4)' }}
              >
                {/* Bright Orange/Gold Satellite - Like a shooting star */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="w-4 h-4 bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 rounded-full"
                    style={{ boxShadow: '0 0 20px #f97316, 0 0 40px #fb923c, 0 0 60px #fbbf24, 0 0 80px #f97316' }}
                  />
                </div>
              </motion.div>
            </div>

            {/* Tilted Orbital Ring 2 - Red/Pink Satellite */}
            <div className="absolute inset-[-70px]" style={{ transform: 'rotateX(80deg) rotateZ(40deg)', transformStyle: 'preserve-3d' }}>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-rose-400/40"
                style={{ boxShadow: '0 0 15px rgba(251, 113, 133, 0.3)' }}
              >
                {/* Bright Red/Pink Satellite */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="w-3 h-3 bg-gradient-to-r from-pink-400 via-rose-500 to-red-600 rounded-full"
                    style={{ boxShadow: '0 0 15px #f43f5e, 0 0 30px #fb7185, 0 0 45px #f43f5e' }}
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Copyright & Powered By */}
          <div className="absolute bottom-8 right-8 text-right">
            <p className="text-slate-500 text-sm">Powered by Google Gemini AI</p>
            <p className="text-slate-600 text-xs mt-1">© Ambuj Kumar Tripathi</p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div ref={howItWorksRef} className="min-h-screen bg-slate-900 px-8 lg:px-16 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-4 text-center">How It Works</h2>
          <p className="text-slate-400 text-center mb-16 max-w-2xl mx-auto">
            Discover the power of AI-driven geospatial intelligence in three simple steps
          </p>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mb-6 text-2xl font-bold text-white">1</div>
              <h3 className="text-xl font-bold text-white mb-3">Click Anywhere</h3>
              <p className="text-slate-400">
                Open the interactive map and click on any location in the world. From cities to remote villages, mountains to coastlines.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 text-2xl font-bold text-white">2</div>
              <h3 className="text-xl font-bold text-white mb-3">AI Analysis</h3>
              <p className="text-slate-400">
                Google Gemini AI instantly analyzes the location and generates comprehensive insights about its history, culture, and significance.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center mb-6 text-2xl font-bold text-white">3</div>
              <h3 className="text-xl font-bold text-white mb-3">Explore Stories</h3>
              <p className="text-slate-400">
                Read rich narratives about landmarks, local cuisine, weather patterns, architecture styles, and fascinating historical facts.
              </p>
            </motion.div>
          </div>

          {/* Features */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '🗺️', label: 'Interactive Map' },
              { icon: '🤖', label: 'Gemini AI' },
              { icon: '📸', label: 'Image Analysis' },
              { icon: '🌍', label: 'Global Coverage' },
            ].map((feature, i) => (
              <div key={i} className="text-center p-4">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <p className="text-white font-medium">{feature.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div >
    </div >
  );
};

// 2. How to Use Component
const HowToUseSection = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white p-4 rounded-xl font-bold transition-all shadow-lg flex items-center justify-between"
      >
        <span className="flex items-center gap-2">
          <Info size={20} />
          How to Use This App
        </span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 mt-3 space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
                <div>
                  <h4 className="text-white font-bold mb-1">Click on Map</h4>
                  <p className="text-slate-400 text-sm">Tap anywhere on the map to select a location. AI will analyze it and provide historical insights.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
                <div>
                  <h4 className="text-white font-bold mb-1">Upload Photo</h4>
                  <p className="text-slate-400 text-sm">Click "Attach Photo" to upload an image of any landmark, monument, or place. AI will identify and explain it.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-amber-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
                <div>
                  <h4 className="text-white font-bold mb-1">Get Rich Insights</h4>
                  <p className="text-slate-400 text-sm">Receive detailed information including history, architecture, local cuisine, and hidden secrets!</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// 3. Map Marker Component
const LocationMarker = ({ setPos, onLocationSelect }: any) => {
  useMapEvents({
    click(e) {
      setPos(e.latlng);
      onLocationSelect(e.latlng);
    },
  });
  return null;
};

// 3. Rich Text Renderer
const RichText = ({ content, className }: { content: string, className?: string }) => {
  const parts = content.split(/(\*\*.*?\*\*)/g);
  return (
    <p className={`text-slate-300 leading-relaxed ${className || ''}`}>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <span key={i} className="font-bold text-amber-400">
              {part.slice(2, -2)}
            </span>
          );
        }
        return part;
      })}
    </p>
  );
};

// 4. Result Card Component
const ResultCard = ({ data, loading }: { data: AIResponse | null, loading: boolean }) => {
  if (loading) {
    return (
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 p-8 rounded-2xl flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-16 h-16 text-amber-500 animate-spin mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Analyzing Location</h3>
        <p className="text-slate-400 text-sm">Consulting historical archives...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-slate-800/30 backdrop-blur border border-dashed border-slate-700 p-10 rounded-2xl flex flex-col items-center justify-center text-center min-h-[400px]">
        <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mb-6 text-slate-500">
          <Compass size={40} />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">Begin Exploration</h3>
        <p className="text-slate-400 max-w-xs">
          Select a location on the map or upload a photo to uncover hidden stories.
        </p>
      </div>
    );
  }

  if (!data.isLocation) {
    return (
      <div className="bg-red-900/20 backdrop-blur border border-red-700/50 p-6 rounded-xl">
        <h3 className="text-xl font-bold text-white mb-2">⚠️ Analysis Failed</h3>
        <p className="text-slate-300">{data.fallbackMessage || "This doesn't appear to be a recognizable location. Please try again."}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl overflow-hidden shadow-2xl"
    >
      {/* Header with Gradient */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-6 border-b border-slate-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-2">
            <span className="text-white bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1">
              <MapPin size={12} /> {data.location}
            </span>
            <div className="bg-yellow-400 px-3 py-1.5 rounded-full text-slate-900 text-xs font-black shadow-lg">
              ⭐ {data.rating}/10
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">{data.title}</h2>
          <p className="text-white/90 text-base italic font-medium">"{data.vibe}"</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">

        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-5 rounded-xl border border-blue-700/50">
          <h3 className="text-blue-300 font-bold mb-2 text-sm uppercase tracking-wide flex items-center gap-2">
            <Sparkles size={14} /> Overview
          </h3>
          <RichText content={data.description} className="text-base" />
        </div>

        {/* Geographical Context - NEW SECTION */}
        {data.geographicalContext && (
          <div className="bg-slate-900/50 p-5 rounded-xl border-l-4 border-emerald-500 shadow-lg">
            <h4 className="text-emerald-400 font-bold mb-3 flex items-center gap-2 text-lg">
              <MapPin size={20} /> Geographical Context
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400 block text-xs uppercase tracking-wider">State/Region</span>
                <span className="text-white font-medium">{data.geographicalContext.state || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs uppercase tracking-wider">Climate</span>
                <span className="text-white font-medium">{data.geographicalContext.climate || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs uppercase tracking-wider">Main River</span>
                <span className="text-white font-medium">{data.geographicalContext.mainRiver || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs uppercase tracking-wider">Elevation</span>
                <span className="text-white font-medium">{data.geographicalContext.elevation || 'N/A'}</span>
              </div>
            </div>
          </div>
        )}

        {/* History & Architecture with Colorful Headers */}
        <div className="space-y-4">
          <div className="bg-slate-900/50 p-5 rounded-xl border-l-4 border-orange-500 shadow-lg">
            <h4 className="text-orange-400 font-bold mb-3 flex items-center gap-2 text-lg">
              <History size={20} /> Historical Significance
            </h4>
            <RichText content={data.history || ""} className="text-sm" />

            {/* Timeline - NEW */}
            {data.importantTimeline && (
              <div className="mt-4 pt-4 border-t border-slate-700/50">
                <h5 className="text-orange-300 text-xs font-bold uppercase mb-2">Key Timeline</h5>
                <ul className="space-y-2">
                  {data.importantTimeline.map((item, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex gap-2">
                      <span className="font-bold text-orange-400 whitespace-nowrap">{item.year}:</span>
                      <span>{item.event}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="bg-slate-900/50 p-5 rounded-xl border-l-4 border-cyan-500 shadow-lg">
            <h4 className="text-cyan-400 font-bold mb-3 flex items-center gap-2 text-lg">
              <Landmark size={20} /> Architecture & Design
            </h4>
            <RichText content={data.architecture || ""} className="text-sm" />
          </div>
        </div>

        {/* Cultural Practices - NEW SECTION */}
        {data.culturalPractices && (
          <div className="bg-slate-900/50 p-5 rounded-xl border-l-4 border-pink-500 shadow-lg">
            <h4 className="text-pink-400 font-bold mb-3 flex items-center gap-2 text-lg">
              <Sparkles size={20} /> Cultural Tapestry
            </h4>

            <div className="space-y-4">
              {/* Festivals */}
              <div>
                <h5 className="text-pink-300 text-xs font-bold uppercase mb-1">Major Festivals</h5>
                <div className="flex flex-wrap gap-2">
                  {data.culturalPractices.regionalFestivals?.map((f, i) => (
                    <span key={i} className="bg-pink-900/30 text-pink-200 text-xs px-2 py-1 rounded border border-pink-700/30">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Cuisine */}
              <div>
                <h5 className="text-pink-300 text-xs font-bold uppercase mb-1">Regional Cuisine</h5>
                <div className="flex flex-wrap gap-2">
                  {data.culturalPractices.regionalCuisine?.map((f, i) => (
                    <span key={i} className="bg-orange-900/30 text-orange-200 text-xs px-2 py-1 rounded border border-orange-700/30">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Handicrafts */}
              <div>
                <h5 className="text-pink-300 text-xs font-bold uppercase mb-1">Arts & Crafts</h5>
                <div className="flex flex-wrap gap-2">
                  {data.culturalPractices.localHandicrafts?.map((f, i) => (
                    <span key={i} className="bg-purple-900/30 text-purple-200 text-xs px-2 py-1 rounded border border-purple-700/30">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nearby Places & Trivia - NEW SECTION */}
        <div className="grid grid-cols-1 gap-4">
          {/* Nearby Places */}
          {data.nearbyPlaces && (
            <div className="bg-slate-900/50 p-5 rounded-xl border-l-4 border-blue-500 shadow-lg">
              <h4 className="text-blue-400 font-bold mb-3 flex items-center gap-2 text-lg">
                <Compass size={20} /> Nearby Attractions
              </h4>
              <ul className="space-y-2">
                {data.nearbyPlaces.map((place, i) => (
                  <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>{place}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Trivia */}
          {data.trivia && (
            <div className="bg-slate-900/50 p-5 rounded-xl border-l-4 border-yellow-500 shadow-lg">
              <h4 className="text-yellow-400 font-bold mb-3 flex items-center gap-2 text-lg">
                <Sparkles size={20} /> Did You Know?
              </h4>
              <ul className="space-y-2">
                {data.trivia.map((fact, i) => (
                  <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">★</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-700 flex justify-between text-xs text-slate-500 uppercase tracking-wider">
          <span className="flex items-center gap-1"><Sparkles size={10} /> Gemini AI</span>
          <span>Ambuj Kumar Tripathi</span>
        </div>
      </div>
    </motion.div>
  );
};

// 5. Main App Component
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [position, setPosition] = useState<{ lat: number, lng: number } | null>(null);
  const [address, setAddress] = useState<string>("Select location...");
  const [loading, setLoading] = useState(false);
  const [aiData, setAiData] = useState<AIResponse | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'hi'>('en'); // Language toggle state
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      return res.data.display_name || "Unknown Location";
    } catch (error) {
      return "Selected Location";
    }
  };

  const generateAIContent = async (prompt: string, imageBase64?: string) => {
    setLoading(true);
    setAiData(null);

    try {
      // Language instruction based on toggle - NO EXTRA TOKENS!
      const languageInstruction = language === 'hi'
        ? '**IMPORTANT: Generate the ENTIRE response in Hindi language (Devanagari script). All text, descriptions, and facts must be in Hindi.**'
        : '**Generate the response in English language.**';

      const systemPrompt = `
        ${languageInstruction}

        **ROLE:** You are the Geo-Narrator AI, an expert resource generator specializing in geographical, cultural, and historical synthesis. Your goal is to produce a comprehensive, original, and non-plagiarized informational resource for a specific location.

        **TARGET AUDIENCE & TONE:** The final output must be easily understandable by a general audience, yet detailed enough to serve as a research and general knowledge guide for students and competitive exam (UPSC) aspirants. Maintain a professional, objective, and engaging narrative style.

        **PLAGIARISM & ORIGINALITY CONSTRAINT (CRITICAL):**
        **STRICTLY** avoid direct copying from any single source. Synthesize information from multiple perspectives and present the facts in your own unique, narrative voice. The content must be completely original to prevent any copyright or "edtech" claims.

        **MANDATORY INPUT:**
        1.  **Location Name:** ${prompt}
        2.  **Geographical Focus:** [Infer from location]
        3.  **Curated By:** Ambuj Kumar Tripathi

        **OUTPUT STRUCTURE (MANDATORY SECTIONS):**

        Please generate the report structured under the following headings. Ensure all details are relevant to the requested location:

        1.  **OVERVIEW:**
            * A brief, engaging summary of the location's current status (e.g., commercial hub, historical site, natural reserve) and its defining characteristics.
        2.  **GEOGRAPHICAL CONTEXT:**
            * State/Region
            * Main River (if any nearby)
            * Climate Type
            * Elevation (Approximate)
        3.  **HISTORICAL SIGNIFICANCE:**
            * Key historical figures, designers, or events related to its founding or development.
            * Important Timeline (3-4 crucial dates).
        4.  **ARCHITECTURE & DESIGN (If urban):**
            * Predominant architectural style (e.g., Georgian, Neoclassical).
            * Key design elements (e.g., colonnades, layout symmetry).
        5.  **CULTURAL PRACTICES:**
            * Major Festivals celebrated.
            * Regional Cuisine (2-3 famous local dishes).
            * Local Handicrafts or Art Forms.
        6.  **DID YOU KNOW?**
            * 3-4 interesting, lesser-known facts about the location (e.g., original purpose, unique features).
        7.  **NEARBY PLACES (For Tourists/Aspirants):**
            * 3-4 prominent nearby landmarks (with approximate distance/description).

        **METADATA SECTION (Always at the end):**
        * Curated by: Ambuj Kumar Tripathi
        * Generated: [CURRENT DATE]
        * **Disclaimer:** For general knowledge and research purposes. Not for commercial use.

        **RESPONSE FORMAT (STRICT JSON):**
        {
          "title": "Place Name",
          "location": "City, State, Country",
          "description": "OVERVIEW text here...",
          "history": "HISTORICAL SIGNIFICANCE text here (narrative)...",
          "architecture": "ARCHITECTURE & DESIGN text here...",
          "vibe": "1 sentence vibe",
          "food": "List of famous foods (string)",
          "funFact": "One main fun fact",
          "rating": 1-10,
          "isLocation": true,
          
          "importantTimeline": [
            {"year": "YYYY", "event": "Event description"}
          ],
          
          "geographicalContext": {
            "state": "State/Region",
            "mainRiver": "Main River",
            "climate": "Climate Type",
            "elevation": "Elevation"
          },
          
          "culturalPractices": {
            "regionalFestivals": ["Festival 1", "Festival 2"],
            "traditionalArts": {
              "dance": "Dance form",
              "music": "Music tradition",
              "craft": "Handicraft"
            },
            "regionalCuisine": ["Dish 1", "Dish 2"],
            "localHandicrafts": ["Craft 1", "Craft 2"]
          },
          
          "trivia": [
            "Did you know fact 1",
            "Fact 2",
            "Fact 3"
          ],
          
          "nearbyPlaces": [
            "Place 1 (distance) - Description",
            "Place 2 (distance) - Description"
          ]
        }
      `;

      // Using direct REST API (like Chain Reaction project) to avoid SDK issues
      const MODEL = "gemini-flash-latest";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

      const payload: any = {
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: imageBase64 ? 4000 : 3000  // Increased for Gemini 2.5's thinking mode
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
        ]
      };

      if (imageBase64) {
        // Photo upload with image
        payload.contents = [{
          parts: [
            { inline_data: { mime_type: 'image/jpeg', data: imageBase64 } },
            { text: systemPrompt }
          ]
        }];
      } else {
        // Map click - text only
        payload.contents = [{
          parts: [{ text: systemPrompt + ` Location: ${prompt}` }]
        }];
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const apiData = await response.json();

      // Debug logging
      console.log("API Response:", apiData);
      console.log("Response OK:", response.ok);

      if (!response.ok) {
        console.error("API Error Response:", apiData);

        // Better error handling for 503 (Server Overload)
        if (response.status === 503) {
          throw new Error("AI service is busy. Please wait a moment and try again.");
        }
        throw new Error(apiData.error?.message || response.statusText);
      }

      const text = apiData.candidates?.[0]?.content?.parts?.[0]?.text;
      console.log("Extracted text:", text);

      if (!text) {
        console.error("Full API Response:", JSON.stringify(apiData, null, 2));
        throw new Error("Empty response from AI. Check console for details.");
      }

      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(cleanJson);
      setAiData(data);
    } catch (error: any) {
      console.error("AI Error:", error);

      // User-friendly error messages
      if (error.message?.includes("overloaded") || error.message?.includes("busy")) {
        alert("⏳ AI service is currently busy. Please wait 30 seconds and try again.");
      } else if (error.message?.includes("API key")) {
        alert("🔑 Invalid API key. Please check your .env file.");
      } else {
        alert(`❌ Error: ${error.message || "Please try again."}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = async (latlng: { lat: number, lng: number }) => {
    setPosition(latlng);
    setPreviewImage(null);
    const addr = await fetchAddress(latlng.lat, latlng.lng);
    setAddress(addr);
    await generateAIContent(addr);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result?.toString().split(',')[1];
      if (base64) {
        setPreviewImage(reader.result as string);
        setAddress("Analyzing image...");
        setPosition(null);
        await generateAIContent("", base64);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="h-screen w-screen bg-slate-900 flex flex-col md:flex-row overflow-hidden">

      {/* Sidebar */}
      <div className="w-full md:w-[500px] bg-slate-900 border-r border-slate-800 flex flex-col h-1/2 md:h-full shadow-2xl overflow-y-auto">
        <div className="p-6 border-b border-slate-800 bg-slate-900/95 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">System Active</span>
            </div>
            {/* Language Toggle Button */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300"
              style={{
                background: language === 'hi'
                  ? 'linear-gradient(135deg, #f97316, #ea580c)'
                  : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                boxShadow: language === 'hi'
                  ? '0 0 15px rgba(249, 115, 22, 0.4)'
                  : '0 0 15px rgba(59, 130, 246, 0.4)'
              }}
            >
              {language === 'en' ? '🇺🇸 EN' : '🇮🇳 HI'}
            </button>
          </div>
          <h1 className="text-3xl font-bold text-white">
            Geo-Narrator <span className="text-amber-400">AI</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1 uppercase tracking-wide">
            By Ambuj Kumar Tripathi
          </p>
        </div>

        <div className="p-6 flex-1">
          {/* How to Use Section */}
          <HowToUseSection />

          <div className="mb-6 space-y-4">
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex items-center gap-3">
              <div className="bg-slate-700 p-2 rounded-lg text-amber-400">
                <MapPin size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 uppercase font-bold mb-0.5">Target</p>
                <p className="text-sm text-slate-200 truncate">{address}</p>
              </div>
            </div>

            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Upload Image</label>
              <div className="group relative">
                <Info size={14} className="text-slate-500 hover:text-amber-400 cursor-help transition-colors" />
                <div className="absolute bottom-full right-0 mb-2 w-48 bg-slate-800 text-xs text-slate-200 p-3 rounded-lg border border-slate-700 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  Upload a building photo for architectural analysis.
                  <div className="absolute -bottom-1 right-1 w-2 h-2 bg-slate-800 border-b border-r border-slate-700 rotate-45"></div>
                </div>
              </div>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Paperclip size={18} />
              📸 Attach Photo
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />

            <AnimatePresence>
              {previewImage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative rounded-xl overflow-hidden border border-slate-700"
                >
                  <img src={previewImage} alt="Preview" className="w-full h-40 object-cover" />
                  <button
                    onClick={() => setPreviewImage(null)}
                    className="absolute top-2 right-2 bg-black/50 hover:bg-red-500/80 text-white p-1.5 rounded-full"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <ResultCard data={aiData} loading={loading} />
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 w-full h-1/2 md:h-full relative z-0">
        <MapContainer
          center={[28.6139, 77.2090]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <ZoomControl position="bottomright" />
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="Dark Mode">
              <LayerGroup>
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
                />
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
                />
              </LayerGroup>
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Satellite (Rivers/Terrain)">
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Terrain (Topo)">
              <TileLayer
                url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
              />
            </LayersControl.BaseLayer>
          </LayersControl>
          <MapResizer />
          <LocationMarker setPos={setPosition} onLocationSelect={handleMapClick} />
          {position && <Marker position={position} />}
        </MapContainer>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur px-6 py-3 rounded-full shadow-2xl border border-slate-700 flex items-center gap-3 z-[1000]">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
          </span>
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">
            Click map to analyze
          </span>
          <div className="group relative ml-1">
            <Info size={14} className="text-slate-400 hover:text-amber-400 cursor-help transition-colors" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 bg-slate-800 text-xs text-slate-200 p-3 rounded-lg border border-slate-700 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center">
              Click on a rural area to check for river details or any location for history.
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 border-b border-r border-slate-700 rotate-45"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}