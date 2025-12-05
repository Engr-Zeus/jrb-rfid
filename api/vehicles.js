import { Octokit } from '@octokit/rest';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;
const DATA_BRANCH = process.env.GITHUB_BRANCH || 'main';
const DATA_PATH = 'data/vehicles.json';

// Helper function to get file from GitHub
async function getFileFromGitHub() {
  try {
    const { data } = await octokit.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: DATA_PATH,
      ref: DATA_BRANCH,
    });
    
    if (data.content && data.encoding === 'base64') {
      return JSON.parse(Buffer.from(data.content, 'base64').toString());
    }
    return {};
  } catch (error) {
    if (error.status === 404) {
      return {}; // File doesn't exist yet
    }
    throw error;
  }
}

// Helper function to save file to GitHub
async function saveFileToGitHub(content, commitMessage) {
  // Get current file SHA if it exists
  let sha = null;
  try {
    const { data } = await octokit.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: DATA_PATH,
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
    path: DATA_PATH,
    message: commitMessage,
    content: contentBase64,
    branch: DATA_BRANCH,
    ...(sha && { sha }),
  });

  return { success: true };
}

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      // Get all vehicles
      const vehicles = await getFileFromGitHub();
      return res.status(200).json({ vehicles });
    }

    if (req.method === 'POST') {
      const { vehicles, vehicle, cardId } = req.body;

      if (vehicle && cardId) {
        // Add or update a single vehicle
        const existingVehicles = await getFileFromGitHub();
        existingVehicles[cardId] = vehicle;
        await saveFileToGitHub(
          existingVehicles,
          `${existingVehicles[cardId] ? 'Update' : 'Add'} vehicle: ${cardId} - ${new Date().toISOString()}`
        );
        return res.status(200).json({ success: true });
      }

      if (vehicles) {
        // Save all vehicles
        await saveFileToGitHub(
          vehicles,
          `Update vehicles - ${new Date().toISOString()}`
        );
        return res.status(200).json({ success: true });
      }

      return res.status(400).json({ error: 'Invalid request body' });
    }

    if (req.method === 'DELETE') {
      // Get cardId from query string
      const cardId = req.query.cardId;
      if (!cardId) {
        return res.status(400).json({ error: 'cardId query parameter is required' });
      }

      const existingVehicles = await getFileFromGitHub();
      delete existingVehicles[cardId];
      await saveFileToGitHub(
        existingVehicles,
        `Delete vehicle: ${cardId} - ${new Date().toISOString()}`
      );
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

