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
    margin: 0 auto;
    font-size: 16px;
  }
`;

const IndexPage = () => (
  <Layout>
    <SEO title="My tiny blog" />

    <StyledHero>
      <div className="shell">
        <p>
          Thanks for passing by!
          <br />
          This blog is something like my personal library for interesting
          articles related to development. Also I'll give my best to write on
          some interesting topic once a week, so bear with me.
          <br />
          If you wanna know more about me take a look at my social media
          profiles above.
          <br />
          Cheers!
        </p>
      </div>
    </StyledHero>
    <Feed />
  </Layout>
);

export default IndexPage;
