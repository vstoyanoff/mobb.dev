import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';

/*
 * This component is built using `gatsby-image` to automatically serve optimized
 * images with lazy loading and reduced file sizes. The image is loaded using a
 * `useStaticQuery`, which allows us to load the image from directly within this
 * component, rather than having to pass the image data down from pages.
 *
 * For more information, see the docs:
 * - `gatsby-image`: https://gatsby.dev/gatsby-image
 * - `useStaticQuery`: https://www.gatsbyjs.org/docs/use-static-query/
 */

const useImages = () => {
  const query = useStaticQuery(graphql`
    query {
      iconGatsby: file(relativePath: { eq: "images/icon-gatsby.png" }) {
        childImageSharp {
          fixed(width: 24, height: 24) {
            ...GatsbyImageSharpFixed_withWebp
          }
        }
      }
      iconMobbDev: file(relativePath: { eq: "images/favicon.png" }) {
        childImageSharp {
          fixed(width: 48, height: 48) {
            ...GatsbyImageSharpFixed_withWebp
          }
        }
      }
      logoWebpack: file(relativePath: { eq: "images/logo-webpack.png" }) {
        childImageSharp {
          fluid {
            ...GatsbyImageSharpFluid_withWebp
          }
        }
      }
      logoWebpackWhite: file(
        relativePath: { eq: "images/logo-webpack-white.png" }
      ) {
        childImageSharp {
          fluid {
            ...GatsbyImageSharpFluid_withWebp
          }
        }
      }
    }
  `);

  return query;
};

export const IconGatsby = () => {
  const { iconGatsby } = useImages();

  return <Img fixed={iconGatsby.childImageSharp.fixed} />;
};

export const IconMobbDev = () => {
  const { iconMobbDev } = useImages();

  return <Img fixed={iconMobbDev.childImageSharp.fixed} />;
};

export const WebpackLogo = props => {
  const { logoWebpack } = useImages();

  return <Img {...props} fluid={logoWebpack.childImageSharp.fluid} />;
};

export const WebpackLogoWhite = props => {
  const { logoWebpackWhite } = useImages();

  return <Img {...props} fluid={logoWebpackWhite.childImageSharp.fluid} />;
};
