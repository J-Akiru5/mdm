import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
  {
    rules: {
      "prefer-const": "error",
      "no-var": "error",
    },
  },
  {
    ignores: ["node_modules/", ".next/", "out/", "prisma/", "e2e/", "*.config.*"],
  },
];

export default eslintConfig;
