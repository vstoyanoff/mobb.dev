import React from 'react';

import Layout from '../components/layout';
import Feed from '../components/feed';
import SEO from '../components/seo';

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Feed />
  </Layout>
);

export default IndexPage;
