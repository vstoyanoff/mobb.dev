import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';

import FeedItem from './feed-item';

const Feed = () => {
  const data = useStaticQuery(graphql`
    query articles {
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
            state
            featured
          }
        }
      }
    }
  `);

  const featured = [...data.allArticles.edges]
    .filter(
      article => article.node.featured && article.node.state === 'published'
    )
    .reverse();
  const articles = [...data.allArticles.edges]
    .reverse()
    .filter(
      article => article.node.state === 'published' && !article.node.featured
    );
  const allArticles = [...featured, ...articles];

  return (
    <section>
      <div className="shell">
        {allArticles.map(article => (
          <FeedItem key={article.node.id} data={article.node} />
        ))}
      </div>
    </section>
  );
};

export default Feed;
