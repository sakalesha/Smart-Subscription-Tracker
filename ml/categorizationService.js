import Fuse from "fuse.js";

// Lookup table of common services and categories
const serviceDatabase = [
  { name: "Netflix", category: "Entertainment" },
  { name: "Spotify", category: "Music" },
  { name: "Amazon Prime", category: "Entertainment" },
  { name: "Disney+", category: "Entertainment" },
  { name: "YouTube Premium", category: "Entertainment" },
  { name: "Apple Music", category: "Music" },
  { name: "Adobe Creative Cloud", category: "Software" },
  { name: "Microsoft 365", category: "Software" },
  { name: "Google One", category: "Cloud" },
  { name: "Dropbox", category: "Cloud" },
  { name: "iCloud", category: "Cloud" },
  { name: "Zoom", category: "Software" },
  { name: "Slack", category: "Software" },
  { name: "GitHub", category: "Software" },
  { name: "ChatGPT Plus", category: "Software" },
  { name: "Midjourney", category: "Software" },
  { name: "Canva", category: "Software" },
  { name: "LinkedIn Premium", category: "Software" },
  { name: "PlayStation Plus", category: "Gaming" },
  { name: "Xbox Game Pass", category: "Gaming" },
  { name: "Nintendo Switch Online", category: "Gaming" },
  { name: "Steam", category: "Gaming" },
  { name: "Discord Nitro", category: "Entertainment" },
  { name: "Twitch", category: "Entertainment" },
  { name: "Hotstar", category: "Entertainment" },
  { name: "JioSaavn", category: "Music" },
  { name: "Gaana", category: "Music" },
  { name: "Tidal", category: "Music" },
  { name: "Hulu", category: "Entertainment" },
  { name: "HBO Max", category: "Entertainment" },
  { name: "Paramount+", category: "Entertainment" },
  { name: "Peacock", category: "Entertainment" },
  { name: "NY Times", category: "News" },
  { name: "Wall Street Journal", category: "News" },
  { name: "The Economist", category: "News" },
  { name: "Medium", category: "News" },
  { name: "Evernote", category: "Software" },
  { name: "Notion", category: "Software" },
  { name: "Duolingo", category: "Education" },
  { name: "Coursera", category: "Education" },
  { name: "Udemy", category: "Education" },
  { name: "Skillshare", category: "Education" },
  { name: "Gold's Gym", category: "Health" },
  { name: "Cult.fit", category: "Health" },
  { name: "Headspace", category: "Health" },
  { name: "Calm", category: "Health" }
];

const fuseOptions = {
  keys: ["name"],
  threshold: 0.4,
  includeScore: true
};

const fuse = new Fuse(serviceDatabase, fuseOptions);

export const categorizeService = (serviceName) => {
  if (!serviceName || serviceName.length < 2) {
    return { category: "Other", confidence: 0 };
  }

  const results = fuse.search(serviceName);

  if (results.length > 0) {
    const bestMatch = results[0];
    return {
      category: bestMatch.item.category,
      confidence: 1 - bestMatch.score
    };
  }

  return { category: "Other", confidence: 0 };
};
