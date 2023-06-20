module.exports = {
  testEnvironment: "jsdom",
  moduleNameMapper: {
    ".+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$": "identity-obj-proxy",
    'src/(.*)': '<rootDir>/src/$1',
    'tests/(.*)': '<rootDir>/__tests__/$1',
    'shared/(.*)': '<rootDir>/src/shared/$1',
    'api/(.*)': '<rootDir>/src/api/$1',
    'staff-app/(.*)': '<rootDir>/src/staff-app/$1',
    'assets/(.*)': '<rootDir>/src/assets/$1'
  },
}