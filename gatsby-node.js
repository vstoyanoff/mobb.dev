/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require(`path`);

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const result = await graphql(`
    query {
      allArticles {
        edges {
          node {
            title
            description
            id
            image
            site
            type
            url
          }
        }
      }
    }
  `);
  result.data.allArticles.edges.forEach(({ node }) => {
    if (node.type === 'authored') {
      createPage({
        path: node.url,
        component: path.resolve(`./src/templates/article.js`),
        context: {
          url: node.url,
          image: node.image,
          title: node.title,
          description: node.description,
          content: node.content,
        },
      });
    }
  });
};
