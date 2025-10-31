const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

dotenv.config({ path: '.env' });
dotenvExpand.expand(dotenv.config({ path: `.env.${process.env.NODE_ENV}` }));

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  moduleFileExtensions: ['ts', 'js', 'tsx'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '^.+\\.(css|sass|scss)$': 'identity-obj-proxy',
  },
  globals: {
    'ts-jest': {
      tsconfig: __dirname + '/test/tsconfig.json',
      diagnostics: {
        exclude: ['**/*.test.(ts|tsx)'],
      },
    },
  },
  testMatch: ['**/test/**/*.test.(ts|tsx)'],
};
