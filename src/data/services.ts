export interface Service {
  id: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  category: string;
  offerings: string[];
  process: {
    step: string;
    title: string;
    description: string;
  }[];
}

export interface ServiceCategory {
  id: string;
  title: string;
  description: string;
}

export const services: Service[] = [
  {
    id: "event-conceptualization-design",
    title: "Event Conceptualization and Design",
    tagline: "Where big ideas take shape.",
    description:
      "Every unforgettable event starts with a powerful idea. Our creative team works closely with you to conceptualize and design events that align with your brand, captivate your audience, and deliver measurable impact. From theme development to visual storytelling, we turn your vision into a compelling event blueprint.",
    image: "/images/services/conceptualization.jpg",
    category: "creative",
    offerings: [
      "Creative concept and theme development",
      "Mood boards and visual storytelling",
      "Program flow and experience design",
      "Budget-aligned creative proposals",
      "Brand integration and messaging",
      "Presentation decks and pitch materials",
    ],
    process: [
      {
        step: "01",
        title: "Discover",
        description:
          "We dive deep into your brand, goals, audience, and budget to uncover the core idea.",
      },
      {
        step: "02",
        title: "Conceptualize",
        description:
          "We craft a creative direction, theme, and program flow that brings your vision to life.",
      },
      {
        step: "03",
        title: "Design",
        description:
          "We produce mood boards, renderings, and detailed proposals for your approval.",
      },
    ],
  },
  {
    id: "venue-selection-management",
    title: "Venue Selection and Management",
    tagline: "The perfect setting for every moment.",
    description:
      "The venue sets the stage for your entire event. We leverage our extensive network of partners to find, negotiate, and manage the ideal venue for your occasion — whether it's a grand ballroom, an open-air festival ground, or an intimate corporate boardroom. We handle site inspections, contracts, and on-site coordination so you don't have to.",
    image: "/images/services/venue.jpg",
    category: "management",
    offerings: [
      "Venue sourcing and shortlisting",
      "Site inspection coordination",
      "Contract negotiation and booking",
      "Permits and compliance management",
      "Floor plan and layout planning",
      "On-site venue coordination",
    ],
    process: [
      {
        step: "01",
        title: "Source",
        description:
          "We identify and shortlist venues that match your vision, guest count, and budget.",
      },
      {
        step: "02",
        title: "Secure",
        description: "We negotiate contracts, manage deposits, and secure all necessary permits.",
      },
      {
        step: "03",
        title: "Manage",
        description: "We coordinate with venue staff and oversee every on-site detail.",
      },
    ],
  },
  {
    id: "catering-beverage-services",
    title: "Catering and Beverage Services",
    tagline: "Exceptional food, unforgettable experiences.",
    description:
      "Great food leaves a lasting impression. Our catering partners deliver culinary experiences tailored to your theme, audience, and dietary requirements — from elegant sit-down dinners and buffet spreads to vibrant cocktail receptions and festival food parks. Every menu is crafted to delight and satisfy.",
    image: "/images/services/catering.jpg",
    category: "management",
    offerings: [
      "Menu planning and customization",
      "Fine dining, buffet, and cocktail setups",
      "Dietary accommodation (halal, vegan, gluten-free)",
      "Food tasting and quality control",
      "Beverage bar and mixology services",
      "Waitstaff and service team management",
    ],
    process: [
      {
        step: "01",
        title: "Plan",
        description:
          "We work with you to design a menu that fits your theme, audience, and dietary needs.",
      },
      {
        step: "02",
        title: "Prepare",
        description:
          "Our catering partners source ingredients and prepare every dish to the highest standard.",
      },
      {
        step: "03",
        title: "Serve",
        description:
          "We manage food flow, service timing, and guest satisfaction throughout the event.",
      },
    ],
  },
  {
    id: "entertainment-talent-management",
    title: "Entertainment and Talent Management",
    tagline: "Performances that captivate.",
    description:
      "The right entertainment elevates any event from ordinary to extraordinary. We book, manage, and produce live performances — from top musical acts, hosts, and emcees to cultural performers, keynote speakers, and specialty acts. Our roster of talent is curated to match your audience and event theme perfectly.",
    image: "/images/services/entertainment.jpg",
    category: "creative",
    offerings: [
      "Live band, DJ, and musical act booking",
      "Hosts, emcees, and keynote speakers",
      "Cultural and specialty performers",
      "Sound check and rehearsal coordination",
      "Performance schedule and run-of-show",
      "Talent hospitality and rider management",
    ],
    process: [
      {
        step: "01",
        title: "Curate",
        description: "We recommend talent based on your event theme, audience, and budget.",
      },
      {
        step: "02",
        title: "Book",
        description: "We handle contracts, scheduling, and all logistical arrangements for talent.",
      },
      {
        step: "03",
        title: "Produce",
        description: "We manage rehearsals, sound checks, and live production on event day.",
      },
    ],
  },
  {
    id: "logistics-coordination",
    title: "Logistics and Coordination",
    tagline: "Seamless operations behind the scenes.",
    description:
      "Flawless execution requires meticulous logistics. Our operations team manages transportation, accommodation, equipment rentals, on-ground staffing, and real-time coordination so that every moving part works in perfect harmony. We plan for every scenario so your event runs without a hitch.",
    image: "/images/services/logistics.jpg",
    category: "management",
    offerings: [
      "Transportation and shuttle management",
      "Guest and VIP accommodation booking",
      "Equipment and furniture rentals",
      "On-ground staffing and crew management",
      "Real-time timeline and run-of-show management",
      "Contingency and crisis response planning",
    ],
    process: [
      {
        step: "01",
        title: "Plan",
        description:
          "We build a detailed logistics roadmap covering every operational requirement.",
      },
      {
        step: "02",
        title: "Coordinate",
        description: "Our team manages vendors, staff, and schedules across all event touchpoints.",
      },
      {
        step: "03",
        title: "Execute",
        description: "We oversee load-in, on-ground operations, and load-out with precision.",
      },
    ],
  },
  {
    id: "marketing-promotion",
    title: "Marketing and Promotion",
    tagline: "Amplify your event's reach.",
    description:
      "An event is only as successful as its reach. We develop and execute targeted marketing campaigns that generate buzz, drive attendance, and extend your event's impact across digital and traditional channels. From social media and email marketing to PR and on-ground promotions, we make sure your audience shows up.",
    image: "/images/services/marketing.jpg",
    category: "marketing",
    offerings: [
      "Social media campaign management",
      "Email marketing and guest invitations",
      "Press releases and media relations",
      "On-ground signage and promotional materials",
      "Event photography and videography",
      "Post-event reporting and analytics",
    ],
    process: [
      {
        step: "01",
        title: "Strategize",
        description:
          "We develop a marketing plan tailored to your target audience and event goals.",
      },
      {
        step: "02",
        title: "Create",
        description: "We produce compelling content, visuals, and collateral across all channels.",
      },
      {
        step: "03",
        title: "Amplify",
        description: "We launch, monitor, and optimize campaigns to maximize reach and attendance.",
      },
    ],
  },
  {
    id: "technology-digital-solutions",
    title: "Technology and Digital Solutions",
    tagline: "Powering events with cutting-edge tech.",
    description:
      "Leverage the power of technology to elevate every touchpoint of your event. From live-streaming and hybrid event platforms to registration systems, LED walls, and interactive experiences, our tech team integrates the right digital solutions to ensure seamless connectivity and maximum audience engagement.",
    image: "/images/services/technology.png",
    category: "technology",
    offerings: [
      "Hybrid and virtual event platform setup",
      "Live streaming and broadcast production",
      "Online and on-site registration systems",
      "LED walls, screens, and digital signage",
      "Event apps and audience interaction tools",
      "Wi-Fi infrastructure and AV integration",
    ],
    process: [
      {
        step: "01",
        title: "Assess",
        description:
          "We evaluate your event's technical requirements and audience engagement goals.",
      },
      {
        step: "02",
        title: "Integrate",
        description:
          "We deploy and configure the right technology stack for seamless event delivery.",
      },
      {
        step: "03",
        title: "Support",
        description:
          "Our tech team provides real-time on-site and remote support throughout your event.",
      },
    ],
  },
  {
    id: "personal-events",
    title: "Personal Events",
    tagline: "Every milestone, beautifully celebrated.",
    description:
      "From the grandeur of a wedding to the joy of a child's birthday, we bring heart and expertise to life's most meaningful moments. Our personal events team handles every detail — coordination, styling, catering, and entertainment — so you can be fully present for the people who matter most.",
    image: "/images/services/planning.jpg",
    category: "creative",
    offerings: [
      "Wedding & Debut Planning (On-the-Day, Semi, Full Coordination)",
      "Baptism Receptions & Christening Celebrations",
      "Kiddie Parties & Themed Birthday Parties",
      "Private Gathering & Intimate Event Management",
      "Food & Beverage Coordination and Staffing Management",
      "Venue Styling, Floral Design & Decor",
      "Staging, Lights & Sounds, Iwata Fans",
      "Aisle Carpets, LED / LCD TV & Projectors",
    ],
    process: [
      {
        step: "01",
        title: "Consult",
        description:
          "We sit down with you to understand your story, vision, and the experience you want to create for your guests.",
      },
      {
        step: "02",
        title: "Design",
        description:
          "We craft a personalized event plan — from styling and florals to catering and program flow.",
      },
      {
        step: "03",
        title: "Celebrate",
        description:
          "On the day, our team handles everything so you can relax, enjoy, and make memories.",
      },
    ],
  },
];

export const serviceCategories: ServiceCategory[] = [
  {
    id: "management",
    title: "Event Management",
    description: "Planning, coordination, logistics, and production.",
  },
  {
    id: "creative",
    title: "Creative Services",
    description: "Stage design, branding, exhibits, and event styling.",
  },
  {
    id: "technology",
    title: "Technology & Digital",
    description: "Registration systems, event apps, AI, livestreaming, and custom software.",
  },
  {
    id: "marketing",
    title: "Marketing & Promotions",
    description: "Brand activations, social media, product launches, and influencer engagement.",
  },
];

export const coreValues = [
  { title: "Strategic Planning", icon: "target" },
  { title: "Creative Design", icon: "pen-tool" },
  { title: "Professional Execution", icon: "shield" },
  { title: "On-Ground Management", icon: "map" },
  { title: "Memorable Experiences", icon: "star" },
];
