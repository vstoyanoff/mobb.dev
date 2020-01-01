import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';

const StyledItem = styled.article`
  display: flex;
  position: relative;
  align-items: center;

  a {
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  .feed-item-image {
    width: 35%;
    height: 100%;
    margin-right: 2%;
  }

  img {
    object-fit: cover;
    object-position: center;
    width: 100%;
    border: 2px solid #333;
    margin-bottom: 0;

    .dark-mode & {
      border-color: #f5f3ce;
    }

    &:hover {
      opacity: 0.6;
    }
  }

  div {
    width: 63%;
    padding: 20px 0;
  }
`;

const FeedItem = ({ data }) => (
  <StyledItem>
    {data.image !== 'No Image' &&
      (data.type === 'external' ? (
        <a
          className="feed-item-image"
          target="_blank"
          rel="noopener noreferrer"
          href={data.url}
        >
          <img src={data.image} alt={data.title} />
        </a>
      ) : (
        <Link to={data.url}>
          <img src={data.image} alt={data.title} />
        </Link>
      ))}

    <div>
      <h3>
        <a target="_blank" rel="noopener noreferrer" href={data.url}>
          {data.title}
        </a>
      </h3>

      {data.site && (
        <h4 style={{ fontWeight: 500 }}>
          Published in:{' '}
          <strong>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://www.google.com/search?q=${data.site}`}
            >
              {data.site}
            </a>
          </strong>
        </h4>
      )}

      <p style={{ marginBottom: 0 }}>{data.description}</p>
    </div>
  </StyledItem>
);

export default FeedItem;
