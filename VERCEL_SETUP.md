# Vercel Setup Guide for RFID Dashboard

Complete guide to deploy your RFID dashboard on Vercel with GitHub storage.

## 🚀 Quick Start

### Step 1: Prepare Your Repository

1. **Create GitHub repository** (if you haven't already)
   ```bash
   git clone https://github.com/YOUR_USERNAME/rfid-dashboard.git
   cd rfid-dashboard
   ```

2. **Add files to your repo:**
   ```bash
   # Copy dashboard as index.html (Vercel will serve this)
   cp rfid-dashboard.html index.html
   
   # Create data directory
   mkdir -p data
   echo "[]" > data/scans.json
   echo "{}" > data/vehicles.json
   
   # Add all files
   git add .
   git commit -m "Add Vercel configuration"
   git push origin main
   ```

### Step 2: Create GitHub Personal Access Token

1. Go to GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **Generate new token (classic)**
3. Name: `RFID Dashboard Vercel`
4. Select scopes:
   - ✅ **repo** (Full control of private repositories)
5. Click **Generate token**
6. **Copy the token** (you won't see it again!)

### Step 3: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up/Login** with your GitHub account
3. Click **Add New Project**
4. **Import your GitHub repository**
5. Configure project:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (root)
   - **Build Command**: `echo "No build required"`
   - **Output Directory**: `.` (current directory)

6. **Add Environment Variables:**
   Click "Environment Variables" and add:
   ```
   GITHUB_TOKEN=your_personal_access_token_here
   GITHUB_OWNER=your_github_username
   GITHUB_REPO=rfid-dashboard
   GITHUB_BRANCH=main
   ```

7. Click **Deploy**

#### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Set environment variables:**
   ```bash
   vercel env add GITHUB_TOKEN
   # Paste your token when prompted
   
   vercel env add GITHUB_OWNER
   # Enter your GitHub username
   
   vercel env add GITHUB_REPO
   # Enter your repository name
   
   vercel env add GITHUB_BRANCH
   # Enter: main
   ```

5. **Redeploy with environment variables:**
   ```bash
   vercel --prod
   ```

### Step 4: Update Dashboard Configuration

Your dashboard needs to know the Vercel API URL. Update `index.html`:

1. **Find the API configuration** (around line 835 in script section)
2. **Update the API URL:**
   ```javascript
   // Replace this:
   const API_BASE_URL = localStorage.getItem('github_api_url') || '';
   
   // With your Vercel URL:
   const API_BASE_URL = 'https://your-project.vercel.app';
   ```

   Or add a configuration section that auto-detects:
   ```javascript
   const API_BASE_URL = window.location.origin; // Uses same domain as dashboard
   ```

3. **Commit and push:**
   ```bash
   git add index.html
   git commit -m "Configure API URL for Vercel"
   git push origin main
   ```

   Vercel will automatically redeploy!

## 📁 Project Structure

Your repository should look like this:

```
rfid-dashboard/
├── api/
│   ├── scans.js          # API endpoint for scans
│   ├── vehicles.js       # API endpoint for vehicles
│   └── health.js         # Health check endpoint
├── data/
│   ├── scans.json        # Scan data (auto-created)
│   └── vehicles.json     # Vehicle data (auto-created)
├── index.html            # Your dashboard (renamed from rfid-dashboard.html)
├── vercel.json           # Vercel configuration
├── package.json          # Dependencies
└── README.md
```

## 🔧 API Endpoints

Once deployed, your API will be available at:

- `https://your-project.vercel.app/api/scans` - GET/POST scans
- `https://your-project.vercel.app/api/vehicles` - GET/POST/DELETE vehicles
- `https://your-project.vercel.app/api/health` - Health check

## 🎯 How It Works

1. **Frontend** (`index.html`) → Hosted on Vercel
2. **API Routes** (`api/*.js`) → Vercel serverless functions
3. **GitHub API** → API routes commit data to your repo
4. **Data Files** → Stored in `data/scans.json` and `data/vehicles.json`

## ✅ Testing

1. **Check health endpoint:**
   ```bash
   curl https://your-project.vercel.app/api/health
   ```
   Should return: `{"status":"ok","githubConfigured":true,...}`

2. **Open dashboard:**
   ```
   https://your-project.vercel.app
   ```

3. **Test scanning:**
   - Scan a card or enter a test card ID
   - Check your GitHub repo → `data/scans.json`
   - You should see the scan appear!

## 🔒 Security Notes

⚠️ **Important:**
- Never commit your `GITHUB_TOKEN` to the repository
- Always use Vercel environment variables
- Token should have minimal required permissions (`repo` scope)
- Consider using Vercel's environment variable encryption

## 🐛 Troubleshooting

### API returns 500 error
- Check environment variables are set correctly in Vercel dashboard
- Verify GitHub token has `repo` scope
- Check Vercel function logs: Vercel Dashboard → Your Project → Functions → View Logs

### Data not saving
- Verify `GITHUB_OWNER` and `GITHUB_REPO` match exactly (case-sensitive)
- Check GitHub token is valid
- Ensure repository exists and token has access

### CORS errors
- CORS is already configured in `vercel.json`
- If issues persist, check browser console for specific errors

### Dashboard can't connect to API
- Verify API URL in dashboard matches your Vercel deployment URL
- Check browser console for network errors
- Ensure API routes are deployed (check Vercel dashboard)

## 📊 Monitoring

- **Vercel Dashboard**: View function logs and metrics
- **GitHub**: View commits in your repository (each save creates a commit)
- **Browser Console**: Check for JavaScript errors

## 🚀 Benefits of Vercel

✅ **Free Tier**: Generous free tier for personal projects  
✅ **Automatic Deployments**: Deploys on every git push  
✅ **Serverless**: No server management needed  
✅ **Fast**: Global CDN, fast response times  
✅ **Easy**: Simple setup, great documentation  
✅ **GitHub Integration**: Seamless GitHub integration  

## 📝 Next Steps

1. ✅ Deploy to Vercel
2. ✅ Configure environment variables
3. ✅ Update dashboard API URL
4. ✅ Test scanning
5. 🎉 Start using your dashboard!

Your data will now be stored in your GitHub repository, accessible from anywhere! 🎊

## 🔄 Updating Your Dashboard

After making changes:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Vercel will automatically redeploy! ✨

