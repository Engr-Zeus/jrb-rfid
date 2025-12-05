# GitHub Storage Setup Guide

This guide will help you publish your RFID dashboard on GitHub Pages and store data directly in your GitHub repository.

## Overview

- **Frontend**: Hosted on GitHub Pages (free)
- **Backend**: GitHub Storage Service (stores data in your repo)
- **Data Storage**: JSON files committed to your GitHub repository

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it something like `rfid-dashboard` or `vehicle-tracking`
3. Make it **Public** (required for GitHub Pages) or **Private** (if you have GitHub Pro)
4. Initialize with a README

## Step 2: Upload Your Files

1. Clone your repository locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/rfid-dashboard.git
   cd rfid-dashboard
   ```

2. Copy your files:
   - `rfid-dashboard.html` → root of repo
   - `github-storage-service.js` → root of repo
   - `package.json` → root of repo (or create new one)

3. Create a `data` folder (this will store your data):
   ```bash
   mkdir data
   echo "[]" > data/scans.json
   echo "{}" > data/vehicles.json
   ```

4. Commit and push:
   ```bash
   git add .
   git commit -m "Initial commit: RFID Dashboard"
   git push origin main
   ```

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **Deploy from a branch**
4. Choose **main** branch and **/ (root)** folder
5. Click **Save**
6. Your site will be available at: `https://YOUR_USERNAME.github.io/rfid-dashboard/`

## Step 4: Create GitHub Personal Access Token

1. Go to GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **Generate new token (classic)**
3. Name it: `RFID Dashboard Storage`
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (if using GitHub Actions)
5. Click **Generate token**
6. **Copy the token immediately** (you won't see it again!)

## Step 5: Set Up Backend Service

### Option A: Deploy to Free Hosting (Recommended)

Use a free hosting service like:
- **Railway** (railway.app) - Free tier available
- **Render** (render.com) - Free tier available
- **Fly.io** (fly.io) - Free tier available
- **Heroku** (heroku.com) - Free tier limited

#### For Railway/Render/Fly.io:

1. Create account and new project
2. Connect your GitHub repository
3. Set environment variables:
   ```
   GITHUB_TOKEN=your_token_here
   GITHUB_OWNER=your_username
   GITHUB_REPO=rfid-dashboard
   PORT=3001
   ```
4. Deploy!

### Option B: Run Locally (Development)

1. Install dependencies:
   ```bash
   npm install express cors @octokit/rest
   ```

2. Create `.env` file:
   ```
   GITHUB_TOKEN=your_token_here
   GITHUB_OWNER=your_username
   GITHUB_REPO=rfid-dashboard
   PORT=3001
   ```

3. Install dotenv:
   ```bash
   npm install dotenv
   ```

4. Update `github-storage-service.js` to load .env:
   ```javascript
   import 'dotenv/config';
   // ... rest of code
   ```

5. Run:
   ```bash
   node github-storage-service.js
   ```

### Option C: Use GitHub Actions (Advanced)

Create `.github/workflows/sync-data.yml`:

```yaml
name: Sync Data to GitHub

on:
  repository_dispatch:
    types: [sync-data]

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Update data files
        run: |
          # Your sync logic here
```

## Step 6: Update Dashboard to Use GitHub Storage

The dashboard needs to be updated to sync with GitHub. I'll create an updated version that includes GitHub sync functionality.

## Step 7: Configure CORS (if needed)

If your backend is on a different domain, make sure CORS is enabled (already included in the service).

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never commit your GitHub token** to the repository
2. Use environment variables or GitHub Secrets
3. For public repos, consider using GitHub Actions with secrets
4. The token should have minimal required permissions

## Testing

1. Open your GitHub Pages URL
2. Add a vehicle profile
3. Scan a card
4. Check your GitHub repo → `data/` folder
5. You should see `scans.json` and `vehicles.json` files with your data!

## Troubleshooting

### Data not saving?
- Check backend service is running
- Verify GitHub token is correct
- Check repository name matches exactly
- Ensure token has `repo` scope

### CORS errors?
- Make sure backend has CORS enabled (already included)
- Check backend URL is correct in dashboard

### 404 errors?
- Verify file paths in GitHub repo
- Check branch name matches (default: `main`)

## Benefits of GitHub Storage

✅ **Version Control**: Every change is tracked  
✅ **Backup**: Data is stored in cloud  
✅ **Accessible**: View/edit data directly on GitHub  
✅ **Free**: GitHub Pages + free hosting  
✅ **Collaboration**: Multiple users can access same data  

## Next Steps

After setup, you can:
- View data files directly on GitHub
- Edit data files manually if needed
- Use GitHub's search to find specific scans
- Export data using GitHub's download feature
- Set up automated backups

