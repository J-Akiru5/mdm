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
  {
    id: "toni-lopez",
    name: "Mx. Toni Lopez",
    role: "Chief Communications Officer (CCO)",
    bio: [
      "Mx. Toni Lopez is a communications, advocacy, media, and nonprofit leadership professional working across youth empowerment, sexual and reproductive health and rights, SOGIESC equality, digital storytelling, and community organizing in the Asia-Pacific. They previously served as Executive Director of Youth Voices Count (YVC), Inc., a regional NGO legally registered in Iloilo City that advances the rights, health, and leadership of LGBTIQ+ young people.",
      "A graduate of Secondary Education major in English from Capiz State University, Mx. Toni has further trained in SRHR, advocacy, project management, global health, humanitarianism, and women's human rights through programs offered by Women Deliver Digital University, Stanford University, and the University of Manchester.",
      "Their advocacy and media work includes serving as a reporter for Kabataan News Network and a contributor for MulatPinoy, alongside engagements with the Young Southeast Asian Leaders Initiative, Y-PEER Pilipinas, Y-Cap for SRHR, United Colours of CapSU, and the Women Deliver Young Leaders Program. In 2018, they were recognized as an SDG 5 Youth Champion for their work in gender equality.",
      "Mx. Toni also served as president of the Roxas City AFS Intercultural Programs Philippines community, advancing youth leadership, intercultural exchange, and community-building.",
    ],
    image: "/images/team/Tony.jpg",
  },
];
