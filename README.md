# Know How Cafe - Frontend

React + Vite + TypeScript frontend application for Know How Cafe.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Backend server running (local or production)

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env.local
   ```

3. **Configure environment variables:**
   
   Edit `.env.local`:
   ```env
   # For local development
   VITE_BACKEND_URL=http://localhost:3000
   # Note: VITE_API_URL is also supported for backward compatibility
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:5173` (or port 8080)

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── lib/           # Utilities and API client
│   ├── hooks/         # Custom React hooks
│   └── main.tsx       # Entry point
├── public/            # Static assets
├── index.html         # HTML template
└── package.json       # Dependencies
```

## 🔧 Environment Variables

### Required

- `VITE_BACKEND_URL` - Backend API base URL (without `/api` suffix)
- Note: `VITE_API_URL` is also supported for backward compatibility, but `VITE_BACKEND_URL` is preferred

### Local Development

Create `.env.local`:
```env
VITE_BACKEND_URL=http://localhost:3000
```

### Production (Vercel)

Set in Vercel dashboard:
```env
VITE_BACKEND_URL=https://knowhow-backend-d2gs.onrender.com
```

**Important:** 
- Remove any trailing slashes from the URL
- Use HTTPS for production URLs
- The API client automatically appends `/api` to the base URL

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔗 Backend Connection

The frontend connects to the backend API using the `VITE_BACKEND_URL` environment variable (or `VITE_API_URL` for backward compatibility).

The API client automatically:
- Appends `/api` to the base URL
- Adds authentication tokens to requests
- Handles errors gracefully

## 🚢 Deployment

See [VERCEL_DEPLOYMENT.md](../VERCEL_DEPLOYMENT.md) for complete deployment instructions.

Quick steps:
1. Push code to GitHub
2. Import to Vercel
3. Set `VITE_BACKEND_URL` environment variable in Vercel dashboard
4. Deploy!

## 🐛 Troubleshooting

### API Connection Issues

- Verify `VITE_BACKEND_URL` is set correctly in Vercel environment variables
- Check backend is running and accessible
- Check browser console for CORS errors

### Build Errors

- Run `npm install` to ensure dependencies are installed
- Check Node.js version (18+ required)
- Review build logs for specific errors

## 📚 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **TypeScript** - Type safety
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components

## 📝 License

See main repository for license information.

