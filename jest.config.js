module.exports = {
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  setupFiles: ["./src/@seedwork/__test__/setupFile.js"],
  testMatch: ["**/*.test.ts", "**/*.spec.ts"],
};
