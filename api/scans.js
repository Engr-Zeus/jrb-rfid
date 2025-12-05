import { Octokit } from '@octokit/rest';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;
const DATA_BRANCH = process.env.GITHUB_BRANCH || 'main';
const DATA_PATH = 'data/scans.json';

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
    return [];
  } catch (error) {
    if (error.status === 404) {
      return []; // File doesn't exist yet
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      // Get all scans
      const scans = await getFileFromGitHub();
      return res.status(200).json({ scans });
    }

    if (req.method === 'POST') {
      const { scans, scan } = req.body;

      if (scan) {
        // Add a single scan
        const existingScans = await getFileFromGitHub();
        existingScans.unshift(scan);
        await saveFileToGitHub(
          existingScans,
          `Add scan: ${scan.cardId} - ${new Date().toISOString()}`
        );
        return res.status(200).json({ success: true });
      }

      if (scans) {
        // Save all scans
        await saveFileToGitHub(
          scans,
          `Update scans - ${new Date().toISOString()}`
        );
        return res.status(200).json({ success: true });
      }

      return res.status(400).json({ error: 'Invalid request body' });
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

