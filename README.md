# Catalyzer Website

A modern educational platform website built with Next.js 14, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework:** Next.js 14.1.0
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Custom components with Lucide icons
- **Carousel:** Embla Carousel
- **Animations:** Framer Motion & CSS animations

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- ✅ Responsive design for all screen sizes
- ✅ Auto-playing hero carousel
- ✅ Animated statistics counters
- ✅ Interactive exam category cards
- ✅ Smooth scroll animations
- ✅ Mobile-friendly navigation
- ✅ SEO optimized

## Project Structure

```
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
├── components/
│   ├── ui/
│   │   └── button.tsx   # Button component
│   ├── Header.tsx       # Header with navigation
│   ├── HeroCarousel.tsx # Hero section carousel
│   ├── ExamCategories.tsx
│   ├── Statistics.tsx
│   ├── ContentSections.tsx
│   └── Footer.tsx
└── lib/
    └── utils.ts         # Utility functions
```

## Color Palette

- Primary Purple: `#5A4BDA`
- Dark Purple: `#4437B8`
- Secondary Orange: `#FF6B35`
- Accent Teal: `#4ECDC4`

## License

MIT
