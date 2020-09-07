import React from 'react';

import Layout from '../components/layout';
import SEO from '../components/seo';

const NotFoundPage: React.FC = () => (
  <Layout>
    <SEO title="404: Not found" />
    <div className="shell" style={{ textAlign: 'center' }}>
      <h2>NOT FOUND</h2>
      <p>Oops...it seems that you made a mistake</p>
    </div>
  </Layout>
);

export default NotFoundPage;
