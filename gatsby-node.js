/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require(`path`);
const fs = require(`fs`);
const rimraf = require(`rimraf`);

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const result = await graphql(`
    query {
      allArticles(sort: { fields: date, order: DESC }) {
        edges {
          node {
            title
            description
            id
            image
            site
            type
            url
            state
            featured
          }
        }
      }
    }
  `);

  //Generate authored articles pages
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

  //Generate pagination files
  const articles = result.data.allArticles.edges.filter(
    article => article.node.state === 'published' && !article.node.featured
  );
  const countArticlesPerPage = 6;
  const countPages = Math.ceil(articles.length / countArticlesPerPage);
  const dir = 'public/articles/';

  rimraf.sync(dir);
  fs.mkdirSync(dir);

  function createJSON(index, data) {
    const filePath = dir + 'articles-' + index + '.json';
    const dataToSave = JSON.stringify({
      pages: countPages,
      currentPage: index,
      data,
    });

    fs.writeFile(filePath, dataToSave, function(err) {
      if (err) {
        return console.log(err);
      }
    });
  }

  for (let i = 1; i <= countPages; i++) {
    const startIndex = countArticlesPerPage * (i - 1);
    const endIndex = startIndex + countArticlesPerPage;
    const pageArticles = articles.slice(startIndex, endIndex);

    createJSON(i, pageArticles);
  }
};
