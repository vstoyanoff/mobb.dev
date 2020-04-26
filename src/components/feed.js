import React from 'react';
import styled from 'styled-components';
import { useStaticQuery, graphql } from 'gatsby';

import FeedItem from './feed-item';

const FeaturedSection = styled.div`
  padding: 30px;
  margin-bottom: 50px;
  box-shadow: 6px 6px 14px 0 rgba(20, 20, 20, 0.2),
    -8px -8px 18px 0 rgba(255, 255, 255, 0.55);
  border-radius: 30px;

  article {
    box-shadow: none !important;
    padding: 0 !important;
  }

  .dark-mode & {
    box-shadow: 6px 6px 14px 0 rgba(20, 20, 20, 0.2),
      -8px -8px 18px 0 rgba(20, 20, 20, 0.55);
  }

  @media (max-width: 767px) {
    padding: 30px 15px;
  }
`;

const StyledFilter = styled.div`
  padding: 20px 0;
  margin-bottom: 30px;

  select {
    background-color: transparent;
    appearance: none;
    border: none;
    border-bottom: 1px solid #333;
    border-radius: 0px;
    margin-bottom: 10px;
    color: #333;
    outline: none;
    min-width: 250px;
    margin-bottom: 0px;

    .dark-mode & {
      border-color: #f5f3ce;
      color: #f5f3ce;
    }
  }

  .option {
    display: flex;
    align-items: center;

    & + .option {
      margin-top: 20px;
    }

    @media (max-width: 767px) {
      display: block;
    }

    p {
      margin-bottom: 0px;
      margin-right: 10px;

      @media (max-width: 767px) {
        margin-bottom: 10px;
      }
    }
  }
`;

const Feed = () => {
  /**
   * Query
   */
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

  /**
   * State
   */
  const [articles, setArticles] = React.useState(
    [...data.allArticles.edges]
      .reverse()
      .filter(
        article => article.node.state === 'published' && !article.node.featured
      )
  );

  const featured = [...data.allArticles.edges]
    .filter(
      article => article.node.featured && article.node.state === 'published'
    )
    .reverse();

  const filters = React.useMemo(
    () =>
      Array.from(
        new Set(data.allArticles.edges.map(article => article.node.site))
      ),
    [data.allArticles]
  );

  /**
   * Methods
   */
  const handleFilter = e => {
    const val = e.target.value;
    if (val !== 'All') {
      setArticles(
        [...data.allArticles.edges].reverse().filter(a => a.node.site === val)
      );
    } else {
      setArticles(
        [...data.allArticles.edges]
          .reverse()
          .filter(
            article =>
              article.node.state === 'published' && !article.node.featured
          )
      );
    }
  };

  return (
    <section>
      <div className="shell">
        <FeaturedSection>
          <h2>Featured picks</h2>

          {featured.map((article, i) => (
            <FeedItem key={article.node.id} data={article.node} />
          ))}
        </FeaturedSection>

        <h3>Let's filter!</h3>

        <StyledFilter>
          <div className="option">
            <p>By provider: </p>
            <select defaultValue="All" onChange={handleFilter}>
              <option value="All">All articles</option>

              {filters.map(filter => (
                <option key={filter} value={filter}>
                  {filter ? filter : 'Mobb.dev'}
                </option>
              ))}
            </select>
          </div>
        </StyledFilter>

        {articles.map(article => (
          <FeedItem key={article.node.id} data={article.node} />
        ))}
      </div>
    </section>
  );
};

export default Feed;
