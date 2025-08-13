# Deploying to Vercel

## Prerequisites

1. Install Vercel CLI: `npm i -g vercel`
2. Have your Advent of Code session cookie and leaderboard ID ready

## Steps

1. **Login to Vercel**
   ```bash
   vercel login
   ```

2. **Deploy your project**
   ```bash
   vercel
   ```

3. **Set Environment Variables**
   - Go to your Vercel dashboard
   - Select your project
   - Go to Settings > Environment Variables
   - Add:
     - `VITE_SESSION`: Your AOC session cookie
     - `VITE_LEADERBOARD`: Your leaderboard ID

4. **Redeploy with environment variables**
   ```bash
   vercel --prod
   ```

## How it works

- The frontend is built and served as static files
- The `/api/aoc-user` endpoint is handled by a serverless function
- No more need to run `node index` locally
- Your app will work automatically on Vercel's infrastructure

## Local Development

You can still develop locally by running the old server:
```bash
cd server
node index.cjs
```

The frontend will automatically detect if it's running locally and use the appropriate endpoint.
