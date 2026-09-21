// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Trilha Educacional 2026.2 — Grupo 02',
  tagline: 'Suprimentos, materiais MRO e centralização de estoques',
  favicon: 'img/favicon.ico',
  url: 'https://agrotech-inteli-ati.github.io',
  baseUrl: '/2026_02_TRAINEE_EDUCACIONAL_02/',
  trailingSlash: true,
  organizationName: 'AgroTech-Inteli-ATI',
  projectName: '2026_02_TRAINEE_EDUCACIONAL_02',
  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },
  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
  },
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: '/',
        },
        blog: false,
        theme: {customCss: './src/css/custom.css'},
      }),
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'AgroTech Inteli',
        logo: {
          alt: 'AgroTech Inteli',
          src: 'img/logo.png',
        },
        items: [
          {type: 'docSidebar', sidebarId: 'trilhaSidebar', position: 'left', label: 'Documentação'},
          {
            href: 'https://github.com/AgroTech-Inteli-ATI/2026_02_TRAINEE_EDUCACIONAL_02',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documentação',
            items: [{label: 'Início', to: '/'}],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} AgroTech Inteli. Construído com Docusaurus.`,
      },
      prism: {theme: prismThemes.github, darkTheme: prismThemes.dracula},
    }),
};

export default config;
