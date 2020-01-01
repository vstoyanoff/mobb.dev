import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import Layout from '../components/layout';
import SEO from '../components/seo';
import RichText from '../components/rich-text';
import FeedItem from '../components/feed-item';

const StyledFields = styled.fieldset`
  border: none;
  padding: 0 0 10px;

  label {
    margin: 0 5px;
    cursor: pointer;
  }

  input {
    display: inline-block;
    vertical-align: middle;
    margin-right: 5px;
  }

  span {
    display: inline-block;
    vertical-align: middle;
  }
`;

const StyledInput = styled.input`
  width: 100%;
  background-color: transparent;
  border: 2px solid #333;
  padding: 10px;
  margin-bottom: 10px;
  color: #333;
  outline: none;

  .dark-mode & {
    border-color: #f5f3ce;
    color: #f5f3ce;
  }
`;

const StyledButton = styled.button`
  background: transparent;
  border: 2px solid #333;
  color: #333;
  padding: 8px 20px;
  text-transform: uppercase;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  font-size: 14px;
  margin-right: 10px;

  &:disabled {
    opacity: 0.4;
    pointer-events: none;
  }

  &:hover:disabled {
    cursor: not-allowed;
  }

  &:hover {
    background: #333;
    color: #f5f3ce;
  }

  .dark-mode & {
    color: #f5f3ce;
    border-color: #f5f3ce;

    &:hover {
      background: #f5f3ce;
      color: #333;
    }
  }
`;

const Add = () => {
  /**
   * State
   */
  const [type, setType] = React.useState('external');
  const [url, setUrl] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState({ content: '' });

  /**
   * Methods
   */
  const getMetaData = async url => {
    try {
      setLoading(true);
      const data = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
      const html = await data.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const metaImage = doc.querySelector("meta[property='og:image']");
      const description =
        doc.querySelector("meta[name='description']") ||
        doc.querySelector("meta[property='og:description']");
      const title = doc.querySelector('title');
      const site = doc.querySelector("meta[property='og:site_name']");
      setData({
        url,
        type,
        image: metaImage ? metaImage.content : 'No Image',
        title: title ? title.text : 'No Title',
        description: description ? description.content : 'No Description',
        site: site && site.content,
      });
      setLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Layout>
      <SEO title="Add" />

      <section>
        <div className="shell">
          <h2>A tiny form for adding new article</h2>

          <h3>1. Choose the type</h3>

          <StyledFields>
            <label htmlFor="external">
              <input
                type="radio"
                name="type"
                id="external"
                value="external"
                checked={type === 'external'}
                onClick={() => setType('external')}
              />{' '}
              <span>External</span>
            </label>

            <label htmlFor="authored">
              <input
                type="radio"
                name="type"
                id="authored"
                value="authored"
                checked={type === 'authored'}
                onClick={() => setType('authored')}
              />{' '}
              <span>Authored</span>
            </label>
          </StyledFields>

          {type === 'external' ? (
            <>
              <h3>2. Add the damn link</h3>

              <StyledInput
                type="url"
                placeholder="Paste article url here"
                onChange={event => setUrl(event.target.value)}
              />

              <div style={{ display: 'flex', alignItems: 'center' }}>
                <StyledButton
                  onClick={() => getMetaData(url)}
                  disabled={url === ''}
                >
                  Generate Preview
                </StyledButton>

                {loading && <FontAwesomeIcon icon={faSpinner} spin />}
              </div>

              {data.url && type === 'external' && (
                <>
                  <h3 style={{ marginTop: 30 }}>3. See the preview</h3>

                  <FeedItem data={data} />
                </>
              )}
            </>
          ) : (
            <>
              <h3>2. Upload cover photo</h3>

              <h3>3. Now make some magic</h3>

              <RichText
                edit={true}
                data={data.content}
                onChange={content => setData({ content })}
              />
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Add;
