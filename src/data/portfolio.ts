export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  clientName?: string;
  challenge?: string;
  solution?: string;
  result?: string;
}

export const portfolioItems: PortfolioItem[] = [
  {
    id: "corporate-conference",
    title: "Annual Corporate Conference",
    category: "corporate",
    image: "/images/portfolio/corporate-conference.jpg",
    clientName: "Megaworld Corporation",
    challenge:
      "Large-scale corporate anniversary requiring branded staging, AV production, and live registration for 500+ attendees.",
    solution:
      "MDM delivered full event management plus a custom registration system with QR attendance tracking.",
    result: "Zero check-in queue issues; client renewed contract for the following year.",
  },
  {
    id: "government-summit",
    title: "Government Summit",
    category: "government",
    image: "/images/portfolio/government-summit.jpg",
    clientName: "GIZ Philippines",
    challenge:
      "Multi-day government summit with participants from multiple regions requiring hybrid attendance options.",
    solution:
      "End-to-end event production with livestream setup, virtual attendee portals, and real-time Q&A moderation.",
    result: "Thousands of virtual participants joined seamlessly alongside in-person delegates.",
  },
  {
    id: "product-launch",
    title: "Product Launch Event",
    category: "launches",
    image: "/images/portfolio/product-launch.jpg",
    clientName: "Grab Philippines",
    challenge:
      "Brand activation launch requiring dynamic staging, LED walls, and interactive attendee experiences.",
    solution:
      "Full creative direction, branded stage design, QR check-ins, and live social media walls.",
    result:
      "Campaign generated widespread social media engagement and exceeded attendance targets.",
  },
  {
    id: "music-festival",
    title: "Summer Music Festival",
    category: "festivals",
    image: "/images/portfolio/music-festival.jpg",
  },
  {
    id: "trade-exhibit",
    title: "International Trade Exhibit",
    category: "corporate",
    image: "/images/portfolio/trade-exhibit.jpg",
  },
  {
    id: "brand-activation",
    title: "Brand Activation Campaign",
    category: "launches",
    image: "/images/portfolio/brand-activation.jpg",
  },
  {
    id: "community-fair",
    title: "Community Fair",
    category: "festivals",
    image: "/images/portfolio/community-fair.jpg",
  },
  {
    id: "gala-dinner",
    title: "Charity Gala Dinner",
    category: "corporate",
    image: "/images/portfolio/gala-dinner.jpg",
  },
  {
    id: "government-ceremony",
    title: "Awarding Ceremony",
    category: "government",
    image: "/images/portfolio/government-ceremony.jpg",
  },
  {
    id: "fashion-show",
    title: "Fashion Show Production",
    category: "production",
    image: "/images/portfolio/fashion-show.jpg",
  },
  {
    id: "expo-booth",
    title: "Expo Booth Design",
    category: "exhibits",
    image: "/images/portfolio/expo-booth.jpg",
  },
  {
    id: "wedding-production",
    title: "Luxury Wedding Production",
    category: "production",
    image: "/images/portfolio/wedding-production.jpg",
  },
];

export const portfolioCategories = [
  { id: "all", label: "All" },
  { id: "corporate", label: "Corporate" },
  { id: "government", label: "Government" },
  { id: "launches", label: "Launches" },
  { id: "festivals", label: "Festivals" },
];
