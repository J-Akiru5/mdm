export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  title: string;
  company: string;
  logo?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "01",
    quote:
      "MDM handled our annual corporate conference with exceptional professionalism. The registration system alone saved us hours of manual work, and the on-site coordination was flawless.",
    name: "Maria Santos",
    title: "Events Director",
    company: "Megaworld Corporation",
  },
  {
    id: "02",
    quote:
      "From concept to execution, MDM delivered a brand activation that exceeded our expectations. Their technology integration — from QR check-ins to live social walls — made our campaign truly interactive.",
    name: "Juan Dela Cruz",
    title: "Marketing Manager",
    company: "Grab Philippines",
  },
  {
    id: "03",
    quote:
      "We partnered with MDM for a government summit and were impressed by their end-to-end capability. The livestream setup allowed thousands of virtual participants to join seamlessly.",
    name: "Anna Reyes",
    title: "Program Director",
    company: "GIZ Philippines",
  },
];
