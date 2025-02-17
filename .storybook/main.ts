import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: [
    "../components/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  
  addons: [
    "@storybook/addon-onboarding",
    '@storybook/addon-links',
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
    '@storybook/preset-create-react-app'
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  }
};
export default config;
