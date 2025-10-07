# 🚀 PANDA Lounge - Production Deployment Guide

## 📋 Prerequisites

- GitHub account
- Vercel account (free tier works)
- PostgreSQL database (Vercel Postgres, Supabase, Neon, or Railway)

---

## 🗄️ Step 1: Setup PostgreSQL Database

### Option A: Vercel Postgres (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (or create new)
3. Go to **Storage** → **Create Database** → **Postgres**
4. Copy the `DATABASE_URL` connection string

### Option B: Supabase (Free tier available)

1. Go to [Supabase](https://supabase.com)
2. Create new project
3. Go to **Settings** → **Database**
4. Copy connection string (use "Pooling" connection for better performance)
5. Add `?sslmode=require` to the end

### Option C: Neon (Generous free tier)

1. Go to [Neon](https://neon.tech)
2. Create new project
3. Copy connection string from dashboard

### Option D: Railway (Simple setup)

1. Go to [Railway](https://railway.app)
2. New Project → Add PostgreSQL
3. Copy `DATABASE_URL` from variables tab

---

## 🔧 Step 2: Configure Environment Variables

### Local Testing with PostgreSQL

1. Update `.env`:
```bash
DATABASE_URL="your-postgresql-url-here"
```

2. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

3. Apply migrations:
```bash
npx prisma migrate deploy
npm run prisma:seed
```

### Production Environment (Vercel)

Add these environment variables in Vercel Dashboard:

**Settings → Environment Variables**

```bash
# Database
DATABASE_URL="your-postgresql-connection-string"

# NextAuth
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="generate-new-secret-here"

# QR System
QR_SECRET="generate-new-secret-here"
QR_TTL_MINUTES="60"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# App Settings
APP_NAME="PANDA Lounge"
APP_URL="https://your-domain.vercel.app"
NODE_ENV="production"
```

**Generate Secrets:**
```bash
# For NEXTAUTH_SECRET and QR_SECRET
openssl rand -base64 32
```

---

## 🔐 Step 3: Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. **APIs & Services** → **Credentials**
4. Edit your OAuth 2.0 Client ID
5. Add Authorized Redirect URI:
   ```
   https://your-domain.vercel.app/api/auth/callback/google
   ```
6. Save changes
7. Wait 5-10 minutes for Google to apply changes

---

## 📦 Step 4: Deploy to Vercel

### Method 1: CLI Deployment (Fastest)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

### Method 2: GitHub Integration (Recommended)

1. Push code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/panda-lounge.git
git push -u origin main
```

2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. **Import Project** → Select your GitHub repo
4. Configure:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `yarn install`

5. Add Environment Variables (from Step 2)

6. Click **Deploy**

---

## 🔄 Step 5: Run Database Migrations

After first deployment, run migrations:

### Option A: Using Vercel CLI

```bash
vercel env pull .env.production
npx prisma migrate deploy
npm run prisma:seed
```

### Option B: Using Vercel Dashboard

1. Go to your project in Vercel
2. **Settings** → **Environment Variables**
3. Add build script:
   ```json
   {
     "scripts": {
       "vercel-build": "prisma generate && prisma migrate deploy && next build"
     }
   }
   ```

### Option C: Manual via Prisma Studio

1. Connect to production database:
```bash
DATABASE_URL="your-production-url" npx prisma studio
```

2. Run seed script:
```bash
DATABASE_URL="your-production-url" npm run prisma:seed
```

---

## ✅ Step 6: Verify Deployment

### Checklist

- [ ] Site loads at `https://your-domain.vercel.app`
- [ ] Can register new user
- [ ] Can login with email/password
- [ ] Can login with Google OAuth
- [ ] Admin panel accessible at `/admin`
- [ ] Staff panel accessible at `/staff`
- [ ] QR codes generate correctly
- [ ] Database connections work
- [ ] No console errors

### Test Accounts (After seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@panda.com | admin123 |
| User | demo@panda.com | demo123 |
| Staff | staff@panda.com | staff123 |

**⚠️ IMPORTANT:** Change these passwords immediately in production!

---

## 🎯 Post-Deployment Tasks

### Security

1. **Change Default Passwords**
   - Login as admin
   - Go to `/admin/users`
   - Update all default account passwords

2. **Rotate Secrets**
   - Generate new `NEXTAUTH_SECRET`
   - Generate new `QR_SECRET`
   - Update in Vercel environment variables
   - Redeploy

3. **Configure Rate Limiting** (Optional)
   - Install `next-rate-limit` or similar
   - Add middleware for API protection

### Performance

1. **Enable Caching**
   - Vercel automatically handles static caching
   - Consider Redis for session storage (optional)

2. **Monitor Performance**
   - Vercel Analytics (free tier)
   - Lighthouse CI for continuous monitoring

### Monitoring

1. **Error Tracking**
   - Integrate Sentry (optional but recommended)
   - Monitor Vercel deployment logs

2. **Database Backups**
   - Vercel Postgres: Automatic backups included
   - Supabase: Automatic backups on paid plans
   - Manual: `pg_dump` scheduled via cron

---

## 🔄 Continuous Deployment

Once connected to GitHub:

1. Push to `main` branch → Auto-deploy to production
2. Push to other branches → Auto-deploy to preview URLs
3. Pull Requests → Automatic preview deployments

```bash
git add .
git commit -m "Update feature"
git push origin main
# Vercel automatically deploys!
```

---

## 🐛 Troubleshooting

### Build Fails

**Error: Prisma Client not generated**
```bash
# Add to package.json
"postinstall": "prisma generate"
```

**Error: Database connection failed**
- Check `DATABASE_URL` format
- Ensure `?sslmode=require` for cloud databases
- Verify network access (whitelist Vercel IPs if needed)

### Runtime Errors

**Error: NEXTAUTH_URL not set**
- Verify environment variable in Vercel dashboard
- Redeploy after adding

**Error: Google OAuth not working**
- Check redirect URI matches exactly
- Wait 10 minutes after updating Google Console
- Clear browser cookies

### Database Issues

**Error: Migration failed**
```bash
# Reset and reapply
npx prisma migrate reset --force
npx prisma migrate deploy
```

**Error: Connection pool exhausted**
- Use connection pooling (Prisma Data Proxy or PgBouncer)
- Reduce connection timeout in Prisma schema

---

## 📊 Monitoring Production

### Vercel Dashboard

- **Deployments**: Track deployment history
- **Analytics**: Monitor page views and performance
- **Logs**: Real-time server logs
- **Usage**: Track bandwidth and function invocations

### Database Monitoring

- Vercel Postgres: Built-in metrics
- Supabase: Dashboard with query performance
- External: Use tools like PgHero or pgAnalyze

---

## 🎓 Best Practices

1. **Environment Variables**
   - Never commit secrets to Git
   - Use different secrets for dev/staging/prod
   - Rotate secrets regularly (every 90 days)

2. **Database**
   - Enable connection pooling
   - Set up automated backups
   - Monitor query performance
   - Create indexes for frequently queried fields

3. **Security**
   - Always use HTTPS
   - Implement rate limiting on auth endpoints
   - Enable CORS restrictions
   - Set secure cookie flags

4. **Performance**
   - Use Vercel Edge Functions for static content
   - Enable ISR (Incremental Static Regeneration)
   - Optimize images with next/image
   - Implement caching strategies

---

## 📞 Support

### Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Production Guide](https://www.prisma.io/docs/guides/deployment)
- [NextAuth.js Production](https://next-auth.js.org/deployment)

### Common Issues

If you encounter issues:
1. Check Vercel deployment logs
2. Verify all environment variables
3. Test database connection manually
4. Check Google OAuth configuration
5. Review Prisma migrations status

---

## ✨ Success!

Your PANDA Lounge application is now live in production! 🎉

**Next Steps:**
1. Share the URL with your team
2. Test all critical features
3. Update DNS (if using custom domain)
4. Set up monitoring and alerts
5. Plan regular backups

---

**Last Updated:** October 2025  
**Version:** 1.0  
**Status:** ✅ Production Ready
