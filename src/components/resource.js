import React from 'react';
import { OutboundLink } from 'gatsby-plugin-google-analytics';
import styled from 'styled-components';

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
      -8px -8px 18px 0 rgba(20, 20, 20, 0.55);
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

  .image {
    display: flex;
    height: 250px;
    width: 35%;
    margin-right: 3%;
    align-items: center;
    justify-content: center;

    @media (max-width: 767px) {
      width: 100%;
      margin-right: 0;
    }
  }

  img {
    display: block;
    max-width: 100%;
    max-height: 100%;
    height: auto;
    margin-bottom: 0;

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

const Resource = ({ data }) => (
  <StyledItem>
    <OutboundLink
      className="image"
      target="_blank"
      rel="noopener noreferrer"
      href={data.url}
    >
      {data.image ? <img src={data.image} alt={data.title} /> : 'No image'}
    </OutboundLink>

    <div>
      <h3>
        <OutboundLink target="_blank" rel="noopener noreferrer" href={data.url}>
          {data.title}
        </OutboundLink>
      </h3>

      <p style={{ marginBottom: 0 }}>{data.description}</p>
    </div>
  </StyledItem>
);

export default Resource;
