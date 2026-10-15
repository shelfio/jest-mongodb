import baseConfig, {recommendedIgnorePatterns} from '@shelf/eslint-config/oxfmt.js';

export default {
  ...baseConfig,
  ignorePatterns: [...recommendedIgnorePatterns, 'lib/**'],
};
