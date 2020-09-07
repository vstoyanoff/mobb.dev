import React from 'react';
import styled from 'styled-components';

//Components
import Layout from '../components/layout';
import RichText from '../components/rich-text';
import SEO from '../components/seo';

//Types
import { Article as ArticleType } from '../types';

//Local styled components
const Header = styled.header`
  margin-bottom: 30px;
`;

const Description = styled.h2`
  font-size: 20px;
`;

const PublishedOn = styled.p`
  font-size: 16px;
  color: darkgray;
  margin-bottom: 0;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
`;

const Article = ({ pageContext }: { pageContext: ArticleType }) => {
  return (
    <Layout>
      <SEO
        title={pageContext.title}
        image={pageContext.image}
        description={pageContext.description}
      />

      <section>
        <div className="shell">
          <Header>
            <h1>{pageContext.title}</h1>

            {pageContext.image && (
              <Image src={pageContext.image} alt={pageContext.title} />
            )}

            <Description>{pageContext.description}</Description>

            <PublishedOn>
              Published on{' '}
              {new Date(pageContext.date.toString()).toLocaleDateString()}
            </PublishedOn>
          </Header>

          <article>
            <RichText data={pageContext.content} auth={false} />
          </article>
        </div>
      </section>
    </Layout>
  );
};

export default Article;
