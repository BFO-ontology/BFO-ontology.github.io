import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '5ff'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '5ba'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'a2b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c3c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '156'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '88c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '000'),
    exact: true
  },
  {
    path: '/fol',
    component: ComponentCreator('/fol', '524'),
    exact: true
  },
  {
    path: '/publications',
    component: ComponentCreator('/publications', '671'),
    exact: true
  },
  {
    path: '/tutorials',
    component: ComponentCreator('/tutorials', '70c'),
    exact: true
  },
  {
    path: '/users',
    component: ComponentCreator('/users', 'a69'),
    exact: true
  },
  {
    path: '/workshops',
    component: ComponentCreator('/workshops', '59d'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', '646'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', 'a10'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', '117'),
            routes: [
              {
                path: '/docs/intro',
                component: ComponentCreator('/docs/intro', '44d'),
                exact: true,
                sidebar: "defaultSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', '2e1'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
