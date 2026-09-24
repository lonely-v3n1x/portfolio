export type SpecimenType = "Motion" | "Interface" | "Type" | "System";

export type SpecimenAccent = "cobalt" | "coral" | "acid" | "sky" | "ink";

export type Specimen = {
  id: string;
  number: string;
  title: string;
  type: SpecimenType;
  date: string;
  status: "active" | "study" | "archive";
  description: string;
  tags: string[];
  accent: SpecimenAccent;
  visual: "kinetic" | "magnetic" | "wipe" | "stack" | "cursor" | "grid";
  repo: string;
};

export const githubProfile = {
  username: "lonely-v3n1x",
  url: "https://github.com/lonely-v3n1x",
  bio: "Just a youth from Africa who is extremely interested in Tech",
  publicRepos: 33,
};

export const specimens: Specimen[] = [
  {
    id: "contact-bat",
    number: "001",
    title: "contact-bat",
    type: "Interface",
    date: "08.26",
    status: "active",
    description: "A cat-like CLI for viewing .vcf contact files — small, sharp, and straight to the point.",
    tags: ["Python", "CLI", "parsing"],
    accent: "coral",
    visual: "kinetic",
    repo: "https://github.com/lonely-v3n1x/contact-bat",
  },
  {
    id: "tui-musicplayer",
    number: "002",
    title: "TUI_MusicPlayer",
    type: "System",
    date: "06.25",
    status: "study",
    description: "A terminal UI music player in C — no window manager required, just rhythm and raw control.",
    tags: ["C", "TUI", "audio"],
    accent: "cobalt",
    visual: "magnetic",
    repo: "https://github.com/lonely-v3n1x/TUI_MusicPlayer",
  },
  {
    id: "elk-ble-control",
    number: "003",
    title: "ELK_BLE-CONTROL",
    type: "System",
    date: "01.26",
    status: "study",
    description: "A Python script that drives LED strips over Bluetooth — software you can literally see.",
    tags: ["Python", "BLE", "hardware"],
    accent: "acid",
    visual: "wipe",
    repo: "https://github.com/lonely-v3n1x/ELK_BLE-CONTROL",
  },
  {
    id: "ghpostserver",
    number: "004",
    title: "ghpostserver",
    type: "Interface",
    date: "10.25",
    status: "archive",
    description: "A small website that resolves Ghana Post digital addresses into places you can find.",
    tags: ["Python", "web", "APIs"],
    accent: "sky",
    visual: "stack",
    repo: "https://github.com/lonely-v3n1x/ghpostserver",
  },
  {
    id: "vehicle-rental",
    number: "005",
    title: "VehicleRentalSystem",
    type: "Interface",
    date: "02.26",
    status: "archive",
    description: "A full vehicle-rental desktop app in Java Swing — forms, state, and all the unglamorous craft.",
    tags: ["Java", "Swing", "desktop"],
    accent: "ink",
    visual: "cursor",
    repo: "https://github.com/lonely-v3n1x/VehicleRentalSystem",
  },
  {
    id: "xv6-riscv",
    number: "006",
    title: "xv6-riscv",
    type: "System",
    date: "01.26",
    status: "archive",
    description: "Hands inside a real teaching operating system for RISC-V — where curiosity meets the kernel.",
    tags: ["C", "RISC-V", "OS"],
    accent: "cobalt",
    visual: "grid",
    repo: "https://github.com/lonely-v3n1x/xv6-riscv",
  },
];

export const specimenFilters: Array<"All" | SpecimenType> = ["All", "Motion", "Interface", "Type", "System"];

export const archivePrinciples = [
  { number: "A", title: "Make the state visible", detail: "A good transition tells you what changed, where it came from, and what can happen next." },
  { number: "B", title: "Keep the edges human", detail: "Performance and accessibility are not constraints on expression. They are part of the expression." },
  { number: "C", title: "Leave a little weather", detail: "Perfectly predictable is useful. A little atmosphere is what makes an interface memorable." },
];
