import React from 'react';
import styled from 'styled-components';

import FeedItem from '../components/feed-item';

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
  margin-bottom: 20px;

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

const External = props => {
  return (
    <div>
      <h3>2. Add the damn link</h3>

      <StyledInput
        type="url"
        placeholder="Paste article url here"
        value={props.data.url}
        onChange={event =>
          props.setData({ ...props.data, url: event.target.value })
        }
      />

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <StyledButton
          onClick={props.getMetaData}
          disabled={props.data.url === ''}
        >
          Generate Preview
        </StyledButton>
      </div>

      {props.data.title && props.data.url && (
        <>
          <h3 style={{ marginTop: 30 }}>3. See the preview</h3>

          <FeedItem data={props.data} />
        </>
      )}
    </div>
  );
};

export default External;
