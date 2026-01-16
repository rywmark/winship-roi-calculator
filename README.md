# Winship Labs ROI Calculator

Calculate the hidden cost of busywork in your team and discover how AI can unlock millions in productivity.

**Live Demo:** [https://rywmark.github.io/winship-roi-calculator/](https://rywmark.github.io/winship-roi-calculator/)

## Features

- Interactive ROI calculator for team productivity
- AI-powered executive brief generator (powered by Google Gemini)
- Dynamic pricing tiers based on team size
- Professional Winship Labs branding
- Fully responsive design with Tailwind CSS

## Tech Stack

- **React 19** with TypeScript
- **Vite** for blazing-fast builds
- **Tailwind CSS v4** for styling
- **Lucide React** for icons
- **Google Gemini AI** for executive brief generation

## Setup

1. **Clone and install:**
   ```bash
   git clone https://github.com/rywmark/winship-roi-calculator.git
   cd winship-roi-calculator
   npm install
   ```

2. **Configure Gemini API (optional - for AI brief feature):**
   ```bash
   cp .env.example .env
   ```

   Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey) and add it to `.env`:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173)

4. **Build for production:**
   ```bash
   npm run build
   npm run preview
   ```

## Deployment

This project auto-deploys to GitHub Pages via GitHub Actions whenever you push to `main`.

To deploy elsewhere:
- The production build outputs to `/dist`
- Set `base` in `vite.config.ts` to match your deployment path

## Optimizations

This build includes several performance and SEO optimizations:

- **SEO:** Full meta tags for social sharing (Open Graph, Twitter Cards)
- **Performance:** Preconnect to Google Fonts and DNS prefetch for Gemini API
- **Environment Variables:** Secure API key management
- **Type Safety:** TypeScript with proper environment variable types
- **Bundle Size:** Optimized with Vite's production build (~221KB gzipped)

## Development

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

