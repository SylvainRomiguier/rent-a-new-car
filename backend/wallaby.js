module.exports = () => ({
  autoDetect: ["node:test"],

  // Defaults source file patterns
  files: [
    // Excludes
    "!**/node_modules/**",
    "!**/dist/**",
    "!**/cypress/**",
    "!**/.{idea,git,cache,output,temp}/**",
    "!**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
    "!**/*.{test,spec}.?(c|m)[jt]s?(x)",

    // Include all other files
    "**/**",
  ],

  // Default test file name pattern
  tests: ["**/*.{test,spec}.?(c|m)[jt]s?(x)"],

  env: {
    runner: "/usr/bin/node", // or full path to any node executable
  },
});
