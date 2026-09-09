import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-mcp"
  ],
  "framework": "@storybook/react-vite",
  "docs": {
    "autodocs": "tag"
  },
  async viteFinal(config) {
    config.base = process.env.STORYBOOK_BASE || '/'
    config.resolve = config.resolve || {}
    config.resolve.extensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.css']
    return config
  },
};
export default config;