import React from 'react';
import styled from 'styled-components';

import Layout from '../components/layout';
import SEO from '../components/seo';
import Resources from '../components/resources';

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

const ResourcesPage = () => (
  <Layout>
    <SEO
      title="Web Developer Resources"
      description="Useful tools, websites, personal blogs and many more helpful resources."
    />

    <StyledHero>
      <div className="shell">
        <p>
          Check out my favourite JavaScript resources.
          <br />
          Here you will find useful tools, websites, personal blogs and many
          more helpful resources.
        </p>
      </div>
    </StyledHero>

    <Resources />
  </Layout>
);

export default ResourcesPage;
