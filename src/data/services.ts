export interface Service {
  id: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  offerings: string[];
  process: {
    step: string;
    title: string;
    description: string;
  }[];
}

export const services: Service[] = [
  {
    id: "event-planning",
    title: "Event Planning",
    tagline: "From concept to execution, we plan every detail.",
    description:
      "Great events don\u2019t happen by chance. Our planning process starts with a deep understanding of your vision, goals, and audience. From venue selection and budget management to timeline creation and vendor coordination, we build a comprehensive roadmap that ensures every detail is accounted for long before the doors open.",
    image: "/images/services/planning.jpg",
    offerings: [
      "Venue selection, sourcing, and contract negotiation",
      "Budget planning, tracking, and reconciliation",
      "Timeline and milestone creation",
      "Vendor sourcing, vetting, and coordination",
      "Risk assessment and contingency planning",
      "Creative concept and theme development",
    ],
    process: [
      {
        step: "01",
        title: "Discovery",
        description: "We learn your brand, goals, audience, and budget to shape the vision.",
      },
      {
        step: "02",
        title: "Strategy",
        description: "We build a detailed plan covering venue, vendors, timeline, and logistics.",
      },
      {
        step: "03",
        title: "Execution",
        description: "We oversee every detail from setup to breakdown, ensuring a seamless event.",
      },
    ],
  },
  {
    id: "event-production",
    title: "Event Production",
    tagline: "Stage, lights, sound \u2014 we bring your vision to life.",
    description:
      "Production is where your event comes alive. Our technical team designs, rigs, and operates state-of-the-art stage setups, lighting rigs, sound systems, and visual displays. Whether it\u2019s an intimate presentation or a large-scale concert, we deliver production value that captivates audiences and elevates your brand.",
    image: "/images/services/production.jpg",
    offerings: [
      "Stage design, construction, and dressing",
      "Professional sound engineering and PA systems",
      "Architectural and stage lighting design",
      "LED walls, projection, and video processing",
      "Audio-visual equipment and systems integration",
      "Multi-camera live streaming and recording",
    ],
    process: [
      {
        step: "01",
        title: "Design",
        description:
          "We translate your vision into technical drawings, rigging plans, and gear lists.",
      },
      {
        step: "02",
        title: "Build",
        description: "Our crew installs, configures, and tests all systems before show day.",
      },
      {
        step: "03",
        title: "Deliver",
        description:
          "We run the show with precision \u2014 live mixing, switching, and real-time adjustments.",
      },
    ],
  },
  {
    id: "event-management",
    title: "Event Management",
    tagline: "Flawless on-ground execution, every time.",
    description:
      "On the day, every second counts. Our on-site management team coordinates vendors, directs staff, manages guest flow, and handles real-time logistics so you can focus on your guests and your message. From registration to teardown, we keep everything running smoothly behind the scenes.",
    image: "/images/services/management.jpg",
    offerings: [
      "On-site vendor management and communication",
      "Staff briefing, scheduling, and supervision",
      "Guest registration, check-in, and hospitality",
      "Transportation, accommodation, and catering logistics",
      "Real-time troubleshooting and crisis management",
      "Post-event reporting and debrief",
    ],
    process: [
      {
        step: "01",
        title: "Plan",
        description:
          "We develop detailed run-of-show documents, staff rosters, and contingency plans.",
      },
      {
        step: "02",
        title: "Execute",
        description: "Our team manages every moving part on the ground, from load-in to load-out.",
      },
      {
        step: "03",
        title: "Review",
        description:
          "We gather feedback, analyze metrics, and deliver a comprehensive post-event report.",
      },
    ],
  },
  {
    id: "branding-design",
    title: "Branding & Design",
    tagline: "Your brand, unforgettable at every touchpoint.",
    description:
      "Your event is an extension of your brand. Our design team creates cohesive visual experiences that communicate your identity across every element \u2014 from stage backdrops and signage to digital assets and printed materials. We ensure your brand looks and feels consistent, professional, and impactful.",
    image: "/images/services/branding.jpg",
    offerings: [
      "Custom stage backdrop and set design",
      "Directional signage, banners, and wayfinding",
      "Trade show booth design and fabrication",
      "Marketing collateral, invitations, and programs",
      "Digital assets, social graphics, and presentations",
      "Brand guidelines and visual identity systems",
    ],
    process: [
      {
        step: "01",
        title: "Discover",
        description:
          "We study your brand identity, audience, and event theme to inform the design direction.",
      },
      {
        step: "02",
        title: "Design",
        description:
          "We create mood boards, mockups, and production-ready artwork for your approval.",
      },
      {
        step: "03",
        title: "Deploy",
        description: "We produce, print, and install all branded elements at the venue.",
      },
    ],
  },
  {
    id: "technology-support",
    title: "Technology & Support",
    tagline: "Technology that powers modern events.",
    description:
      "Beyond organizing events, MDM integrates technology that makes every event smarter, more engaging, and more measurable. From registration software and event apps to LED walls and AI-powered engagement tools, we deliver complete technology solutions tailored to your event.",
    image: "/images/services/technology.png",
    offerings: [
      "Event registration and ticketing platforms",
      "Mobile event applications and attendee portals",
      "LED walls, digital signage, and AV systems",
      "Livestream and hybrid event platforms",
      "Wi-Fi and network infrastructure",
      "On-site technical support and help desk",
    ],
    process: [
      {
        step: "01",
        title: "Assess",
        description:
          "We evaluate your technical requirements, venue infrastructure, and attendee needs.",
      },
      {
        step: "02",
        title: "Integrate",
        description: "We deploy, configure, and test all hardware and software systems.",
      },
      {
        step: "03",
        title: "Support",
        description: "We provide on-site engineers and remote monitoring throughout your event.",
      },
    ],
  },
];

export const serviceCategories = [
  {
    id: "corporate",
    title: "Corporate Events",
    description: "Conferences, seminars, company events, and corporate gatherings.",
  },
  {
    id: "government",
    title: "Government & Institutional",
    description: "Official functions, ceremonies, and institutional programs.",
  },
  {
    id: "brand-activations",
    title: "Brand Activations & Launches",
    description: "Product launches, brand experiences, and activation campaigns.",
  },
  {
    id: "festivals",
    title: "Festivals & Community Events",
    description: "Festivals, fairs, and large-scale community celebrations.",
  },
  {
    id: "exhibits",
    title: "Exhibits & Trade Fairs",
    description: "Trade show booths, exhibits, and exhibition management.",
  },
  {
    id: "production",
    title: "Production & Technical",
    description: "Technical production, staging, and audiovisual solutions.",
  },
];

export const coreValues = [
  { title: "Strategic Planning", icon: "target" },
  { title: "Creative Design", icon: "pen-tool" },
  { title: "Professional Execution", icon: "shield" },
  { title: "On-Ground Management", icon: "map" },
  { title: "Memorable Experiences", icon: "star" },
];
