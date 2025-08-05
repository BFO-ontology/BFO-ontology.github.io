// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const config = {
  title: 'Basic Formal Ontology',
  tagline: 'A top-level ontology for scientific research',
  url: 'https://basic-formal-ontology.org',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'BFO-ontology',
  projectName: 'BFO-ontology.github.io',

  headTags: [
  {
    tagName: 'link',
    attributes: {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Source+Sans+Pro:wght@300;400;600&display=swap',
    },
  },
],


  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
presets: [
  [
    '@docusaurus/preset-classic',
    {
      blog: false,
      theme: {
        customCss: require.resolve('./src/css/custom.css'),
      },
    },
  ],
],

  themeConfig: {
    navbar: {
      title: 'BFO',
logo: {
  alt: 'BFO Logo',
  src: 'img/bfologo.png',
},
      items: [
        
        {
          href: 'https://direct.mit.edu/books/book/4044/Building-Ontologies-with-Basic-Formal-Ontology',
          label: 'Guidebook',
          position: 'left',
        },
        {
          href: 'https://github.com/BFO-ontology/BFO-ontology.github.io',
          label: 'GitHub',
          position: 'right',
        },
       { to: '/fol', label: 'FOL', position: 'left' },
{ to: '/publications', label: 'Publications', position: 'left' },
        { to: '/users', label: 'Users', position: 'left' },
        { to: '/tutorials', label: 'Tutorials', position: 'left' },
        { to: '/workshops', label: 'Workshops', position: 'left' },

      ],
    },
    footer: {
      style: 'dark',
      copyright: `© ${new Date().getFullYear()} BFO`,
    },
  },
};

module.exports = config;

