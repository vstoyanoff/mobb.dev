import React from 'react';

//Components
import FeedItem from './feed-item';

//Global styled components
import { StyledInput, StyledButton } from '../css/styled';

//Types
import { Article } from '../types';
type Props = {
  data: Article;
  setData: Function;
  getMetaData: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const External: React.FC<Props> = props => (
  <div>
    <h3>2. Add the damn link</h3>

    <StyledInput
      type="url"
      placeholder="Paste article url here"
      value={props.data.url}
      onChange={(event: React.SyntheticEvent) =>
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

export default External;
