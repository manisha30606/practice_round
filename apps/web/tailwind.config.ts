import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: { colors: { navy: "#14243A", civic: "#2563EB", teal: "#0F9D91", canvas: "#F4F6F8" }, boxShadow: { soft: "0 8px 30px rgba(20,36,58,.06)" } } },
  plugins: []
};
export default config;
