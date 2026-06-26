export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const services: Service[] = [
  {
    id: "event-planning",
    title: "Event Planning",
    description: "Strategy, concept, timeline, and budget management for seamless events.",
    icon: "clipboard",
  },
  {
    id: "event-production",
    title: "Event Production",
    description: "Stage, lights, sound, LED, AV, and technical production expertise.",
    icon: "settings",
  },
  {
    id: "event-management",
    title: "Event Management",
    description: "On-site management, coordination, and logistics for flawless execution.",
    icon: "users",
  },
  {
    id: "venue-supplier",
    title: "Venue & Supplier Management",
    description: "Sourcing and coordinating the best venues and vendors for your event.",
    icon: "map-pin",
  },
  {
    id: "registration",
    title: "Registration & Guest Management",
    description: "Attendee registration, check-in systems, and guest experience management.",
    icon: "check-square",
  },
  {
    id: "branding-design",
    title: "Branding & Design",
    description: "Backdrops, signage, booth design, and marketing materials for your brand.",
    icon: "pen-tool",
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
