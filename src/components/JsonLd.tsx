import { SITE_NAME, SITE_URL } from "@/lib/site";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  jobTitle: "Frontend Developer",
  description:
    "Frontend developer from Accra, Ghana. Interfaces with weight, motion and intent.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Accra",
    addressCountry: "GH",
  },
  sameAs: ["https://github.com/lonely-v3n1x"],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  description:
    "Yussif Sare, frontend developer from Accra, Ghana. Profile, arsenal, quests, and contact.",
};

export default function JsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
