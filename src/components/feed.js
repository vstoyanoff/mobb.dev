import React from 'react';
import styled from 'styled-components';
import { useStaticQuery, graphql } from 'gatsby';

//Components
import FeedItem from './feed-item';

//Utils
import debounce from '../utils/debounce';

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
      -8px -8px 18px 0 rgba(20, 20, 20, 0.35);
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
  const { allArticles, featured, firstPage } = useStaticQuery(graphql`
    query articles {
      allArticles: allArticles(sort: { fields: date, order: DESC }) {
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
      featured: allArticles(
        filter: { featured: { eq: true }, state: { eq: "published" } }
        sort: { fields: date, order: DESC }
      ) {
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
      firstPage: allArticles(limit: 6, sort: { fields: date, order: DESC }) {
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
  const [articles, setArticles] = React.useState(firstPage.edges);
  const [filteredArticles, setFilteredArticles] = React.useState(
    firstPage.edges
  );
  const [filter, setFilter] = React.useState('All');
  const [nextPage, setNextPage] = React.useState(2);
  const filters = React.useMemo(
    () =>
      Array.from(new Set(allArticles.edges.map(article => article.node.site))),
    [allArticles]
  );

  /**
   * Methods
   */
  const applyFilter = arr => {
    if (filter === 'All') {
      return arr;
    } else {
      return arr.filter(({ node }) => node.site === filter);
    }
  };

  const fetchArticles = async () => {
    if (nextPage === null) {
      return;
    }

    const json = await fetch(`/articles/articles-${nextPage}.json`).then(res =>
      res.json()
    );
    setArticles([...articles, ...json.data]);
    setFilteredArticles([...filteredArticles, ...applyFilter(json.data)]);
    setNextPage(json.currentPage < json.pages ? nextPage + 1 : null);
  };

  const loadMore = debounce(async () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 500 >=
      document.body.clientHeight
    ) {
      await fetchArticles();
    }
  }, 100);

  /**
   * Hooks
   */
  React.useEffect(() => setFilteredArticles(applyFilter(articles)), [filter]);
  React.useEffect(() => {
    window.addEventListener('scroll', loadMore);

    return () => window.removeEventListener('scroll', loadMore);
  }, [loadMore]);

  return (
    <section>
      <div className="shell">
        <FeaturedSection>
          <h2>Featured picks</h2>

          {featured.edges.map((article, i) => (
            <FeedItem key={article.node.id} data={article.node} />
          ))}
        </FeaturedSection>

        <h3>Let's filter!</h3>

        <StyledFilter>
          <div className="option">
            <p>By provider: </p>
            <select
              defaultValue="All"
              onChange={e => setFilter(e.target.value)}
            >
              <option value="All">All articles</option>

              {filters.map(filter => (
                <option key={filter} value={filter}>
                  {filter ? filter : 'Mobb.dev'}
                </option>
              ))}
            </select>
          </div>
        </StyledFilter>

        {filteredArticles.map(article => (
          <FeedItem key={article.node.id} data={article.node} />
        ))}
      </div>
    </section>
  );
};

export default Feed;
