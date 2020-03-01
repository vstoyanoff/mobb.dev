import React from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';

import Layout from '../../components/layout';
import ToolsList from '../../components/tools-list';
import SEO from '../../components/seo';

const StyledHero = styled.section`
  text-align: center;

  .shell {
    padding-top: 0;
  }

  p {
    max-width: 700px;
    margin: 0 auto;
    font-size: 20px;
  }
`;

const ToolsPage = () => (
  <Layout>
    <SEO
      title="JavaScript tools for easing developers"
      description="Custom-made tools for helping JavaScript developers on their way to make great things. Explore. Try. Use. Build."
    />

    <StyledHero>
      <div className="shell">
        <p>
          Custom tools to help <strong>you</strong> build your way in
          JavaScript. Check them out! <br />
          If you have recommendations or want to report a bug hit me -{' '}
          <Link to="/contact">contact</Link>
        </p>
      </div>
    </StyledHero>

    <ToolsList />
  </Layout>
);

export default ToolsPage;
