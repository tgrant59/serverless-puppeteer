module.exports = {
    bail: false,
    collectCoverageFrom: ['src/**/*.js'],
    coverageDirectory: './artifacts/coverage',
    notify: false,
    rootDir: '.',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/artifacts/', '/scripts/', '/node_modules/'],
    testRegex: '((\\.|/)test)\\.jsx?$',
    verbose: false,
}
