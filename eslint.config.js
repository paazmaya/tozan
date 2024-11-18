
import paazmaya from 'eslint-config-paazmaya';
import node from 'eslint-plugin-n';

export default [
  paazmaya,
  {
    plugins: {
      node: node.configs.recommended
    },
    rules: {
      'capitalized-comments': 0,
      'no-console': 0,
      'no-process-exit': 0
    }
  }
];
