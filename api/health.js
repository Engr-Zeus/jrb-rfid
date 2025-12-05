export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const githubConfigured = !!(
    process.env.GITHUB_TOKEN &&
    process.env.GITHUB_OWNER &&
    process.env.GITHUB_REPO
  );

  return res.status(200).json({
    status: 'ok',
    githubConfigured,
    repo: githubConfigured 
      ? `${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}` 
      : 'not configured',
    timestamp: new Date().toISOString()
  });
}

