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
    id: "digital-technology-incubation",
    title: "Digital & Technology Incubation",
    tagline: "Transform ideas into innovative digital solutions.",
    description:
      "We partner with organizations to turn bold ideas into viable digital products and services. From strategic planning and technology consulting to innovation workshops and startup incubation, we guide you through every stage of the digital journey — ensuring your initiatives are built for scale, sustainability, and real-world impact.",
    image: "/images/services/technology.png",
    category: "digital-solutions",
    offerings: [
      "Digital Transformation Strategy",
      "Technology Consulting",
      "Innovation & Startup Incubation",
      "Product Development Advisory",
      "AI Adoption Planning",
      "Digital Capability Building",
      "Digital Innovation Workshops",
    ],
    process: [
      {
        step: "01",
        title: "Assess",
        description:
          "We evaluate your organization's digital maturity, goals, and opportunities for innovation.",
      },
      {
        step: "02",
        title: "Strategize",
        description:
          "We develop a tailored digital roadmap with clear milestones and measurable outcomes.",
      },
      {
        step: "03",
        title: "Incubate",
        description:
          "We guide your idea from concept to prototype, providing technical expertise and mentorship along the way.",
      },
    ],
  },
  {
    id: "websites-digital-platforms",
    title: "Websites & Digital Platforms",
    tagline: "Build a professional online presence that grows your community.",
    description:
      "From corporate websites to membership portals and online directories, we design and develop digital platforms that inform, engage, and convert. Every solution is built with performance, accessibility, and scalability in mind — giving your organization a powerful digital footprint.",
    image: "/images/services/marketing.jpg",
    category: "digital-solutions",
    offerings: [
      "Corporate Websites",
      "Association & Membership Portals",
      "Event Websites",
      "Landing Pages",
      "Online Directories",
      "Website Maintenance",
      "Web Hosting & Domain Management",
    ],
    process: [
      {
        step: "01",
        title: "Discover",
        description: "We understand your audience, content needs, and business objectives.",
      },
      {
        step: "02",
        title: "Design & Build",
        description:
          "We create a custom-designed, fully responsive website optimized for performance and user experience.",
      },
      {
        step: "03",
        title: "Launch & Support",
        description:
          "We deploy your platform and provide ongoing maintenance to keep it secure and up to date.",
      },
    ],
  },
  {
    id: "ai-business-automation",
    title: "AI & Business Automation",
    tagline: "Improve efficiency with intelligent systems and automation.",
    description:
      "Harness the power of artificial intelligence and automation to streamline operations, reduce manual work, and unlock new capabilities. From AI chatbots and workflow automation to CRM systems and custom web applications, we build intelligent solutions that work as hard as you do.",
    image: "/images/services/conceptualization.jpg",
    category: "digital-solutions",
    offerings: [
      "AI Chatbots",
      "Workflow Automation",
      "CRM & Membership Systems",
      "Online Registration Systems",
      "Business Process Automation",
      "Custom Web Applications",
      "Digital Forms & Approval Workflows",
    ],
    process: [
      {
        step: "01",
        title: "Analyze",
        description:
          "We map your current workflows and identify automation opportunities for maximum ROI.",
      },
      {
        step: "02",
        title: "Automate",
        description:
          "We design and implement intelligent systems tailored to your operational needs.",
      },
      {
        step: "03",
        title: "Optimize",
        description:
          "We monitor performance and continuously refine your automation for peak efficiency.",
      },
    ],
  },
  {
    id: "social-media-digital-marketing",
    title: "Social Media & Digital Marketing",
    tagline: "Expand your reach and strengthen your brand.",
    description:
      "Amplify your presence across digital channels with strategic social media management, content creation, and data-driven marketing campaigns. We help you connect with your audience, build community, and achieve measurable results across every platform that matters.",
    image: "/images/services/venue.jpg",
    category: "creative-media",
    offerings: [
      "Social Media Management",
      "Content Strategy",
      "Graphic Design",
      "Video Content Creation",
      "Email Marketing",
      "Digital Advertising",
      "Community Engagement",
      "Brand Campaigns",
    ],
    process: [
      {
        step: "01",
        title: "Strategize",
        description:
          "We develop a content and marketing plan aligned with your brand voice and audience.",
      },
      {
        step: "02",
        title: "Create & Publish",
        description:
          "We produce compelling content and manage publishing across all your digital channels.",
      },
      {
        step: "03",
        title: "Engage & Grow",
        description:
          "We monitor performance, engage your community, and optimize campaigns for growth.",
      },
    ],
  },
  {
    id: "creative-media-studio",
    title: "Creative Media & Recording Studio",
    tagline: "Create compelling content with professional production.",
    description:
      "Bring your stories to life with our full-service creative media studio. From podcast recording and video production to motion graphics and livestream production, we deliver professional-quality content that captivates audiences and elevates your brand.",
    image: "/images/services/entertainment.jpg",
    category: "creative-media",
    offerings: [
      "Podcast Recording",
      "Audio Recording & Voice-Over Services",
      "Music & Jingle Production",
      "Video Production & Editing",
      "Photography",
      "Livestream Production",
      "Motion Graphics & Promotional Videos",
      "Interviews & Talk Shows",
      "Webinar & Online Course Production",
      "Studio Rental",
    ],
    process: [
      {
        step: "01",
        title: "Plan",
        description: "We collaborate on content concepts, scripts, and production requirements.",
      },
      {
        step: "02",
        title: "Produce",
        description:
          "Our studio team handles recording, filming, and post-production with professional-grade equipment.",
      },
      {
        step: "03",
        title: "Deliver",
        description:
          "We deliver polished, ready-to-publish content optimized for your target platforms.",
      },
    ],
  },
  {
    id: "event-technology-solutions",
    title: "Event Technology Solutions",
    tagline: "Deliver seamless, technology-enabled events.",
    description:
      "Elevate your events with cutting-edge technology solutions. From registration systems and QR code check-in to livestreaming, hybrid event platforms, and post-event analytics, we provide the digital infrastructure that makes modern events smarter, more engaging, and more measurable.",
    image: "/images/services/technology.png",
    category: "digital-solutions",
    offerings: [
      "Event Registration Systems",
      "QR Code Check-in",
      "Online Ticketing",
      "Digital Certificates",
      "Event Mobile Applications",
      "Livestream Support",
      "Hybrid Event Solutions",
      "Post-Event Analytics",
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
    id: "membership-payments-fundraising",
    title: "Membership, Payments & Fundraising",
    tagline: "Strengthen relationships while simplifying administration.",
    description:
      "Build stronger communities with integrated membership management, online payments, and donation platforms. We help associations, nonprofits, and organizations streamline administration, increase engagement, and maximize revenue through digital-first solutions.",
    image: "/images/services/logistics.jpg",
    category: "business-tech",
    offerings: [
      "Membership Management Systems",
      "Online Membership Renewal",
      "Digital Member IDs",
      "Online Payment Integration",
      "Donation Platforms",
      "Sponsorship Portals",
      "Member Communications",
    ],
    process: [
      {
        step: "01",
        title: "Map",
        description:
          "We analyze your membership structure, payment workflows, and engagement touchpoints.",
      },
      {
        step: "02",
        title: "Build",
        description:
          "We implement integrated systems for membership, payments, and donor management.",
      },
      {
        step: "03",
        title: "Grow",
        description:
          "We provide tools and insights to increase retention, engagement, and revenue.",
      },
    ],
  },
  {
    id: "analytics-business-intelligence",
    title: "Analytics & Business Intelligence",
    tagline: "Turn information into better decisions.",
    description:
      "Transform raw data into actionable insights with executive dashboards, analytics reporting, and AI-powered intelligence. We help you understand your audience, measure performance, and make data-driven decisions that drive real results.",
    image: "/images/services/planning.jpg",
    category: "business-tech",
    offerings: [
      "Executive Dashboards",
      "Website Analytics",
      "Membership Analytics",
      "Event Performance Reports",
      "Audience Insights",
      "AI-Powered Reporting",
    ],
    process: [
      {
        step: "01",
        title: "Collect",
        description:
          "We set up data collection across your digital touchpoints for comprehensive visibility.",
      },
      {
        step: "02",
        title: "Analyze",
        description:
          "We build custom dashboards and reports that surface the metrics that matter most.",
      },
      {
        step: "03",
        title: "Act",
        description:
          "We translate insights into recommendations and help you implement data-driven strategies.",
      },
    ],
  },
  {
    id: "managed-digital-services",
    title: "Managed Digital Services",
    tagline: "Keep your digital ecosystem secure, reliable, and up to date.",
    description:
      "Focus on your core mission while we manage your digital infrastructure. From technical support and cloud services to cybersecurity and data backup, we provide comprehensive managed services that keep your technology running smoothly and securely.",
    image: "/images/services/marketing.jpg",
    category: "business-tech",
    offerings: [
      "Technical Support",
      "Website Maintenance",
      "Cloud Services",
      "Cybersecurity",
      "Data Backup & Recovery",
      "Systems Administration",
      "Ongoing Digital Support",
    ],
    process: [
      {
        step: "01",
        title: "Audit",
        description: "We assess your current digital infrastructure and identify gaps and risks.",
      },
      {
        step: "02",
        title: "Secure & Optimize",
        description: "We implement security measures, backups, and performance optimizations.",
      },
      {
        step: "03",
        title: "Monitor & Support",
        description:
          "We provide 24/7 monitoring, proactive maintenance, and responsive technical support.",
      },
    ],
  },
];

export const serviceCategories: ServiceCategory[] = [
  {
    id: "digital-solutions",
    title: "Digital Solutions",
    description: "Technology-driven platforms, AI, and digital transformation.",
  },
  {
    id: "creative-media",
    title: "Creative & Media",
    description: "Content creation, marketing, and professional production services.",
  },
  {
    id: "business-tech",
    title: "Business & Technology",
    description: "Membership, payments, analytics, and managed digital services.",
  },
];

export const coreValues = [
  { title: "Innovation", icon: "lightbulb" },
  { title: "Technical Excellence", icon: "cpu" },
  { title: "Client Partnership", icon: "users" },
  { title: "Creative Excellence", icon: "palette" },
  { title: "Measurable Impact", icon: "bar-chart" },
];
