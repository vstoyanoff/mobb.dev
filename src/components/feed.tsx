import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useStaticQuery, graphql } from 'gatsby';

//Components
import FeedItem from './feed-item';

//Utils
import { debounce, throttle, pipe } from '../utils';

//Types
import { Article } from '../types';
type QueryResult = {
  total: { totalCount: number };
  siteFilters: { distinct: string[] };
  featured: { edges: { node: Article }[] };
  firstPage: { edges: { node: Article }[] };
};

//Local styled components
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
  display: flex;
  align-items: center;

  @media (max-width: 767px) {
    display: block;
  }

  h3 {
    margin-bottom: 0;
    margin-right: 20px;

    @media (max-width: 767px) {
      margin-right: 0px;
      margin-bottom: 20px;
    }
  }

  select {
    background-color: transparent;
    appearance: none;
    border: none;
    border-bottom: 1px solid #333;
    border-radius: 0px;
    color: #333;
    outline: none;
    min-width: 250px;
    margin-bottom: 0px;

    .dark-mode & {
      border-color: #fff;
      color: #fff;
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

const StyledSearch = styled.div`
  padding: 20px 0;
  margin-bottom: 30px;
  display: flex;
  align-items: center;

  @media (max-width: 767px) {
    display: block;
  }

  h3 {
    margin-bottom: 0;
    margin-right: 20px;

    @media (max-width: 767px) {
      margin-right: 0px;
      margin-bottom: 20px;
    }
  }

  input {
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
      border-color: #fff;
      color: #fff;
    }
  }
`;

const Feed: React.FC = () => {
  /**
   * Query
   */
  const { total, siteFilters, featured, firstPage } = useStaticQuery<
    QueryResult
  >(graphql`
    query articles {
      total: allArticles {
        totalCount
      }
      siteFilters: allArticles {
        distinct(field: site)
      }
      featured: allArticles(
        filter: { featured: { eq: true }, state: { eq: "published" } }
        sort: { fields: date, order: DESC }
      ) {
        edges {
          node {
            title
            description
            date
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
            date
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
  const [articles, setArticles] = useState<{ node: Article }[]>(
    firstPage.edges
  );
  const [filter, setFilter] = useState<string>('All');
  const [term, setTerm] = useState<string>('');
  const [nextPage, setNextPage] = useState<number>(2);
  const [fetching, setFetching] = useState<boolean>(false);

  const totalPages: number = Math.ceil(total.totalCount / 6);

  /**
   * Methods
   */
  const applyFilter = (arr: { node: Article }[]) => {
    if (filter === 'All') {
      return arr;
    } else {
      return arr.filter(({ node }) => node.site === filter);
    }
  };
  const applyTerm = (arr: { node: Article }[]) => {
    if (term === '') {
      return arr;
    } else {
      return arr.filter(
        ({ node }) =>
          node.title.toLowerCase().includes(term) ||
          node.description.toLowerCase().includes(term)
      );
    }
  };
  const refine = pipe(applyFilter, applyTerm);

  //Fetch articles from pages
  const fetchArticles = async (
    page: number
  ): Promise<{
    data: { node: Article }[] | [];
    currentPage: number;
    end?: boolean;
  }> => {
    if (page > totalPages) {
      return {
        data: [],
        currentPage: page,
        end: true,
      };
    }

    const json = await (await fetch(`/articles/articles-${page}.json`)).json();

    if (refine(json.data).length === 0) {
      const nextCall = await fetchArticles(page + 1);

      return {
        data: [...json.data, ...nextCall.data],
        currentPage: nextCall.currentPage,
      };
    } else {
      return {
        data: json.data,
        currentPage: json.currentPage,
      };
    }
  };

  //Trigger load more on end reached
  const loadMore = debounce(async () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 500 >=
        document.body.clientHeight &&
      !fetching &&
      nextPage <= totalPages
    ) {
      setFetching(true);
      const fetched = await fetchArticles(nextPage);

      if (fetched.end) {
        setNextPage(nextPage + 1);
        setFetching(false);
        return;
      }

      setArticles([...articles, ...fetched.data]);
      setNextPage(fetched.currentPage + 1);
      setFetching(false);
    }
  }, 200);

  /**
   * Hooks
   */
  useEffect(() => {
    window.addEventListener('scroll', loadMore);

    return () => window.removeEventListener('scroll', loadMore);
  }, [loadMore]);

  useEffect(() => {
    if (term === '' && filter === 'All') {
      setArticles(firstPage.edges);
      setNextPage(2);
    }
  }, [term, filter]);

  return (
    <section>
      <div className="shell">
        <FeaturedSection>
          <h2>Featured picks</h2>

          {featured.edges.map((article: { node: Article }) => (
            <FeedItem key={article.node.date} data={article.node} />
          ))}
        </FeaturedSection>

        <StyledFilter>
          <h3>Let's filter!</h3>

          <div className="option">
            <p>By provider: </p>

            <select
              defaultValue="All"
              onChange={e => setFilter(e.target.value)}
            >
              <option value="All">All</option>

              {siteFilters.distinct.map(filter => (
                <option key={filter} value={filter}>
                  {filter ? filter : 'Mobb.dev'}
                </option>
              ))}
            </select>
          </div>
        </StyledFilter>

        <StyledSearch>
          <h3>Search!</h3>

          <input
            type="text"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTerm(e.target.value.toLowerCase())
            }
          />
        </StyledSearch>

        {refine(articles).map((article: { node: Article }) => (
          <FeedItem key={article.node.date} data={article.node} term={term} />
        ))}
      </div>
    </section>
  );
};

export default Feed;
