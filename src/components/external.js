import React from 'react';

import FeedItem from '../components/feed-item';

import { StyledInput, StyledButton } from '../css/styled';

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
