# 🗺️ Geo-Narrator AI

An interactive geography learning platform powered by Google's Gemini AI. Built for students, travelers, and UPSC aspirants.

![Geo-Narrator AI](https://img.shields.io/badge/React-18.3-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- 🗺️ **Interactive Map**: Click anywhere to get instant geographical, historical & cultural insights
- 📸 **Photo Analysis**: Upload monument photos for AI-powered architectural analysis  
- 🛰️ **Multiple Map Layers**: Switch between Dark Mode, Satellite View & Terrain
- 📱 **Mobile Responsive**: Optimized for all devices
- ℹ️ **Helper Tooltips**: Context-sensitive guidance for users
- 🎨 **Beautiful UI**: Glassmorphism design with smooth animations

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Map Library**: React-Leaflet, OpenStreetMap
- **AI**: Google Gemini 2.5 Flash API
- **Animations**: Framer Motion
- **Build Tool**: Vite

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/geo-narrator-ai.git
cd geo-narrator-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_api_key_here
VITE_APP_PASSWORD=your_password_here
```

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🌐 Deployment

### Deploy to Render

1. Push code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Create new "Static Site"
4. Connect your GitHub repo
5. Set build command: `npm run build`
6. Set publish directory: `dist`
7. Add environment variables in Render dashboard

## 🎯 Usage

1. **Login** with your password
2. **Click on the map** to analyze any location
3. **Upload a photo** of a monument for detailed analysis
4. **Switch map layers** to see satellite or terrain views
5. **Hover over info icons** for helpful tips

## 📊 Token Usage

- **Map Click**: ~3,365 tokens (Temperature: 0.7)
- **Image Upload**: ~3,845 tokens (Temperature: 0.7)

## 🔐 Security

- API keys stored in environment variables
- Password protection for application access
- `.env` file excluded from Git

## 📝 License

MIT License - feel free to use this project for learning!

## 👨‍💻 Author

**Ambuj Kumar Tripathi**  
Building cool projects to learn and grow 🚀

## 🙏 Acknowledgments

- Google Gemini AI for powerful content generation
- OpenStreetMap for map tiles
- React-Leaflet community

---

**⭐ Star this repo if you found it helpful!**
