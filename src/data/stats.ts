export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export const stats: Stat[] = [
  { value: 8, suffix: "+", label: "Years in Business" },
  { value: 200, suffix: "+", label: "Events Produced" },
  { value: 50, suffix: "+", label: "Clients Served" },
  { value: 100, suffix: "K+", label: "Attendees Reached" },
  { value: 5, suffix: "+", label: "Cities Covered" },
];
