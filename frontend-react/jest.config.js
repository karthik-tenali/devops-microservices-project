module.exports = {
  transformIgnorePatterns: [
    "/node_modules/(?!(axios)/)"  // Transpile axios ES module for Jest
  ],
};

