'use strict';

require('dotenv').config();
require('source-map-support').install();
require('ts-node').register();

module.exports = {
  siteMetadata: {
    title: `JavaScript developers space`,
    description: `Tiny blog focused on developers. Here you will find articles from different sources like Medium, freeCodeCamp, Smashing Magazine, etc. There are also authored articles about JavaScript trending topics. Hope you like it!`,
    author: `@mobbdev`,
    siteUrl: `https://mobb.dev`,
  },
  plugins: [
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        // The property ID; the tracking code won't be generated without it
        trackingId: `${process.env.GOOGLE_TRACKING_ID}`,
        // Defines where to place the tracking script - `true` in the head and `false` in the body
        head: true,
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src/`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `mobb.dev`,
        short_name: `mobb.dev`,
        start_url: `/`,
        background_color: `#333`,
        theme_color: `#f5f3ce`,
        display: `minimal-ui`,
        icon: `src/images/favicon.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [`Inconsolata\:400,700`, `Titillium Web\:400,500,700`],
        display: 'swap',
      },
    },
    {
      resolve: `gatsby-plugin-firebase`,
      options: {
        features: {
          auth: true,
          database: true,
          firestore: false,
          storage: false,
          messaging: false,
          functions: true,
          performance: false,
        },
      },
    },
    {
      resolve: `gatsby-source-firebase`,
      options: {
        // point to the firebase private key downloaded
        credential: JSON.parse(process.env.GATSBY_FIREBASE_API_JSON),

        // your firebase database root url
        databaseURL: process.env.GATSBY_FIREBASE_DATABASE_URL,

        types: [
          {
            type: 'Articles',
            path: 'articles',
          },
          {
            type: 'Resources',
            path: 'resources',
          },
        ],
      },
    },
    `gatsby-plugin-typescript`,
    `gatsby-plugin-netlify`,
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-robots-txt`,
    `gatsby-plugin-offline`,
  ],
};
