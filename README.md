# StudioSuite | Luxury Management

Professional studio and salon management platform built with Next.js.

## Getting Started

1. **Install dependencies**: `npm install`
2. **Run development server**: `npm run dev` (Runs on http://localhost:9002)
3. **Build for production**: `npm run build`

## Hosting & Deployment

This project uses Next.js **standalone output** (configured in `next.config.ts`), which makes it extremely easy to host anywhere.

### Option 1: Vercel / Netlify / Cloudflare (Recommended)
Simply connect your Git repository to these platforms. They will automatically detect Next.js and deploy it.

### Option 2: Self-Hosting on a VPS (DigitalOcean, Linode, etc.)
After running `npm run build`, Next.js creates a minimal production build in the `.next/standalone` directory.
1. Copy your project folder to your server.
2. Run `NODE_ENV=production node .next/standalone/server.js`.

### Option 3: Docker
The standalone output is optimized for Docker. You can use the standard Next.js Dockerfile to create a small image (~100MB).

## Project Structure

- `/src/app/dashboard`: Main admin interface
- `/src/app/dashboard/services`: Service menu management
- `/src/app/dashboard/finance`: Financial analytics
- `/src/app/dashboard/products`: Inventory tracking
- `/src/app/dashboard/staff`: Team management
