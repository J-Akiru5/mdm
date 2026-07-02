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
    role: "Chief Strategy Officer (CSO)",
    bio: [
      "Zeno Martinez is a technology entrepreneur and digital transformation strategist with over 30 years of experience in business innovation.",
      "As Founder of ZenLabs Venture Management Inc., he helps organizations leverage AI and technology for sustainable growth. At MDM Events, he leads strategy, partnerships, and business development.",
    ],
    image: "/images/team/Zeno.png",
    company: "Founder, ZenLabs Venture Management Inc.",
    companyUrl: "https://zenlabs.me/",
  },
  {
    id: "jeff-martinez",
    name: "Jeff Martinez",
    role: "Chief Technology Officer (CTO)",
    bio: [
      "Jeff Martinez is a software engineer specializing in web and mobile applications, systems architecture, and AI-powered solutions.",
      "He leads the development of scalable digital platforms and emerging technologies. At MDM Events, he oversees product development, technology strategy, and platform innovation.",
    ],
    image: "/images/team/Jeff.png",
    company: "Founder, Syntaxure Labs",
    companyUrl: "https://www.syntaxure.dev/",
  },
];
