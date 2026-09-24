export function ArrowUpRight({ size = 18 }: { size?: number }) {
  return (
    <svg aria-hidden="true" fill="none" height={size} viewBox="0 0 24 24" width={size}>
      <path d="M5 19 19 5M8 5h11v11" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  );
}

export function ArrowDown({ size = 18 }: { size?: number }) {
  return (
    <svg aria-hidden="true" fill="none" height={size} viewBox="0 0 24 24" width={size}>
      <path d="M12 4v16m0 0 6-6m-6 6-6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  );
}

export function PlusIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  );
}

export function MenuIcon({ open = false }: { open?: boolean }) {
  return (
    <svg aria-hidden="true" fill="none" height="22" viewBox="0 0 24 24" width="22">
      <path d={open ? "M6 6 18 18M18 6 6 18" : "M4 7h16M4 12h16M4 17h16"} stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  );
}

export function GithubIcon() {
  return (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 .7a11.3 11.3 0 0 0-3.58 22.02c.57.1.78-.25.78-.55v-2.15c-3.18.69-3.85-1.35-3.85-1.35-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.33.96.1-.74.4-1.25.73-1.54-2.54-.29-5.2-1.27-5.2-5.65 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.16 1.17a10.98 10.98 0 0 1 5.76 0c2.2-1.48 3.16-1.17 3.16-1.17.62 1.57.23 2.73.11 3.02.73.8 1.18 1.82 1.18 3.07 0 4.39-2.67 5.36-5.21 5.65.41.35.77 1.05.77 2.12v3.14c0 .3.21.66.79.55A11.3 11.3 0 0 0 12 .7Z" />
    </svg>
  );
}

export function MailIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20">
      <path d="M4 6.5h16v11H4z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.6" />
      <path d="m4.5 7 7.5 6 7.5-6" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.6" />
    </svg>
  );
}

export function SparkIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24">
      <path d="m12 2 1.8 7.4L21 12l-7.2 2.6L12 22l-1.8-7.4L3 12l7.2-2.6L12 2Z" fill="currentColor" />
    </svg>
  );
}
