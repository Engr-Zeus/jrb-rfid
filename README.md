# RFID Card Scanner Dashboard

A dynamic web dashboard for capturing and managing RFID card scans with vehicle profile management and GitHub storage integration.

## 🚀 Quick Start

### Option 1: Local Use (No Setup Required)

1. Open `rfid-dashboard.html` in your browser
2. Start scanning cards!
3. Data stored in browser localStorage

### Option 2: Deploy on Vercel with GitHub Storage

See [VERCEL_SETUP.md](./VERCEL_SETUP.md) for complete instructions.

**Quick steps:**
1. Push to GitHub
2. Deploy to Vercel
3. Set environment variables
4. Your data is stored in GitHub! 🎉

## Features

- ✅ **Real-time Card Scanning** - Automatically captures RFID card data
- ✅ **Vehicle Profile Management** - Link cards to complete vehicle profiles
- ✅ **GitHub Storage** - Store data in your GitHub repository (when deployed)
- ✅ **Offline Support** - Works offline with localStorage backup
- ✅ **Search & Filter** - Find scans quickly
- ✅ **Data Export** - Export to CSV
- ✅ **Modern UI** - Clean, responsive design

## Project Structure

```
├── rfid-dashboard.html      # Main dashboard (local use)
├── index.html               # Dashboard for Vercel (copy from rfid-dashboard.html)
├── api/                     # Vercel serverless functions
│   ├── scans.js            # Scans API endpoint
│   ├── vehicles.js         # Vehicles API endpoint
│   └── health.js           # Health check endpoint
├── data/                    # Data storage (created automatically)
│   ├── scans.json          # Scan records
│   └── vehicles.json       # Vehicle profiles
├── vercel.json             # Vercel configuration
├── package.json            # Dependencies
└── VERCEL_SETUP.md         # Deployment guide
```

## How It Works

### Local Mode
- Data stored in browser localStorage
- Works completely offline
- No server required

### GitHub Storage Mode (Vercel)
- Dashboard hosted on Vercel
- API routes store data in GitHub repository
- Data files: `data/scans.json` and `data/vehicles.json`
- Every change creates a git commit
- View/edit data directly on GitHub

## Environment Variables (Vercel)

Required for GitHub storage:

```
GITHUB_TOKEN=your_personal_access_token
GITHUB_OWNER=your_github_username
GITHUB_REPO=your_repository_name
GITHUB_BRANCH=main
```

## API Endpoints (Vercel)

- `GET /api/scans` - Get all scans
- `POST /api/scans` - Save scans
- `GET /api/vehicles` - Get all vehicles
- `POST /api/vehicles` - Save vehicles
- `DELETE /api/vehicles?cardId=XXX` - Delete vehicle
- `GET /api/health` - Health check

## Development

```bash
# Install dependencies
npm install

# Run locally with Vercel CLI
npm install -g vercel
vercel dev
```

## License

ISC

## Support

For issues or questions, check the setup guides:
- [VERCEL_SETUP.md](./VERCEL_SETUP.md) - Vercel deployment
- [RFID_DASHBOARD_README.md](./RFID_DASHBOARD_README.md) - Usage guide

