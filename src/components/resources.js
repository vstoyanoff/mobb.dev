import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';

import Resource from './resource';

const Resources = () => {
  /**
   * Query
   */
  const data = useStaticQuery(graphql`
    query resources {
      allResources {
        edges {
          node {
            title
            description
            image
            url
          }
        }
      }
    }
  `);

  return (
    <section>
      <div className="shell">
        {data.allResources.edges.map(({ node }, i) => (
          <Resource key={i} data={node} />
        ))}
      </div>
    </section>
  );
};

export default Resources;
