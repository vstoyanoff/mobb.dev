import React from 'react';
import { OutboundLink } from 'gatsby-plugin-google-analytics';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { highlight } from '../utils';

const StyledItem = styled.article`
  display: flex;
  position: relative;
  align-items: center;
  margin-bottom: 50px;
  box-shadow: 6px 6px 14px 0 rgba(20, 20, 20, 0.2),
    -8px -8px 18px 0 rgba(255, 255, 255, 0.55);
  border-radius: 30px;
  padding: 20px;

  .dark-mode & {
    box-shadow: 6px 6px 14px 0 rgba(20, 20, 20, 0.2),
      -8px -8px 18px 0 rgba(20, 20, 20, 0.35);
  }

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 767px) {
    display: block;
  }

  a {
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  .feed-item-image {
    display: block;
    width: 35%;
    margin-right: 3%;

    @media (max-width: 767px) {
      width: 100%;
      margin-right: 0;
    }
  }

  img {
    display: block;
    object-fit: cover;
    object-position: center;
    margin: 0 auto;

    &:hover {
      opacity: 0.8;
    }
  }

  div {
    width: 63%;
    padding: 20px 0;

    @media (max-width: 767px) {
      width: 100%;
    }
  }
`;

const FeedItem = ({ data, term }) => (
  <StyledItem>
    {data.image &&
      (data.type === 'external' ? (
        <OutboundLink
          className="feed-item-image"
          target="_blank"
          rel="noopener noreferrer"
          href={data.url}
        >
          <img src={data.image} alt={data.title} />
        </OutboundLink>
      ) : (
        <Link to={`/${data.url}`} className="feed-item-image">
          <img src={data.image} alt={data.title} />
        </Link>
      ))}

    <div>
      {data.featured && (
        <p style={{ fontFamily: 'Inconsolata' }}>
          <em>FEATURED</em>
        </p>
      )}

      <h3>
        {data.type === 'external' ? (
          <OutboundLink
            target="_blank"
            rel="noopener noreferrer"
            href={data.url}
            dangerouslySetInnerHTML={{
              __html: highlight(data.title, term),
            }}
          />
        ) : (
          <Link
            to={`/${data.url}`}
            dangerouslySetInnerHTML={{
              __html: highlight(data.title, term),
            }}
          />
        )}
      </h3>

      {data.site && (
        <h4 style={{ fontWeight: 500 }}>
          Published in:{' '}
          <strong>
            <OutboundLink
              target="_blank"
              rel="noopener noreferrer"
              href={`https://www.google.com/search?q=${data.site}`}
            >
              {data.site}
            </OutboundLink>
          </strong>
        </h4>
      )}

      <p
        style={{ marginBottom: 0 }}
        dangerouslySetInnerHTML={{ __html: highlight(data.description, term) }}
      />
    </div>
  </StyledItem>
);

export default FeedItem;
