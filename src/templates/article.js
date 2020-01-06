import React from 'react';
import { graphql } from 'gatsby';
import styled from 'styled-components';

import Layout from '../components/layout';
import RichText from '../components/rich-text';
import SEO from '../components/seo';

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
  height: 500px;
  object-fit: cover;
  object-position: center;
`;

const Article = ({ data }) => {
  const date = new Date(parseInt(data.articles.id));

  return (
    <Layout>
      <SEO
        title={data.articles.title}
        image={data.articles.image}
        description={data.articles.description}
      />

      <section>
        <div className="shell">
          <Header>
            <h1>{data.articles.title}</h1>

            {data.articles.image && (
              <Image src={data.articles.image} alt={data.articles.title} />
            )}

            <Description>{data.articles.description}</Description>

            <PublishedOn>Published on {date.toLocaleDateString()}</PublishedOn>
          </Header>

          <article>
            <RichText data={data.articles.content} auth={false} />
          </article>
        </div>
      </section>
    </Layout>
  );
};

export const query = graphql`
  query($url: String!) {
    articles(url: { eq: $url }) {
      id
      image
      title
      description
      content
    }
  }
`;

export default Article;
