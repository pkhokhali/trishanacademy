# Trishan Academy - School Website

A modern, responsive school website built with React and Vite, designed for deployment on Vercel.

## Features

- 🎨 Beautiful, modern UI design
- 📱 Fully responsive across all devices
- ⚡ Fast performance with Vite
- 🎯 SEO-friendly structure
- 🚀 Ready for Vercel deployment

## Tech Stack

- **React 18** - UI library
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Lucide React** - Icons

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Deployment to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Vercel will automatically detect the Vite configuration
4. Deploy!

The `vercel.json` file is already configured for optimal deployment.

## Project Structure

```
school-website/
├── src/
│   ├── components/     # Reusable components
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── pages/          # Page components
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Programs.jsx
│   │   └── Contact.jsx
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css      # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── vercel.json
```

## Pages

- **Home** - Hero section, features, programs overview, testimonials
- **About** - Mission, vision, history, values, achievements
- **Programs** - Academic programs and extracurricular activities
- **Contact** - Contact form and information

## Customization

You can easily customize:
- Colors in `tailwind.config.js`
- Content in page components
- Styling in component files
- Logo and branding

## License

MIT

