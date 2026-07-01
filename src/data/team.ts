export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string[];
  image: string;
  company?: string;
  companyUrl?: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: "zeno-martinez",
    name: "Zeno Martinez",
    role: "Marketing & Creative Consultant",
    bio: [
      "Zeno is a strategic marketing and creative media professional with a sharp eye for brand storytelling, public relations, and digital-first campaigns. He brings a holistic approach to marketing — blending data-driven strategy with compelling visual narratives that resonate across platforms.",
      "As the founder of Zenlabs, a creative and technology agency, Zeno leads end-to-end brand development, from concept and identity design to full-scale media production and campaign execution. His work spans corporate communications, event marketing, social media strategy, and creative direction — helping organizations build authentic connections with their audiences.",
    ],
    image: "/images/team/Zeno.png",
    company: "Founder, Zenlabs",
    companyUrl: "https://zenlabs.me/",
  },
  {
    id: "jeff-martinez",
    name: "Jeff Martinez",
    role: "IT / Technical Team Lead",
    bio: [
      "Jeff is a full-stack engineer and systems thinker with deep expertise in high-performance web architecture, scalable backend design, and user-centric digital product development. He bridges the gap between technical precision and product vision — building systems that are not only fast and resilient, but intuitive and business-ready from day one.",
      "As the founder of Syntaxure Labs, Jeff serves as the technical backbone of MDM Digital, architecting and maintaining the digital infrastructure that powers our platforms end-to-end — from real-time data pipelines and API integrations to mobile-optimized frontends and secure admin systems. His engineering decisions directly shape the reliability, speed, and experience of every touchpoint our clients and attendees interact with.",
    ],
    image: "/images/team/Jeff.png",
    company: "Founder, Syntaxure Labs",
    companyUrl: "https://www.syntaxure.dev/",
  },
];
