import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, ZoomControl, LayersControl, LayerGroup } from 'react-leaflet';
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
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// --- Types ---
interface AIResponse {
  title: string;
  location: string;
  description: string;
  history: string;
  architecture: string;
  vibe: string;
  food: string;
  funFact: string;
  rating: number;
  isLocation: boolean;
  fallbackMessage?: string;
  importantTimeline?: Array<{ year: string, event: string }>;
  geographicalContext?: {
    state: string;
    mainRiver: string;
    climate: string;
    elevation: string;
  };
  culturalPractices?: {
    regionalFestivals: string[];
    traditionalArts: {
      dance: string;
      music: string;
      craft: string;
    };
    regionalCuisine: string[];
    localHandicrafts: string[];
  };
  trivia?: string[];
  nearbyPlaces?: string[];
}

// Initialize API Key
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const APP_PASSWORD = import.meta.env.VITE_APP_PASSWORD || "AmbujAI";


// --- Components ---

// 1. Login Component
const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));

    if (pass === APP_PASSWORD) {
      onLogin();
    } else {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/80 backdrop-blur-xl border border-slate-700 p-10 rounded-2xl w-full max-w-md text-center relative z-10 shadow-2xl"
      >
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
          <Landmark className="text-slate-900 w-10 h-10" />
        </div>

        <h1 className="text-4xl font-bold text-white mb-2">
          Geo-Narrator <span className="text-amber-400">AI</span>
        </h1>
        <p className="text-amber-300/80 mb-8 text-sm font-medium">
          Curated by Ambuj Kumar Tripathi
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="password"
            placeholder="Enter Access Code"
            className="w-full px-6 py-4 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50 transition-all text-center tracking-widest"
            value={pass}
            onChange={(e) => {
              setPass(e.target.value);
              setError(false);
            }}
          />

          {error && (
            <p className="text-red-400 text-sm">
              ⚠️ Invalid Access Code
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-bold rounded-xl transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : "UNLOCK SYSTEM"}
          </button>
        </form>

        <p className="mt-8 text-xs text-slate-500 uppercase tracking-wider">
          Secure Environment • v2.0
        </p>
      </motion.div>
    </div>
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
            <RichText content={data.history} className="text-sm" />

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
            <RichText content={data.architecture} className="text-sm" />
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
      const systemPrompt = `
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
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">System Active</span>
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
      <div className="flex-1 h-1/2 md:h-full min-w-0 relative z-0">
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