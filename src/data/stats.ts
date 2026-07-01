export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export const stats: Stat[] = [
  { value: 8, suffix: "+", label: "Years in Business" },
  { value: 200, suffix: "+", label: "Projects Delivered" },
  { value: 50, suffix: "+", label: "Clients Served" },
  { value: 100, suffix: "K+", label: "Organizations Empowered" },
  { value: 9, suffix: "+", label: "Digital Solutions" },
];
