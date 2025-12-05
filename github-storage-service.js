import express from 'express';
import cors from 'cors';
import { Octokit } from '@octokit/rest';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Try to load dotenv if available (for local development)
try {
  await import('dotenv/config');
} catch (e) {
  // dotenv not installed, that's okay for production
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// GitHub configuration (set via environment variables)
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER; // Your GitHub username
const GITHUB_REPO = process.env.GITHUB_REPO;   // Your repository name
const DATA_BRANCH = process.env.GITHUB_BRANCH || 'main';

// Initialize Octokit
let octokit;
if (GITHUB_TOKEN) {
  octokit = new Octokit({ auth: GITHUB_TOKEN });
} else {
  console.warn('⚠️  GITHUB_TOKEN not set. GitHub storage will be disabled.');
}

// Helper function to get file content from GitHub
async function getFileFromGitHub(filePath) {
  if (!octokit) return null;
  
  try {
    const { data } = await octokit.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: filePath,
      ref: DATA_BRANCH,
    });
    
    if (data.content && data.encoding === 'base64') {
      return JSON.parse(Buffer.from(data.content, 'base64').toString());
    }
    return null;
  } catch (error) {
    if (error.status === 404) {
      return null; // File doesn't exist yet
    }
    console.error(`Error fetching ${filePath}:`, error.message);
    throw error;
  }
}

// Helper function to save file to GitHub
async function saveFileToGitHub(filePath, content, commitMessage) {
  if (!octokit) {
    throw new Error('GitHub token not configured');
  }

  try {
    // Get current file SHA if it exists
    let sha = null;
    try {
      const { data } = await octokit.repos.getContent({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        path: filePath,
        ref: DATA_BRANCH,
      });
      sha = data.sha;
    } catch (error) {
      // File doesn't exist, that's okay
    }

    // Encode content to base64
    const contentBase64 = Buffer.from(JSON.stringify(content, null, 2)).toString('base64');

    // Create or update file
    await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: filePath,
      message: commitMessage,
      content: contentBase64,
      branch: DATA_BRANCH,
      ...(sha && { sha }), // Include SHA if updating existing file
    });

    return { success: true };
  } catch (error) {
    console.error(`Error saving ${filePath}:`, error.message);
    throw error;
  }
}

// API Routes

// Get all scans
app.get('/api/scans', async (req, res) => {
  try {
    const scans = await getFileFromGitHub('data/scans.json') || [];
    res.json({ scans });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save scans
app.post('/api/scans', async (req, res) => {
  try {
    const { scans } = req.body;
    await saveFileToGitHub(
      'data/scans.json',
      scans,
      `Update scans - ${new Date().toISOString()}`
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a single scan
app.post('/api/scans/add', async (req, res) => {
  try {
    const scan = req.body;
    const scans = await getFileFromGitHub('data/scans.json') || [];
    scans.unshift(scan);
    await saveFileToGitHub(
      'data/scans.json',
      scans,
      `Add scan: ${scan.cardId} - ${new Date().toISOString()}`
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all vehicles
app.get('/api/vehicles', async (req, res) => {
  try {
    const vehicles = await getFileFromGitHub('data/vehicles.json') || {};
    res.json({ vehicles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save vehicles
app.post('/api/vehicles', async (req, res) => {
  try {
    const { vehicles } = req.body;
    await saveFileToGitHub(
      'data/vehicles.json',
      vehicles,
      `Update vehicles - ${new Date().toISOString()}`
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add or update a vehicle
app.post('/api/vehicles/:cardId', async (req, res) => {
  try {
    const { cardId } = req.params;
    const vehicle = req.body;
    const vehicles = await getFileFromGitHub('data/vehicles.json') || {};
    vehicles[cardId] = vehicle;
    await saveFileToGitHub(
      'data/vehicles.json',
      vehicles,
      `${vehicles[cardId] ? 'Update' : 'Add'} vehicle: ${cardId} - ${new Date().toISOString()}`
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a vehicle
app.delete('/api/vehicles/:cardId', async (req, res) => {
  try {
    const { cardId } = req.params;
    const vehicles = await getFileFromGitHub('data/vehicles.json') || {};
    delete vehicles[cardId];
    await saveFileToGitHub(
      'data/vehicles.json',
      vehicles,
      `Delete vehicle: ${cardId} - ${new Date().toISOString()}`
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    githubConfigured: !!octokit,
    repo: GITHUB_REPO ? `${GITHUB_OWNER}/${GITHUB_REPO}` : 'not configured'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 GitHub Storage Service running on port ${PORT}`);
  if (octokit) {
    console.log(`✅ GitHub integration enabled for ${GITHUB_OWNER}/${GITHUB_REPO}`);
  } else {
    console.log(`⚠️  GitHub integration disabled - set GITHUB_TOKEN to enable`);
  }
});

