# Netlify Deployment Guide for Mimanasa Web App

## Method 1: Deploy via Netlify CLI (Recommended)

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 2: Login to Netlify
```bash
netlify login
```
This will open a browser window. Login with your Netlify account.

### Step 3: Initialize Netlify in your project
```bash
cd mimanasa-web
netlify init
```

Follow the prompts:
- **Create & configure a new site**: Yes
- **Team**: Select your team
- **Site name**: mimanasa-web (or your preferred name)
- **Build command**: `npm run build`
- **Directory to deploy**: `dist`

### Step 4: Set Environment Variables
```bash
netlify env:set VITE_API_BASE_URL "https://mimamsabackend.onrender.com/api"
```

### Step 5: Deploy
```bash
netlify deploy --prod
```

---

## Method 2: Deploy via Netlify Dashboard (Easiest)

### Step 1: Go to Netlify
1. Visit https://app.netlify.com/
2. Login or Sign up

### Step 2: Import from GitHub
1. Click **"Add new site"** → **"Import an existing project"**
2. Choose **"Deploy with GitHub"**
3. Authorize Netlify to access your GitHub
4. Select repository: **gitmanhimanshu/MimamsaWeb**

### Step 3: Configure Build Settings
- **Branch to deploy**: `main`
- **Build command**: `npm run build`
- **Publish directory**: `dist`

### Step 4: Add Environment Variables
Click **"Show advanced"** → **"New variable"**

Add:
- **Key**: `VITE_API_BASE_URL`
- **Value**: `https://mimamsabackend.onrender.com/api`

### Step 5: Deploy
Click **"Deploy site"**

---

## Method 3: Manual Deploy (Quick Test)

### Step 1: Build the project locally
```bash
cd mimanasa-web
npm run build
```

### Step 2: Install Netlify CLI (if not installed)
```bash
npm install -g netlify-cli
```

### Step 3: Deploy the dist folder
```bash
netlify deploy
```

For production:
```bash
netlify deploy --prod
```

---

## Post-Deployment Configuration

### 1. Configure Redirects for SPA
Create `mimanasa-web/public/_redirects` file with:
```
/*    /index.html   200
```

### 2. Update Environment Variables (if needed)
Via Netlify Dashboard:
1. Go to **Site settings** → **Environment variables**
2. Add/Edit variables
3. Redeploy

Via CLI:
```bash
netlify env:set VARIABLE_NAME "value"
```

### 3. Custom Domain (Optional)
1. Go to **Domain settings**
2. Add custom domain
3. Update DNS records as instructed

---

## Useful Commands

```bash
# Check deployment status
netlify status

# View site in browser
netlify open

# View deployment logs
netlify logs

# List environment variables
netlify env:list

# Redeploy
netlify deploy --prod
```

---

## Troubleshooting

### Build fails?
- Check Node version: `node --version` (should be 18+)
- Clear cache: `rm -rf node_modules package-lock.json && npm install`
- Check build locally: `npm run build`

### Environment variables not working?
- Ensure they start with `VITE_`
- Redeploy after adding variables
- Check in Netlify Dashboard → Site settings → Environment variables

### 404 errors on refresh?
- Add `_redirects` file in `public` folder
- Content: `/*    /index.html   200`

---

## Expected Result

After successful deployment:
- **Site URL**: `https://your-site-name.netlify.app`
- **Build time**: ~2-3 minutes
- **Auto-deploy**: Enabled (on git push to main)

---

## Notes

- Netlify automatically rebuilds on every push to `main` branch
- Free tier includes: 100GB bandwidth, 300 build minutes/month
- HTTPS is automatically enabled
- CDN is automatically configured
