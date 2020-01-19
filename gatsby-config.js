require('dotenv').config();

module.exports = {
  siteMetadata: {
    title: `Mobb Dev`,
    description: `Check out my personal library for interesting dev related articles. Hope you like it!`,
    author: `@mobbdev`,
  },
  plugins: [
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
      resolve: `gatsby-plugin-prefetch-google-fonts`,
      options: {
        fonts: [
          {
            family: `Titillium Web`,
            variants: [`400`, `500`, `700`],
          },
          {
            family: `Inconsolata`,
            variants: [`400`, `700`],
          },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-firebase',
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
        credential: JSON.parse(process.env.FIREBASE_API_KEY),

        // your firebase database root url
        databaseURL: process.env.GATSBY_FIREBASE_DATABASE_URL,

        types: [
          {
            type: 'Articles',
            path: 'articles',
          },
        ],
      },
    },
    `gatsby-plugin-netlify`,
    `gatsby-plugin-netlify-cache`,
    `gatsby-plugin-styled-components`,
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
};
