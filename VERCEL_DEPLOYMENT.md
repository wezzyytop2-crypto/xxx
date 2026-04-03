# LIMBI Deployment to Vercel

## Automatic Deployment (Recommended)

Your project is now ready for deployment to Vercel. The repository is on GitHub at:
- **GitHub URL**: https://github.com/wezzyytop2-crypto/xxx

### Step 1: Import to Vercel

1. Go to https://vercel.com/import
2. Select "Import Project from Git"
3. Connect your GitHub account
4. Select the repository: **wezzyytop2-crypto/xxx**
5. Click "Import"

### Step 2: Configure Vercel Project

The project already includes `vercel.json` with the correct settings:
- **Framework**: Next.js 14
- **Build Command**: `npm run build`
- **Environment Variables**: Pre-configured

### Step 3: Configure Custom Domain

1. In Vercel Dashboard, go to **Settings > Domains**
2. Add your domain: `gothyxan.store`
3. Follow the DNS configuration instructions:
   - Update DNS records at your domain registrar
   - Point to Vercel's nameservers or add CNAME records

### Step 4: Deploy

Once the domain is configured, Vercel will:
1. Automatically deploy from the GitHub `main` branch
2. Build the Next.js app
3. Deploy to the edge network
4. Make it available at https://gothyxan.store

## Continuous Deployment

After setup, every push to GitHub's `main` branch will automatically:
- Trigger a new build on Vercel
- Run tests (if configured)
- Deploy to production

## Local Testing Before Deployment

To verify everything works:

\`\`\`bash
npm run build
npm start
\`\`\`

Then visit http://localhost:3000

## Troubleshooting

### Build Fails
- Check Vercel Logs: Dashboard > Deployments > Logs
- Common issues: Missing dependencies, TypeScript errors, env vars

### Domain Not Resolving
- Wait 24-48 hours for DNS propagation
- Verify DNS records at your registrar
- Check https://www.whatsmydns.net/?q=gothyxan.store

### Pages Not Found
- Ensure all routes match the `/app` directory structure
- Check that no files have build errors in `npm run build`

## Environment Variables

If you need to add environment variables:

1. In Vercel Dashboard: **Settings > Environment Variables**
2. Add key-value pairs
3. Redeploy from Vercel Dashboard

Current variables are in `.env.example`:
- `NEXT_PUBLIC_APP_NAME=LIMBI`

## Features Deployed

✅ Offline-first PWA with ServiceWorker caching
✅ 250+ Romanian vocabulary words (11 categories)
✅ Gamification: XP & Level system
✅ Statistics dashboard with charts
✅ Export/Import functionality (JSON & CSV)
✅ Spaced repetition (SM-2 algorithm)
✅ Three study modes: Flashcards, Learn, Write
✅ Web Speech API support

## Support

For Vercel support: https://vercel.com/docs
For Next.js docs: https://nextjs.org/docs
