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
  previewImage?: string;
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
    description: "Fetch and inspect any GitHub user's profile and repos from the terminal.",
    url: "https://github.com/lonely-v3n1x/gitfetcher",
  },
  {
    id: "TUI_MusicPlayer",
    name: "TUI_MusicPlayer",
    language: "C",
    stars: 0,
    description: "A terminal UI music player in C — no window manager required, just rhythm and raw control.",
    url: "https://github.com/lonely-v3n1x/TUI_MusicPlayer",
  },
  {
    id: "contact-bat",
    name: "contact-bat",
    language: "Python",
    stars: 0,
    description: "A cat-like CLI for viewing .vcf contact files — small, sharp, and straight to the point.",
    url: "https://github.com/lonely-v3n1x/contact-bat",
  },
  {
    id: "ELK_BLE-CONTROL",
    name: "ELK_BLE-CONTROL",
    language: "Python",
    stars: 1,
    description: "A Python script that drives LED strips over Bluetooth — software you can literally see.",
    url: "https://github.com/lonely-v3n1x/ELK_BLE-CONTROL",
  },
  {
    id: "ghpostserver",
    name: "ghpostserver",
    language: "Python",
    stars: 0,
    description: "A Ghana Post digital-address lookup website — the server-side root of FindMe.",
    url: "https://github.com/lonely-v3n1x/ghpostserver",
  },
  {
    id: "grub-theme",
    name: "grub-theme",
    language: "Shell",
    stars: 0,
    description: "A personalized GRUB boot theme — your machine greets you with style before the OS loads.",
    url: "https://github.com/lonely-v3n1x/grub-theme",
  },
  {
    id: "bookorbit",
    name: "bookorbit",
    language: "TypeScript",
    stars: 0,
    description: "BookOrbit — your reading space: a forked ebook reader setup for the personal library.",
    url: "https://github.com/lonely-v3n1x/bookorbit",
  },
];

export const selectedWorkRepos: SelectedWorkRepo[] = [
  { ...staticRepos[0], rank: 1, genre: "Web App" },
  { ...staticRepos[2], rank: 2, genre: "Application" },
  { ...staticRepos[3], rank: 3, genre: "Utility" },
  { ...staticRepos[4], rank: 4, genre: "IoT" },
  { ...staticRepos[5], rank: 5, genre: "Server" },
  { ...staticRepos[1], rank: 6, genre: "CLI Tool" },
  { ...staticRepos[6], rank: 7, genre: "System" },
  { ...staticRepos[7], rank: 8, genre: "Interface" },
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
