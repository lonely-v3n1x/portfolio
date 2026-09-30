export interface GitHubProfile {
  username: string;
  url: string;
  bio: string;
  publicRepos: number;
  followers: number;
  avatarUrl: string;
}

export interface Repo {
  id: string;
  name: string;
  language: string;
  stars: number;
  description: string;
  url: string;
  previewUrl?: string;
}

export interface SelectedWorkRepo extends Repo {
  rank: number;
  genre: string;
}

interface GitHubApiProfile {
  login: string;
  html_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  avatar_url: string;
}

interface GitHubApiRepo {
  id: number;
  name: string;
  language: string | null;
  stargazers_count: number;
  description: string | null;
  html_url: string;
}

export const staticProfile: GitHubProfile = {
  username: "lonely-v3n1x",
  url: "https://github.com/lonely-v3n1x",
  bio: "Just a youth from Africa who is extremely interested in Tech",
  publicRepos: 34,
  followers: 24,
  avatarUrl: "https://avatars.githubusercontent.com/u/48265597?v=4",
};

export const staticRepos: Repo[] = [
  {
    id: "findme",
    name: "FindMe",
    language: "TypeScript",
    stars: 0,
    description: "FindMe — resolve Ghana Post GPS digital addresses into places you can find. Live on the web.",
    url: "https://gh-find-me-nu.vercel.app/",
    previewUrl: "https://gh-find-me-nu.vercel.app/",
  },
  {
    id: "gitfetcher",
    name: "gitfetcher",
    language: "Python",
    stars: 0,
    description: "A Python tool to fetch and analyze GitHub repository data",
    url: "https://github.com/lonely-v3n1x/gitfetcher",
  },
  {
    id: "TUI_MusicPlayer",
    name: "TUI_MusicPlayer",
    language: "C",
    stars: 0,
    description: "A terminal-based music player built in C",
    url: "https://github.com/lonely-v3n1x/TUI_MusicPlayer",
  },
  {
    id: "contact-bat",
    name: "contact-bat",
    language: "Python",
    stars: 0,
    description: "A contact management system with batch file integration",
    url: "https://github.com/lonely-v3n1x/contact-bat",
  },
  {
    id: "lvl200-Web-Dev",
    name: "lvl200-Web-Dev",
    language: "PHP",
    stars: 2,
    description: "Level 200 web development project showcasing PHP skills",
    url: "https://github.com/lonely-v3n1x/lvl200-Web-Dev",
  },
  {
    id: "VehicleRentalSystem",
    name: "VehicleRentalSystem",
    language: "Java",
    stars: 0,
    description: "A vehicle rental management system built with Java",
    url: "https://github.com/lonely-v3n1x/VehicleRentalSystem",
  },
  {
    id: "ELK_BLE-CONTROL",
    name: "ELK_BLE-CONTROL",
    language: "Python",
    stars: 1,
    description: "Bluetooth Low Energy control system for ELK devices",
    url: "https://github.com/lonely-v3n1x/ELK_BLE-CONTROL",
  },
  {
    id: "ghpostserver",
    name: "ghpostserver",
    language: "Python",
    stars: 0,
    description: "A Python server for handling GitHub post operations",
    url: "https://github.com/lonely-v3n1x/ghpostserver",
  },
  {
    id: "ShopReceipt_Group_3",
    name: "ShopReceipt_Group_3",
    language: "Java",
    stars: 1,
    description: "A shop receipt generation system - Group 3 project",
    url: "https://github.com/lonely-v3n1x/ShopReceipt_Group_3",
  },
];

export const selectedWorkRepos: SelectedWorkRepo[] = [
  { ...staticRepos[0], rank: 1, genre: "Web App" },
  { ...staticRepos[2], rank: 2, genre: "Application" },
  { ...staticRepos[3], rank: 3, genre: "Utility" },
  { ...staticRepos[6], rank: 4, genre: "IoT" },
  { ...staticRepos[7], rank: 5, genre: "Server" },
  { ...staticRepos[1], rank: 6, genre: "CLI Tool" },
  { ...staticRepos[4], rank: 7, genre: "Web Development" },
  { ...staticRepos[5], rank: 8, genre: "System" },
  { ...staticRepos[8], rank: 9, genre: "System" },
];

export async function fetchGitHubData(): Promise<{
  profile: GitHubProfile;
  repos: Repo[];
}> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const [profileRes, reposRes] = await Promise.all([
      fetch("https://api.github.com/users/lonely-v3n1x", {
        signal: controller.signal,
      }),
      fetch(
        "https://api.github.com/users/lonely-v3n1x/repos?sort=updated&per_page=100",
        { signal: controller.signal }
      ),
    ]);

    if (!profileRes.ok || !reposRes.ok) {
      throw new Error(`GitHub API error: ${profileRes.status} ${reposRes.status}`);
    }

    const profileData = (await profileRes.json()) as GitHubApiProfile;
    const reposData = (await reposRes.json()) as GitHubApiRepo[];

    const profile: GitHubProfile = {
      username: profileData.login,
      url: profileData.html_url,
      bio: profileData.bio ?? "",
      publicRepos: profileData.public_repos,
      followers: profileData.followers,
      avatarUrl: profileData.avatar_url,
    };

    const repos: Repo[] = reposData.map((repo) => ({
      id: String(repo.id),
      name: repo.name,
      language: repo.language ?? "",
      stars: repo.stargazers_count,
      description: repo.description ?? "",
      url: repo.html_url,
    }));

    return { profile, repos };
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function getGitHubData(): Promise<{
  profile: GitHubProfile;
  repos: Repo[];
}> {
  try {
    return await fetchGitHubData();
  } catch {
    return { profile: staticProfile, repos: staticRepos };
  }
}
