import type { Preview } from '@storybook/react'
import {initialize, mswLoader } from 'msw-storybook-addon';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

/*
 * Initializes MSW
 * See https://github.com/mswjs/msw-storybook-addon#configuring-msw
 * to learn how to customize it
 */
initialize();

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    msw: {
      handlers: [],
    }
  },
  // Add the mswLoader to the loaders array
  loaders: [mswLoader],
};

export default preview;