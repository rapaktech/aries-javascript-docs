/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  // tutorialSidebar: [{ type: "autogenerated", dirName: "." }],

  // But you can create a sidebar manually

  tutorialSidebar: [
    'index',
    {
      type: 'category',
      label: 'Getting started',
      link: { type: 'doc', id: 'getting-started/index' },
      items: [
        'getting-started/prerequisites',
        {
          type: 'category',
          label: 'Agent Setup',
          link: { type: 'doc', id: 'getting-started/set-up/index' },
          items: [
            'getting-started/set-up/aries-askar',
            {
              type: 'category',
              label: 'Indy SDK',
              link: { type: 'doc', id: 'getting-started/set-up/indy-sdk/index' },
              items: [
                'getting-started/set-up/indy-sdk/linux',
                'getting-started/set-up/indy-sdk/windows',
                'getting-started/set-up/indy-sdk/macos-intel',
                'getting-started/set-up/indy-sdk/macos-arm',
                'getting-started/set-up/indy-sdk/react-native',
              ],
            },
            'getting-started/set-up/anoncreds-rs',
            'getting-started/set-up/indy-vdr',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Concepts',
      link: { type: 'doc', id: 'concepts/index' },
      items: ['concepts/agents', 'concepts/did-and-didcomm', 'concepts/platform-and-environment'],
    },
    {
      type: 'category',
      label: 'Tutorials',
      link: { type: 'doc', id: 'tutorials/index' },
      items: [
        {
          type: 'category',
          label: 'Agent Config',
          link: { type: 'doc', id: 'tutorials/agent-config/index' },
          items: ['tutorials/agent-config/logging'],
        },
        'tutorials/create-a-connection',
        'tutorials/issue-a-credential',
        {
          type: 'category',
          label: 'Postgres Database',
          link: { type: 'doc', id: 'tutorials/postgres-database-nodejs/index' },
          items: [
            'tutorials/postgres-database-nodejs/linux',
            'tutorials/postgres-database-nodejs/macos',
            'tutorials/postgres-database-nodejs/windows',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Updating',
      link: { type: 'doc', id: 'updating/index' },
      items: [
        'updating/update-assistant',
        'updating/update-indy-sdk-to-askar',
        'updating/versions/0.1-to-0.2',
        'updating/versions/0.2-to-0.3',
        'updating/versions/0.3-to-0.4',
      ],
    },
    'ecosystem/index',
    {
      type: 'category',
      label: 'Extensions',
      link: { type: 'doc', id: 'extensions/index' },
      items: [
        {
          type: 'category',
          label: 'REST API',
          link: { type: 'doc', id: 'extensions/rest/index' },
          items: ['extensions/rest/setup'],
        },
        {
          type: 'category',
          label: 'React Hooks',
          link: { type: 'doc', id: 'extensions/react-hooks/index' },
          items: ['extensions/react-hooks/setup'],
        },
        {
          type: 'category',
          label: 'Redux Store',
          link: { type: 'doc', id: 'extensions/redux-store/index' },
          items: ['extensions/redux-store/setup'],
        },
        {
          type: 'category',
          label: 'Push Notifications',
          link: { type: 'doc', id: 'extensions/push-notifications/index' },
          items: ['extensions/push-notifications/setup'],
        },
        {
          type: 'category',
          label: 'BLE Transport',
          link: { type: 'doc', id: 'extensions/transport-ble/index' },
          items: ['extensions/transport-ble/setup'],
        },
      ],
    },
  ],
}

module.exports = sidebars
