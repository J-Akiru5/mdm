export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
}

export const portfolioItems: PortfolioItem[] = [
  {
    id: "corporate-conference",
    title: "Annual Corporate Conference",
    category: "corporate",
    image: "/images/portfolio/corporate-conference.jpg",
  },
  {
    id: "government-summit",
    title: "Government Summit",
    category: "government",
    image: "/images/portfolio/government-summit.jpg",
  },
  {
    id: "product-launch",
    title: "Product Launch Event",
    category: "launches",
    image: "/images/portfolio/product-launch.jpg",
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
