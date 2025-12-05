# Publishing RFID Dashboard on GitHub with Data Storage

## Quick Answer

**Yes, you can publish on GitHub and store data in the repo!** Here's how:

## Two Approaches

### Approach 1: Simple GitHub Pages (Data in Browser Only)
- ✅ Host dashboard on GitHub Pages (free)
- ✅ Works immediately
- ❌ Data stays in browser localStorage (not in repo)

### Approach 2: GitHub Pages + Backend Service (Data in Repo)
- ✅ Host dashboard on GitHub Pages (free)
- ✅ Data stored in GitHub repository
- ✅ Data visible in repo, version controlled
- ⚠️ Requires backend service (free hosting available)

## Recommended: Approach 2 (Full GitHub Integration)

### Step-by-Step Setup

#### 1. Create GitHub Repository

```bash
# Create new repo on GitHub, then:
git clone https://github.com/YOUR_USERNAME/rfid-dashboard.git
cd rfid-dashboard
```

#### 2. Add Files to Repo

```bash
# Copy your dashboard
cp rfid-dashboard.html index.html  # GitHub Pages looks for index.html

# Create data directory
mkdir -p data
echo "[]" > data/scans.json
echo "{}" > data/vehicles.json

# Add backend service
# (github-storage-service.js and package-github-service.json)

git add .
git commit -m "Initial RFID Dashboard"
git push origin main
```

#### 3. Enable GitHub Pages

1. Go to repo → **Settings** → **Pages**
2. Source: **Deploy from branch**
3. Branch: **main** / **root**
4. Save

Your dashboard: `https://YOUR_USERNAME.github.io/rfid-dashboard/`

#### 4. Deploy Backend Service

**Option A: Railway (Easiest - Free Tier)**

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. New Project → Deploy from GitHub
4. Select your repo
5. Add environment variables:
   ```
   GITHUB_TOKEN=your_personal_access_token
   GITHUB_OWNER=your_username
   GITHUB_REPO=rfid-dashboard
   PORT=3001
   ```
6. Deploy!

**Option B: Render**

1. Go to [render.com](https://render.com)
2. New Web Service
3. Connect GitHub repo
4. Set environment variables (same as above)
5. Deploy!

**Option C: Run Locally**

```bash
# Install dependencies
npm install express cors @octokit/rest dotenv

# Create .env file
cat > .env << EOF
GITHUB_TOKEN=your_token_here
GITHUB_OWNER=your_username
GITHUB_REPO=rfid-dashboard
PORT=3001
EOF

# Run service
node github-storage-service.js
```

#### 5. Create GitHub Personal Access Token

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token
3. Name: `RFID Dashboard`
4. Scopes: ✅ `repo` (full control)
5. Generate and copy token

#### 6. Configure Dashboard

Update `rfid-dashboard.html` to use GitHub sync:

1. Add API URL configuration at top of script:
```javascript
const GITHUB_API_URL = 'https://your-backend.railway.app'; // Your backend URL
```

2. Add sync functions (see `rfid-dashboard-github.html` for full implementation)

Or use the provided `rfid-dashboard-github.html` which includes GitHub sync.

## How It Works

1. **Dashboard** (GitHub Pages) → Scans cards, manages vehicles
2. **Backend Service** (Railway/Render) → Receives data via API
3. **GitHub API** → Backend commits data files to your repo
4. **Data Files** → Stored in `data/scans.json` and `data/vehicles.json`

## Data Storage Location

Your data will be stored in:
```
your-repo/
  ├── data/
  │   ├── scans.json      # All scan records
  │   └── vehicles.json   # All vehicle profiles
  └── index.html          # Your dashboard
```

## Viewing Your Data

- **On GitHub**: Browse to `data/scans.json` and `data/vehicles.json`
- **In Dashboard**: All data loads automatically
- **Version History**: Every change is tracked in git commits

## Benefits

✅ **Free Hosting**: GitHub Pages + free backend hosting  
✅ **Version Control**: Every change tracked  
✅ **Backup**: Data in cloud  
✅ **Accessible**: View/edit data on GitHub  
✅ **Collaboration**: Multiple users can access  
✅ **Export**: Download data anytime  

## Troubleshooting

**Backend not connecting?**
- Check backend URL is correct
- Verify backend is running
- Check CORS settings

**Data not saving?**
- Verify GitHub token is correct
- Check token has `repo` scope
- Verify repo name matches exactly

**GitHub Pages not updating?**
- Wait a few minutes for deployment
- Check Actions tab for errors
- Verify `index.html` is in root

## Security Notes

⚠️ **Never commit your GitHub token!**
- Use environment variables
- Use GitHub Secrets (for Actions)
- Keep token private

## Next Steps

1. Set up repository
2. Deploy backend service
3. Configure dashboard
4. Start scanning!

Your data will now be stored in your GitHub repository! 🎉

