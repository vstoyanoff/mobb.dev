import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { WebpackLogo, WebpackLogoWhite } from './images';

const tools = [
  {
    name: 'Webpack Config Generator',
    description:
      'Quickly build simple Webpack powered boilerplate. You can customize accoring to you needs and in the end you will receive zipped project boilerplate',
    image: WebpackLogo,
    darkImage: WebpackLogoWhite,
    url: '/tools/webpack-config-generator',
  },
];

const StyledList = styled.ul`
  padding-left: 0;
  list-style-type: none;
  margin-left: 0;
  margin-bottom: 0;
`;

const StyledListItem = styled.li`
  display: flex;
  align-items: 'center';
  margin-bottom: 40px;

  .image-wrapper,
  article {
    display: block;
    width: 50%;
  }

  .image {
    &:hover {
      opacity: 0.7;
    }

    &--dark {
      display: none;
    }

    .dark-mode & {
      display: none;

      &--dark {
        display: block;
      }
    }
  }

  h2 a {
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: 768px) {
    display: block;

    .image-wrapper,
    article {
      width: 100%;
    }

    .image-wrapper {
      margin-bottom: 20px;
    }
  }
`;

const ToolsList = () => (
  <section>
    <div className="shell">
      <StyledList>
        {tools.map(tool => (
          <StyledListItem>
            <Link className="image-wrapper" to={tool.url}>
              <tool.image className="image" />

              <tool.darkImage className="image image--dark" />
            </Link>

            <article>
              <h2>
                <Link to={tool.url}>{tool.name}</Link>
              </h2>

              <p>{tool.description}</p>
            </article>
          </StyledListItem>
        ))}
      </StyledList>
    </div>
  </section>
);

export default ToolsList;
