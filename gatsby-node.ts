/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';

//Types
import { GatsbyNode } from 'gatsby';
import { Article } from './src/types';
type QueryResult = {
  allArticles: {
    edges: {
      node: Article;
    }[];
  };
};

export const createPages: GatsbyNode['createPages'] = async ({
  graphql,
  actions,
}) => {
  const { createPage } = actions;
  const result = await graphql<QueryResult>(`
    query {
      allArticles(sort: { fields: date, order: DESC }) {
        edges {
          node {
            date
            type
            url
            image
            title
            description
            content
            site
            featured
            state
          }
        }
      }
    }
  `);

  if (result.errors) {
    throw result.errors;
  }

  if (!result.data) {
    throw new Error('ERROR: Could not fetch posts on build');
  }

  //Generate authored articles pages
  result.data.allArticles.edges.forEach(({ node }: { node: Article }) => {
    if (node.type === 'authored') {
      createPage({
        path: node.url,
        component: path.resolve(`./src/templates/article.tsx`),
        context: {
          date: node.date,
          type: node.type,
          url: node.url,
          image: node.image,
          title: node.title,
          description: node.description,
          content: node.content,
          site: node.site,
          featured: node.featured,
          state: node.state,
        },
      });
    }
  });

  //Generate pagination files
  const articles = result.data.allArticles.edges.filter(
    ({ node }: { node: Article }) =>
      node.state === 'published' && !node.featured
  );
  const countArticlesPerPage = 6;
  const countPages = Math.ceil(articles.length / countArticlesPerPage);
  const dir = 'public/articles/';

  rimraf.sync(dir);
  fs.mkdirSync(dir);

  function createJSON(index: number, data: { node: Article }[]) {
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
