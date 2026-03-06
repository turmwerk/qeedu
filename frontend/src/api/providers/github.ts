import { Octokit } from "@octokit/rest";

const CACHE_KEY = "github_last_commit_time";
const CACHE_TIMESTAMP_KEY = "github_last_commit_timestamp_record";
const TTL = 10 * 60 * 1000; // 10 minutes

export const getRepoLastCommitTime = async (): Promise<string | null> => {
  try {
    const cachedTime = localStorage.getItem(CACHE_KEY);
    const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    const now = Date.now();

    if (cachedTime && cachedTimestamp) {
      if (now - parseInt(cachedTimestamp, 10) < TTL) {
        return cachedTime;
      }
    }

    const token = import.meta.env.VITE_GITHUB_TOKEN;
    const octokit = new Octokit({
       auth: token
    });

    const response = await octokit.repos.listCommits({
      owner: "dieWehmut",
      repo: "nju-edu-ai-system",
      per_page: 1,
    });

    if (response.data && response.data.length > 0) {
      const dateStr = response.data[0].commit.committer?.date || response.data[0].commit.author?.date;
       if (dateStr) {
           localStorage.setItem(CACHE_KEY, dateStr);
           localStorage.setItem(CACHE_TIMESTAMP_KEY, now.toString());
           return dateStr;
       }
    }
  } catch (error) {
    console.error("Failed to fetch github commits", error);
  }
  
  // Return cached value if available even if expired, or null
  return localStorage.getItem(CACHE_KEY);
};
