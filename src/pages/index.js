import React from 'react';
import styled from 'styled-components';

import Layout from '../components/layout';
import Feed from '../components/feed';
import SEO from '../components/seo';

const StyledHero = styled.section`
  text-align: center;

  .shell {
    padding-top: 0;
  }

  p {
    max-width: 700px;
    margin: 0 auto 20px;
    font-size: 16px;
  }
`;

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <StyledHero>
      <div className="shell">
        <p>
          Thanks for passing by! <br /> I really love JavaScript and Functional
          Programming so below you will find articles primary related to these
          things. Some of them are written by me while others are from various
          sources some of which are the big names in the game.
          <br />
          If you wanna know more about me take a look at my social media
          profiles above. <br />
          Cheers!
        </p>
      </div>
    </StyledHero>
    <Feed />
  </Layout>
);

export default IndexPage;
