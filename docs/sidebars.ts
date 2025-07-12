import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  docsSidebar: [
    'introduction',
    'problem',
    'solution',
    {
      type: 'category',
      label: 'Technologies',
      items: [
        'technologies/overview',
        'technologies/tech-stack',
        'technologies/blockchain',
        'technologies/frontend',
        'technologies/backend',
      ],
    },
    'demo',
    {
      type: 'category',
      label: 'Business',
      items: [
        'business/market',
        'business/business-model',
        'business/competitive-advantages',
        'business/go-to-market',
      ],
    },
    'future-plans',
    'installation',
    'team',
    'references',
  ],
};

export default sidebars;
