"use client";

import { GitHubProfile, getGitHubData, staticProfile } from "@/data/github";
import { useState, useEffect, useRef } from "react";
import { gsap, shouldAnimate, useGSAP } from "@/lib/animations";
import { useMagnetic, useRipple, useWipeReveals } from "./motion";

const CONTACT_CSS = `
.contact-ripple { position: relative; display: inline-flex; align-items: center; justify-content: center; overflow: hidden; }
`;

export function Contact() {
  const headingRef = useRef<HTMLSpanElement>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  const fallbackProfile: GitHubProfile = {
    username: "lonely-v3n1x",
    url: "https://github.com/lonely-v3n1x",
    bio: "Just a youth from Africa who is extremely interested in Tech",
    publicRepos: 34,
    followers: 24,
    avatarUrl: "https://avatars.githubusercontent.com/u/48265597?v=4",
  };

// Server-safe: fetch GitHub data on client only, fall back to static vars
  const [profile, setProfile] = useState<GitHubProfile>(staticProfile);

  useEffect(() => {
    async function loadProfile() {
      try {
        const { profile: fetchedProfile } = await getGitHubData();
        setProfile(fetchedProfile);
      } catch {
        setProfile(fallbackProfile);
      }
    }
    loadProfile();
  }, []);

  useGSAP(() => {
    const heading = headingRef.current;
    if (!heading || !shouldAnimate()) return;

    // Play-once: a scrub can't reliably complete at the bottom of the page.
    gsap.fromTo(
      heading,
      { yPercent: 108 },
      {
        yPercent: 0,
        duration: 0.9,
        ease: "expo.out",
        scrollTrigger: { trigger: heading, start: "top 92%", once: true },
      },
    );
  }, []);

  useWipeReveals(sectionRef);
  useMagnetic(sectionRef, { pull: 0.26, reach: 100 });
  useRipple(sectionRef);

  return (
    <section
      id="contact"
      ref={sectionRef}
      style={{
        position: "relative",
        padding: "clamp(5rem, 12vh, 8rem) clamp(1.25rem, 5vw, 2.5rem)",
      }}
    >
      <style>{CONTACT_CSS}</style>
      <div style={{ maxWidth: "56rem", margin: "0 auto" }}>
        {/* CTA */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h2
            style={{
              margin: "0 0 1rem",
              fontFamily: "var(--font-archivo-black)",
              fontSize: "clamp(2.75rem, 8vw, 5.5rem)",
              lineHeight: 0.9,
              letterSpacing: "-0.02em",
              color: "var(--paper)",
            }}
          >
            <span style={{ display: "block", overflow: "hidden" }}>
              <span ref={headingRef} style={{ display: "block", willChange: "transform" }}>
                SEND A SIGNAL
              </span>
            </span>
          </h2>
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-dm-mono)",
              fontSize: "0.95rem",
              lineHeight: 1.6,
              color: "color-mix(in srgb, var(--paper) 60%, transparent)",
            }}
          >
            Reach out via email or explore my work on GitHub.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "1rem",
              marginTop: "2.5rem",
            }}
          >
            <a
              href="mailto:hello@example.com?subject=Hello%20from%20portfolio"
              data-magnetic
              data-ripple
              data-cursor-label="email me"
              className="contact-ripple"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0.85rem 2rem",
                border: "1px solid var(--red)",
                borderRadius: 999,
                fontFamily: "var(--font-dm-mono)",
                fontSize: "0.75rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--red)",
                textDecoration: "none",
              }}
            >
              Email
            </a>

            <a
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              data-magnetic
              data-cursor-label="open"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0.85rem 2rem",
                border: "1px solid var(--cobalt)",
                borderRadius: 999,
                fontFamily: "var(--font-dm-mono)",
                fontSize: "0.75rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--paper)",
                background: "color-mix(in srgb, var(--cobalt) 22%, transparent)",
                textDecoration: "none",
              }}
            >
              GitHub
            </a>
          </div>
        </div>

        {/* Contact section */}
        <div style={{ marginTop: "5rem", textAlign: "center" }}>
          <h2
            style={{
              margin: "0 0 1rem",
              fontFamily: "var(--font-archivo-black)",
              fontSize: "clamp(1.75rem, 5vw, 2.75rem)",
              lineHeight: 1,
              color: "var(--paper)",
            }}
          >
            Get in Touch
          </h2>
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-dm-mono)",
              fontSize: "0.9rem",
              lineHeight: 1.6,
              color: "color-mix(in srgb, var(--paper) 60%, transparent)",
            }}
          >
            I&apos;m currently open to frontend development opportunities. Let&apos;s connect!
          </p>

          {/* Back to Top */}
          <div style={{ marginTop: "3rem" }}>
            <a
              href="#top"
              data-magnetic
              data-ripple
              className="contact-ripple"
              id="back-to-top"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                border: "1px solid var(--red)",
                borderRadius: 999,
                padding: "0.7rem 1.4rem",
                fontFamily: "var(--font-dm-mono)",
                fontSize: "0.75rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--paper)",
                textDecoration: "none",
              }}
            >
              ← TO BE CONTINUED
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}