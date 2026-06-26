export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export const stats: Stat[] = [
  { value: 300, suffix: "+", label: "Events Managed" },
  { value: 100, suffix: "+", label: "Happy Clients" },
  { value: 10, suffix: "+", label: "Years of Experience" },
];
