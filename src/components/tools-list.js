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
  {
    name: 'CSS Transform Functions Visualizer',
    description: 'CSS3 2D / 3D Transform Functions Visualizer and Playground',
    image:
      'https://cdn.jsdelivr.net/gh/alterebro/css-transform/media/css-transform.jpg',
    darkImage:
      'https://cdn.jsdelivr.net/gh/alterebro/css-transform/media/css-transform.jpg',
    url:
      'https://css-transform.moro.es/?fbclid=IwAR1ZM-nBtXGzKVLSvX0VFM4QJv_BTly6zBhh1D3JNFTj8Si7mcDD4lKNnmg',
    external: true,
  },
  {
    name: 'CSS Grid Generator',
    description: 'Easy way to set up your CSS Grid',
    image: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/og-cssgrid.jpg',
    darkImage:
      'https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/og-cssgrid.jpg',
    url: 'https://cssgrid-generator.netlify.app/',
    external: true,
  },
  {
    name: 'CSS Section Separator Generator | wweb.dev',
    description:
      'A collection of customizable CSS section separators, with the possibility to easily copy the code.',
    image:
      'https://ik.imagekit.io/wwebdev/resources/css-separator-generator_7lds84DdzGW.png',
    darkImage:
      'https://ik.imagekit.io/wwebdev/resources/css-separator-generator_7lds84DdzGW.png',
    url: 'https://wweb.dev/resources/css-separator-generator',
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
  box-shadow: 6px 6px 14px 0 rgba(20, 20, 20, 0.2),
    -8px -8px 18px 0 rgba(255, 255, 255, 0.55);
  border-radius: 30px;
  padding: 20px;

  .dark-mode & {
    box-shadow: 6px 6px 14px 0 rgba(20, 20, 20, 0.2),
      -8px -8px 18px 0 rgba(20, 20, 20, 0.35);
  }

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

      &.image--dark {
        display: block;
      }
    }
  }

  article {
    padding-left: 30px;
  }

  h2 a {
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: 768px) {
    display: block;
    margin-bottom: 100px;

    .image-wrapper,
    article {
      width: 100%;
    }

    .image-wrapper {
      margin-bottom: 20px;
    }

    article {
      padding-left: 0px;
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
                <img className="image" src={tool.image} alt={tool.name} />

                <img
                  className="image image--dark"
                  src={tool.darkImage}
                  alt={tool.name}
                />
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
