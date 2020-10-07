import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';

//Components
import Resource from './resource';

//Types
import { Resource as ResourceType } from '../types';
type QueryResult = {
  allResources: { edges: { node: ResourceType }[] };
};

const Resources = () => {
  /**
   * Query
   */
  const data = useStaticQuery<QueryResult>(graphql`
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
