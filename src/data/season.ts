export type Quest = {
  id: string;
  rank: "S" | "A" | "B";
  title: string;
  genre: string;
  description: string;
  tags: string[];
  repo: string;
  preview?: string;
};

export type Stat = {
  name: string;
  value: number;
  flavor: string;
};

export const githubProfile = {
  username: "lonely-v3n1x",
  url: "https://github.com/lonely-v3n1x",
  bio: "Just a youth from Africa who is extremely interested in Tech",
  publicRepos: 33,
};

export const quests: Quest[] = [
  {
    id: "findme",
    rank: "S",
    title: "FindMe",
    genre: "Web App / Maps",
    description: "GhanaPostGPS Navigator — ask 'What's My Address?' and get found. Dark green and gold, built for getting around Ghana.",
    tags: ["Web App", "Maps", "GhanaPostGPS"],
    repo: "https://gh-find-me-nu.vercel.app/",
    preview: "/findme-preview.jpg",
  },
  {
    id: "gitfetcher",
    rank: "A",
    title: "gitfetcher",
    genre: "API / Python",
    description: "A simple tool that fetches user info straight from GitHub — fresh off the bench this week.",
    tags: ["Python", "GitHub API", "CLI"],
    repo: "https://github.com/lonely-v3n1x/gitfetcher",
  },
  {
    id: "contact-bat",
    rank: "A",
    title: "contact-bat",
    genre: "CLI / Python",
    description: "A cat-like tool for viewing .vcf contact files. Small, sharp, straight to the point.",
    tags: ["Python", "CLI", "parsing"],
    repo: "https://github.com/lonely-v3n1x/contact-bat",
  },
  {
    id: "tui-musicplayer",
    rank: "S",
    title: "TUI_MusicPlayer",
    genre: "Systems / C",
    description: "A simple terminal UI music player in C — actively hacked on this week. No window manager required.",
    tags: ["C", "TUI", "audio"],
    repo: "https://github.com/lonely-v3n1x/TUI_MusicPlayer",
  },
  {
    id: "elk-ble-control",
    rank: "A",
    title: "ELK_BLE-CONTROL",
    genre: "Hardware / Python",
    description: "Drives LED strips over Bluetooth. Software you can literally see.",
    tags: ["Python", "BLE", "hardware"],
    repo: "https://github.com/lonely-v3n1x/ELK_BLE-CONTROL",
  },
  {
    id: "vehicle-rental",
    rank: "B",
    title: "VehicleRentalSystem",
    genre: "Desktop / Java",
    description: "A full vehicle-rental app in Java Swing. Forms, state, and all the unglamorous craft.",
    tags: ["Java", "Swing", "desktop"],
    repo: "https://github.com/lonely-v3n1x/VehicleRentalSystem",
  },
  {
    id: "xv6-riscv",
    rank: "S",
    title: "xv6-riscv",
    genre: "OS / C",
    description: "Hands inside a real teaching operating system for RISC-V. Curiosity meets the kernel.",
    tags: ["C", "RISC-V", "OS"],
    repo: "https://github.com/lonely-v3n1x/xv6-riscv",
  },
];

export const stats: Stat[] = [
  { name: "FRONTEND", value: 100, flavor: "React / Next.js / TypeScript" },
  { name: "MOTION", value: 100, flavor: "GSAP / Anime.js / Three.js" },
  { name: "LINUX", value: 100, flavor: "daily driver / terminal native" },
  { name: "SYSTEMS", value: 100, flavor: "C / Python / low-level curiosity" },
  { name: "BACKEND", value: 100, flavor: "Python / Node / Postgres" },
  { name: "DEVOPS", value: 100, flavor: "Git / GitHub / CI" },
];
