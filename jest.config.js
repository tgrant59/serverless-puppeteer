module.exports = {
    bail: false,
    collectCoverageFrom: ['src/**/*.js'],
    coverageDirectory: './artifacts/coverage',
    modulePaths: ['<rootDir>/src'],
    notify: false,
    resetMocks: false,
    resetModules: false,
    rootDir: '.',
    testPathIgnorePatterns: ['/artifacts/', '/scripts/', '/node_modules/'],
    testRegex: '((\\.|/)test)\\.jsx?$',
    timers: 'real',
    verbose: false,
}
