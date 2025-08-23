module.exports = {
    testEnvironment: "node",
    collectCoverage: true,
    collectCoverageFrom: [
        "src/**/*.js",
        "!src/config/**",
        "!src/docs",
        "!src/routes/**",
        "!src/validations/**",
        "!src/app.js",
    ],
    coverageDirectory: "coverage",
    coverageReporters: ["text", "lcov", "html"]
}