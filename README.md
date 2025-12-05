<div align="center">

# 🌍 Geo-Narrator AI

### *Explore Any Place on Earth with AI-Powered Insights*

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Geo--Narrator-success?style=for-the-badge)](https://geo-narrator-ai.onrender.com/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Render](https://img.shields.io/badge/Deployed_on-Render-46E3B7?style=flat-square&logo=render&logoColor=white)](https://render.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square)](http://makeapullrequest.com)

<p align="center">
  <strong>An interactive geography learning platform built for students, travelers, and UPSC aspirants.</strong>
  <br/>
  <em>Click anywhere on Earth. Get AI-powered historical, cultural & geographical insights instantly.</em>
</p>

[**🌐 Live Demo**](https://geo-narrator-ai.onrender.com/) • [**📖 Documentation**](#-quick-start) • [**🐛 Report Bug**](https://github.com/Ambuj123-lab/geo-narrator-ai/issues)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🗺️ **Interactive Map** | Click anywhere to get instant geographical, historical & cultural insights |
| 🔍 **Smart Search** | Search any place by name - Taj Mahal, Eiffel Tower, Red Fort, etc. |
| 📸 **Photo Analysis** | Upload monument photos for AI-powered architectural analysis |
| 🌐 **Hindi/English Toggle** | Switch output language without extra API tokens |
| 🛰️ **Multiple Map Layers** | Dark Mode, Satellite View & Terrain maps |
| 📱 **Mobile Responsive** | Optimized for all devices |
| 🌍 **Realistic Earth Globe** | NASA Blue Marble texture with orbiting satellites |
| ⭐ **Space Background** | 150 twinkling stars with nebula effects |

---

## 🎬 Demo

<div align="center">

### 🚀 [Try Live Demo →](https://geo-narrator-ai.onrender.com/)

</div>

**How it works:**
1. 🔍 **Search** any place (e.g., "Taj Mahal, Agra")
2. 📍 **Map flies** to the location  
3. 🤖 **AI generates** comprehensive insights
4. 📖 **Read about** history, culture, architecture, cuisine & more!

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center" width="100">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="48" height="48" alt="React" />
<br>React 18
</td>
<td align="center" width="100">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="48" height="48" alt="TypeScript" />
<br>TypeScript
</td>
<td align="center" width="100">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" width="48" height="48" alt="Tailwind" />
<br>Tailwind CSS
</td>
<td align="center" width="100">
<img src="https://vitejs.dev/logo.svg" width="48" height="48" alt="Vite" />
<br>Vite
</td>
<td align="center" width="100">
<img src="https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg" width="48" height="48" alt="Gemini" />
<br>Gemini AI
</td>
</tr>
</table>

| Component | Technology |
|-----------|------------|
| **Frontend** | React 18, TypeScript, Tailwind CSS |
| **Map Library** | React-Leaflet, OpenStreetMap |
| **AI Engine** | Google Gemini 2.5 Flash API |
| **Geocoding** | Nominatim API (FREE) |
| **Animations** | Framer Motion |
| **Build Tool** | Vite |
| **Deployment** | Render (Static Site) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Gemini API key ([Get one FREE here](https://aistudio.google.com/app/apikey))

### Installation

```bash
# Clone the repository
git clone https://github.com/Ambuj123-lab/geo-narrator-ai.git
cd geo-narrator-ai

# Install dependencies
npm install

# Set up environment variables
# Create a .env file in root directory:
echo "VITE_GEMINI_API_KEY=your_api_key_here" > .env
echo "VITE_APP_PASSWORD=your_password_here" >> .env

# Run development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser 🎉

---

## 🌐 Deployment

### Deploy to Render (FREE)

1. Push code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Create new **Static Site**
4. Connect your GitHub repo
5. Configure:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
6. Add environment variables:
   - `VITE_GEMINI_API_KEY`
   - `VITE_APP_PASSWORD`
7. Deploy! 🚀

---

## 🎯 Usage Guide

| Action | How To |
|--------|--------|
| 🔍 **Search Place** | Type place name in search bar, click "Go" |
| 📍 **Click Map** | Click anywhere on the map |
| 📸 **Upload Photo** | Click "Attach Photo" and select an image |
| 🌐 **Change Language** | Toggle EN/HI button in sidebar |
| 🗺️ **Switch Map Layer** | Use layer control (top-right of map) |

---

## 📊 Cost & Token Usage

| Feature | API Cost | Tokens Used |
|---------|----------|-------------|
| Map Click | FREE* | ~3,000 |
| Image Upload | FREE* | ~4,000 |
| Search | FREE | 0 (Nominatim) |
| Language Toggle | FREE | 0 (Same API call) |

*Free tier: 1,500 requests/day with Gemini API

---

## 🔐 Security

- ✅ API keys stored in environment variables
- ✅ Password protection for app access
- ✅ `.env` file excluded from Git
- ✅ Client-side only (no server data storage)

---

## 📁 Project Structure

```
geo-narrator-ai/
├── src/
│   ├── App.tsx          # Main application
│   └── index.css        # Global styles
├── public/              # Static assets
├── .env                 # Environment variables (not in git)
├── package.json         # Dependencies
├── vite.config.ts       # Vite configuration
└── README.md            # This file
```

---

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) - Powerful content generation
- [OpenStreetMap](https://www.openstreetmap.org/) - Map tiles
- [Nominatim](https://nominatim.org/) - Free geocoding API
- [React-Leaflet](https://react-leaflet.js.org/) - Map components
- [Lucide Icons](https://lucide.dev/) - Beautiful icons

---

## 👨‍💻 Author

<div align="center">

**Ambuj Kumar Tripathi**

*AI Enthusiast & Product Mindset*

[![GitHub](https://img.shields.io/badge/GitHub-Ambuj123--lab-181717?style=for-the-badge&logo=github)](https://github.com/Ambuj123-lab)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/ambuj-kumar-tripathi)

</div>

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

### ⭐ Star this repo if you found it helpful!

Made with ❤️ by Ambuj Kumar Tripathi

</div>
