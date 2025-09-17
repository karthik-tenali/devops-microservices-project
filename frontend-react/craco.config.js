module.exports = {
  jest: {
    configure: {
      transformIgnorePatterns: [
        "/node_modules/(?!(axios)/)" // Tell Jest to transpile axios module
      ],
    },
  },
};

