module.exports = {
  purge: {
    enabled: true,
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
  },
  theme: {
    extend: {
      colors: {
        primary: "var(--primary-color)",
        primaryColorAlpha: "#008A1E",
      },
    },
  },
};
