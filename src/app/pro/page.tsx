import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { staticProfile, selectedWorkRepos } from "@/data/github";

const SkillsGroup = ({
  title,
  items,
}: {
  title: string;
  items: { name: string }[];
}) => {
  return (
    <section
      style={{
        padding: "clamp(4.5rem, 10vw, 8rem) clamp(1.25rem, 5vw, 4rem)",
        background: "var(--night)",
        color: "var(--paper)",
        borderTop: "1px solid var(--line)",
      }}
    >
      <header
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "1.5rem",
          marginBottom: "clamp(2.5rem, 5vw, 4rem)",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-dm-mono)",
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "color-mix(in srgb, var(--paper) 54%, transparent)",
            }}
          >
            {title}
          </p>
          <h2
            style={{
              margin: 0,
              fontFamily: "var(--font-archivo-black)",
              fontSize: "clamp(2.25rem, 7vw, 5.5rem)",
              lineHeight: 0.86,
              letterSpacing: "-0.035em",
              textTransform: "uppercase",
            }}
          >
            {title}
          </h2>
        </div>
      </header>

      <ul style={{ listStyle: "none", margin: 0, padding: "0 2rem" }}>
        {items.map((item) => (
          <li
            key={item.name}
            style={{
              display: "grid",
              gap: "0.75rem",
              marginBottom: "0.75rem",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-dm-mono)",
                fontSize: "clamp(1rem, 2.4vw, 1.5rem)",
                letterSpacing: "-0.02em",
                color: "var(--paper)",
              }}
            >
              {item.name}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export const metadata: Metadata = {
  title: "Yussif Sare — Profile",
  description: "Yussif Sare — Frontend Developer. Profile, selected work, experience, and skills.",
};

export default function ProPage() {
  return (
    <>
      <header style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: "var(--night)",
          borderBottom: "1px solid var(--line)",
        }}>
          <nav style={{
            padding: "0 clamp(1rem, 5vw, 2rem)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            maxWidth: "clamp(64rem, 90vw, 80rem)",
            margin: "0 auto",
          }}>
            <a
              href="/"
              style={{
                fontFamily: "var(--font-archivo-black)",
                fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                textDecoration: "none",
                color: "var(--paper)",
              }}
            >
              YS
            </a>
            <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
              <a
                href="/"
                style={{
                  fontFamily: "var(--font-dm-mono)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--night)",
                  background: "var(--acid)",
                  borderRadius: 999,
                  padding: "0.5rem 1rem",
                  textDecoration: "none",
                }}
              >
                ← Main site
              </a>
              <a
                href="https://github.com/lonely-v3n1x"
                target="_blank"
                rel="noreferrer"
                style={{
                  fontFamily: "var(--font-dm-mono)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--paper)",
                }}
              >
                GitHub
              </a>
            </div>
          </nav>
        </header>

        <main style={{ padding: "clamp(4rem, 8vw, 12rem) clamp(1rem, 5vw, 2rem)" }}>
          {/* Hero / intro */}
          <section style={{
            marginBottom: "clamp(4rem, 8vw, 8rem)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "clamp(1rem, 3vw, 2rem)", flexWrap: "wrap" }}>
            <Image
              src={staticProfile.avatarUrl}
              alt="Portrait of Yussif Sare, frontend developer"
              width={160}
              height={160}
              priority
              style={{
                width: "clamp(96px, 18vw, 160px)",
                height: "clamp(96px, 18vw, 160px)",
                objectFit: "cover",
                borderRadius: "50%",
                border: "2px solid var(--line)",
                filter: "grayscale(1) contrast(1.08)",
              }}
            />
            <h1
              style={{
                margin: 0,
                fontFamily: "var(--font-archivo-black)",
                fontSize: "clamp(3rem, 8vw, 5rem)",
                lineHeight: 1,
                letterSpacing: "-0.03em",
                color: "var(--paper)",
              }}
            >
              {staticProfile.username}
            </h1>
            </div>
            <p
              style={{
                margin: "1.5rem 0 0",
                maxWidth: "48ch",
                fontFamily: "var(--font-dm-mono)",
                fontSize: "0.95rem",
                lineHeight: 1.6,
                color: "color-mix(in srgb, var(--paper) 40%, transparent)",
              }}
            >
              {staticProfile.bio}
            </p>
          </section>

          {/* Selected Work */}
          <section id="selected-work" style={{ marginBottom: "clamp(4rem, 8vw, 8rem)" }}>
            <header
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: "1.5rem",
                marginBottom: "clamp(2.5rem, 5vw, 4rem)",
              }}
            >
              <div style={{ display: "grid", gap: "0.9rem" }}>
                <span
                  style={{
                    fontFamily: "var(--font-dm-mono)",
                    fontSize: "0.7rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "color-mix(in srgb, var(--paper) 54%, transparent)",
                  }}
                >
                  Selected Work — {selectedWorkRepos.length} repos
                </span>
                <h2
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-archivo-black)",
                    fontSize: "clamp(2.25rem, 7vw, 5.5rem)",
                    lineHeight: 0.86,
                    letterSpacing: "-0.035em",
                    textTransform: "uppercase",
                  }}
                >
                  Selected
                  <br />
                  <span style={{ color: "var(--red)" }}>Work</span>
                </h2>
              </div>
            </header>

            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {selectedWorkRepos.map((repo) => (
                <li
                  key={repo.id}
                  style={{
                    marginBottom: "clamp(1.5rem, 4vw, 2.5rem)",
                    paddingBottom: "clamp(1.5rem, 4vw, 2.5rem)",
                    borderBottom: "1px solid var(--line)",
                  }}
                >
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "3rem minmax(0, 1fr) 2.75rem",
                      gap: "clamp(0.75rem, 2vw, 2rem)",
                      alignItems: "start",
                      padding: "clamp(1.25rem, 2.6vw, 2rem) 0 clamp(1.25rem, 2.6vw, 2rem) clamp(0.75rem, 1.6vw, 1.25rem)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-dm-mono)",
                        fontSize: "0.8rem",
                        letterSpacing: "0.1em",
                        color: "color-mix(in srgb, var(--paper) 54%, transparent)",
                      }}
                    >
                      {String(repo.rank ?? repo.id).padStart(2, "0")}
                    </span>

                    <span style={{ display: "grid", gap: "0.6rem" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-dm-mono)",
                          fontSize: "0.7rem",
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          color: "color-mix(in srgb, var(--paper) 54%, transparent)",
                        }}
                      >
                        {repo.genre || "Project"}
                      </span>

                      <span
                        style={{
                          fontFamily: "var(--font-archivo-black)",
                          fontSize: "clamp(1.4rem, 3.4vw, 2.5rem)",
                          lineHeight: 0.95,
                          letterSpacing: "-0.02em",
                          textTransform: "uppercase",
                          color: "var(--paper)",
                        }}
                      >
                        {repo.name}
                      </span>

                      <span
                        style={{
                          maxWidth: "48ch",
                          fontSize: "0.95rem",
                          lineHeight: 1.55,
                          color: "color-mix(in srgb, var(--paper) 54%, transparent)",
                        }}
                      >
                        {repo.description}
                      </span>

                      <span
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          gap: "0.9rem",
                          fontFamily: "var(--font-dm-mono)",
                          fontSize: "0.68rem",
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          color: "color-mix(in srgb, var(--paper) 54%, transparent)",
                        }}
                        >
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}>
                          <span
                            style={{
                              width: "8px",
                              height: "8px",
                              background:
                                repo.language === "Python"
                                  ? "var(--cobalt)"
                                  : repo.language === "Java"
                                  ? "var(--red)"
                                  : repo.language === "C"
                                  ? "var(--acid)"
                                  : repo.language === "PHP"
                                  ? "var(--paper)"
                                  : "var(--line)",
                            }}
                          />
                          {repo.language || "Unknown"}
                        </span>
                        <span aria-hidden="true">|</span>
                        <span style={{ color: repo.stars > 0 ? "var(--acid)" : "color-mix(in srgb, var(--paper) 54%, transparent)" }}>
                          ★ {repo.stars}
                        </span>
                      </span>
                    </span>

                    <span
                      style={{
                        justifySelf: "end",
                        fontSize: "1.6rem",
                        lineHeight: 1,
                        color: "var(--paper)",
                      }}
                    >
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>

          {/* Experience Timeline */}
          <section id="experience" style={{ marginBottom: "clamp(4rem, 8vw, 8rem)" }}>
            <header
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: "1.5rem",
                marginBottom: "clamp(2.75rem, 6vw, 4.5rem)",
              }}
            >
              <div style={{ display: "grid", gap: "0.9rem" }}>
                <span
                  style={{
                    fontFamily: "var(--font-dm-mono)",
                    fontSize: "0.7rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "color-mix(in srgb, var(--paper) 54%, transparent)",
                  }}
                >
                  03 / Experience — 4 entries
                </span>
                <h2
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-archivo-black)",
                    fontSize: "clamp(2.25rem, 7vw, 5.5rem)",
                    lineHeight: 0.86,
                    letterSpacing: "-0.035em",
                    textTransform: "uppercase",
                  }}
                >
                  The
                  <br />
                  <span style={{ color: "var(--red)" }}>Long</span>
                  <br />
                  Way Round
                </h2>
              </div>
            </header>

            <ol style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "grid",
              gap: "clamp(2.25rem, 5vw, 3.5rem)",
            }}>
              <li style={{
                position: "relative",
                display: "grid",
                gridTemplateColumns: "clamp(5.5rem, 14vw, 10rem) minmax(0, 1fr)",
                columnGap: "clamp(1rem, 2.5vw, 2.25rem)",
                alignItems: "start",
              }}>
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: "clamp(5.5rem, 14vw, 10rem)",
                    top: "0.3rem",
                    width: "9px",
                    height: "9px",
                    marginLeft: "-4.5px",
                    background: "var(--night)",
                    border: "1px solid var(--red)",
                  }}
                />

                <p style={{
                  fontFamily: "var(--font-dm-mono)",
                  fontSize: "0.68rem",
                  lineHeight: 1.5,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "color-mix(in srgb, var(--paper) 54%, transparent)",
                }}>
                  <span style={{ color: "var(--red)" }}>2019</span>
                  <span> — ATU · Level 200</span>
                </p>

                <div style={{
                  display: "grid",
                  gap: "0.85rem",
                }}>
                  <h3
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-archivo-black)",
                      fontSize: "clamp(1.35rem, 3.2vw, 2.35rem)",
                      lineHeight: 0.98,
                      letterSpacing: "-0.025em",
                      textTransform: "uppercase",
                      color: "var(--paper)",
                    }}
                  >
                    Web Development
                  </h3>
                  <p
                    style={{
                      maxWidth: "52ch",
                      margin: 0,
                      fontSize: "0.95rem",
                      lineHeight: 1.6,
                      color: "color-mix(in srgb, var(--paper) 54%, transparent)",
                    }}
                  >
                    Accra Technical University. Semesters of broken layouts, semantically nested everything, and the lesson that structure has to come before style ever touches it.
                  </p>

                  <span style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        border: "1px solid var(--line)",
                        fontFamily: "var(--font-dm-mono)",
                        fontSize: "0.62rem",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "color-mix(in srgb, var(--paper) 54%, transparent)",
                      }}
                    >
                      HTML
                    </span>
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        border: "1px solid var(--line)",
                        fontFamily: "var(--font-dm-mono)",
                        fontSize: "0.62rem",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "color-mix(in srgb, var(--paper) 54%, transparent)",
                      }}
                    >
                      CSS
                    </span>
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        border: "1px solid var(--line)",
                        fontFamily: "var(--font-dm-mono)",
                        fontSize: "0.62rem",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "color-mix(in srgb, var(--paper) 54%, transparent)",
                      }}
                    >
                      JavaScript
                    </span>
                  </span>
                </div>
              </li>

              <li style={{
                position: "relative",
                display: "grid",
                gridTemplateColumns: "clamp(5.5rem, 14vw, 10rem) minmax(0, 1fr)",
                columnGap: "clamp(1rem, 2.5vw, 2.25rem)",
                alignItems: "start",
              }}>
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: "clamp(5.5rem, 14vw, 10rem)",
                    top: "0.3rem",
                    width: "9px",
                    height: "9px",
                    marginLeft: "-4.5px",
                    background: "var(--night)",
                    border: "1px solid var(--red)",
                  }}
                />

                <p style={{
                  fontFamily: "var(--font-dm-mono)",
                  fontSize: "0.68rem",
                  lineHeight: 1.5,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "color-mix(in srgb, var(--paper) 54%, transparent)",
                }}>
                  <span style={{ color: "var(--red)" }}>2020</span>
                  <span> — Terminal</span>
                </p>

                <div style={{
                  display: "grid",
                  gap: "0.85rem",
                }}>
                  <h3
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-archivo-black)",
                      fontSize: "clamp(1.35rem, 3.2vw, 2.35rem)",
                      lineHeight: 0.98,
                      letterSpacing: "-0.025em",
                      textTransform: "uppercase",
                      color: "var(--paper)",
                    }}
                  >
                    First CLI Contact
                  </h3>
                  <p
                    style={{
                      maxWidth: "52ch",
                      margin: 0,
                      fontSize: "0.95rem",
                      lineHeight: 1.6,
                      color: "color-mix(in srgb, var(--paper) 54%, transparent)",
                    }}
                  >
                    The first time a terminal actually answered back. Git, npm, remote deploys by command line — and a 2am build failure I had absolutely not earned yet.
                  </p>

                  <span style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        border: "1px solid var(--line)",
                        fontFamily: "var(--font-dm-mono)",
                        fontSize: "0.62rem",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "color-mix(in srgb, var(--paper) 54%, transparent)",
                      }}
                    >
                      Bash
                    </span>
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        border: "1px solid var(--line)",
                        fontFamily: "var(--font-dm-mono)",
                        fontSize: "0.62rem",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "color-mix(in srgb, var(--paper) 54%, transparent)",
                      }}
                    >
                      Git
                    </span>
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        border: "1px solid var(--line)",
                        fontFamily: "var(--font-dm-mono)",
                        fontSize: "0.62rem",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "color-mix(in srgb, var(--paper) 54%, transparent)",
                      }}
                    >
                      npm
                    </span>
                  </span>
                </div>
              </li>

              <li style={{
                position: "relative",
                display: "grid",
                gridTemplateColumns: "clamp(5.5rem, 14vw, 10rem) minmax(0, 1fr)",
                columnGap: "clamp(1rem, 2.5vw, 2.25rem)",
                alignItems: "start",
              }}>
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: "clamp(5.5rem, 14vw, 10rem)",
                    top: "0.3rem",
                    width: "9px",
                    height: "9px",
                    marginLeft: "-4.5px",
                    background: "var(--night)",
                    border: "1px solid var(--red)",
                  }}
                />

                <p style={{
                  fontFamily: "var(--font-dm-mono)",
                  fontSize: "0.68rem",
                  lineHeight: 1.5,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "color-mix(in srgb, var(--paper) 54%, transparent)",
                }}>
                  <span style={{ color: "var(--red)" }}>2024</span>
                  <span> — Season 01</span>
                </p>

                <div style={{
                  display: "grid",
                  gap: "0.85rem",
                }}>
                  <h3
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-archivo-black)",
                      fontSize: "clamp(1.35rem, 3.2vw, 2.35rem)",
                      lineHeight: 0.98,
                      letterSpacing: "-0.025em",
                      textTransform: "uppercase",
                      color: "var(--paper)",
                    }}
                  >
                    Frontend Motion
                  </h3>
                  <p
                    style={{
                      maxWidth: "52ch",
                      margin: 0,
                      fontSize: "0.95rem",
                      lineHeight: 1.6,
                      color: "color-mix(in srgb, var(--paper) 54%, transparent)",
                    }}
                  >
                    Where static layouts stopped being enough. GSAP timelines, scroll-linked sequences, easing discipline — and the rule that every one of them dies for reduced motion.
                  </p>

                  <span style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        border: "1px solid var(--line)",
                        fontFamily: "var(--font-dm-mono)",
                        fontSize: "0.62rem",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "color-mix(in srgb, var(--paper) 54%, transparent)",
                      }}
                    >
                      GSAP
                    </span>
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        border: "1px solid var(--line)",
                        fontFamily: "var(--font-dm-mono)",
                        fontSize: "0.62rem",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "color-mix(in srgb, var(--paper) 54%, transparent)",
                      }}
                    >
                      ScrollTrigger
                    </span>
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        border: "1px solid var(--line)",
                        fontFamily: "var(--font-dm-mono)",
                        fontSize: "0.62rem",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "color-mix(in srgb, var(--paper) 54%, transparent)",
                      }}
                    >
                      Motion
                    </span>
                  </span>
                </div>
              </li>

              <li style={{
                position: "relative",
                display: "grid",
                gridTemplateColumns: "clamp(5.5rem, 14vw, 10rem) minmax(0, 1fr)",
                columnGap: "clamp(1rem, 2.5vw, 2.25rem)",
                alignItems: "start",
              }}>
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: "clamp(5.5rem, 14vw, 10rem)",
                    top: "0.3rem",
                    width: "9px",
                    height: "9px",
                    marginLeft: "-4.5px",
                    background: "var(--night)",
                    border: "1px solid var(--red)",
                  }}
                />

                <p style={{
                  fontFamily: "var(--font-dm-mono)",
                  fontSize: "0.68rem",
                  lineHeight: 1.5,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "color-mix(in srgb, var(--paper) 54%, transparent)",
                }}>
                  <span style={{ color: "var(--red)" }}>2026</span>
                  <span> — Now</span>
                </p>

                <div style={{
                  display: "grid",
                  gap: "0.85rem",
                }}>
                  <h3
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-archivo-black)",
                      fontSize: "clamp(1.35rem, 3.2vw, 2.35rem)",
                      lineHeight: 0.98,
                      letterSpacing: "-0.025em",
                      textTransform: "uppercase",
                      color: "var(--paper)",
                    }}
                  >
                    Open For Work
                  </h3>
                  <p
                    style={{
                      maxWidth: "52ch",
                      margin: 0,
                      fontSize: "0.95rem",
                      lineHeight: 1.6,
                      color: "color-mix(in srgb, var(--paper) 54%, transparent)",
                    }}
                  >
                    Looking for a frontend role where craft counts: motion, accessibility, and a team that reads the brief twice before shipping once.
                  </p>

                  <span style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        border: "1px solid var(--line)",
                        fontFamily: "var(--font-dm-mono)",
                        fontSize: "0.62rem",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "color-mix(in srgb, var(--paper) 54%, transparent)",
                      }}
                    >
                      Available
                    </span>
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        border: "1px solid var(--line)",
                        fontFamily: "var(--font-dm-mono)",
                        fontSize: "0.62rem",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "color-mix(in srgb, var(--paper) 54%, transparent)",
                      }}
                    >
                      Remote
                    </span>
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        border: "1px solid var(--line)",
                        fontFamily: "var(--font-dm-mono)",
                        fontSize: "0.62rem",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "color-mix(in srgb, var(--paper) 54%, transparent)",
                      }}
                    >
                      Frontend
                    </span>
                  </span>
                </div>
              </li>
            </ol>
          </section>

          {/* Skills Groups */}
          <SkillsGroup
            title="Frontend"
            items={[
              { name: "React" },
              { name: "Next.js" },
              { name: "TypeScript" },
              { name: "Tailwind CSS" },
            ]}
          />
          <SkillsGroup
            title="Motion"
            items={[
              { name: "GSAP" },
              { name: "ScrollTrigger" },
              { name: "CSS Animations" },
            ]}
          />
          <SkillsGroup
            title="Systems"
            items={[
              { name: "C" },
              { name: "Python" },
              { name: "Bash" },
            ]}
          />
        </main>

        <footer style={{
          marginTop: "clamp(4rem, 8vw, 8rem)",
          padding: "clamp(2rem, 4vw, 3rem) 0",
          borderTop: "1px solid var(--line)",
          textAlign: "center",
        }}>
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-dm-mono)",
              fontSize: "0.7rem",
              lineHeight: 1.8,
              color: "color-mix(in srgb, var(--paper) 40%, transparent)",
            }}
          >
            Built with {staticProfile.username}.{" "}
            <Link
              href="/"
              style={{
                color: "var(--red)",
                textDecoration: "underline",
              }}
            >
              Back home
            </Link>
          </p>
        </footer>
    </>
  );
}