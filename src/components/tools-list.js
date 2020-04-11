import React from 'react';
import { Link } from 'gatsby';
import { OutboundLink } from 'gatsby-plugin-google-analytics';
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
  {
    name: 'JavaScript Obfuscator Tool',
    description:
      "This tool transforms your original JavaScript source code into a new representation that's harder to understand, copy, re-use and modify without authorization. The obfuscated result will have the exact functionality of the original code.",
    image: 'https://obfuscator.io/static/images/logo.png',
    darkImage: 'https://obfuscator.io/static/images/logo.png',
    url: 'https://obfuscator.io/',
    external: true,
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

  .image-wrapper {
    text-align: center;
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
            {tool.external ? (
              <OutboundLink
                className="image-wrapper"
                target="_blank"
                rel="noopener noreferrer"
                href={tool.url}
              >
                <img className="image" src={tool.image} />
              </OutboundLink>
            ) : (
              <Link className="image-wrapper" to={tool.url}>
                <tool.image className="image" />

                <tool.darkImage className="image image--dark" />
              </Link>
            )}

            <article>
              <h2>
                {tool.external ? (
                  <OutboundLink
                    target="_blank"
                    rel="noopener noreferrer"
                    href={tool.url}
                  >
                    {tool.name}
                  </OutboundLink>
                ) : (
                  <Link to={tool.url}>{tool.name}</Link>
                )}
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
