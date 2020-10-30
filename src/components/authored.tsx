import React from 'react';

//Components
import RichText from './rich-text';
import Dropzone from './dropzone';

//Global styled components
import { StyledInput, StyledTextarea } from '../css/styled';

//Types
import { Article } from '../types';
type Props = {
  data: Article;
  setData: Function;
};

const Authored: React.FC<Props> = props => {
  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w-]+/g, '') // Remove all non-word chars
      .replace(/--+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, '');

    props.setData({
      ...props.data,
      title: event.target.value,
      url,
    });
  };
  return (
    <div>
      <h3>2. Upload cover photo</h3>

      <Dropzone
        onUpload={(file: string) =>
          props.setData({ ...props.data, image: file })
        }
      />

      <h3>3. Now make some magic</h3>

      <StyledInput
        type="text"
        placeholder="Add title"
        value={props.data.title}
        onChange={handleTitle}
      />

      <StyledTextarea
        placeholder="Add description"
        value={props.data.description}
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
          props.setData({
            ...props.data,
            description: event.target.value,
          })
        }
      />

      <RichText
        edit={true}
        data={props.data.content}
        onChange={(content: React.SyntheticEvent) =>
          props.setData({ ...props.data, content })
        }
      />
    </div>
  );
};

export default Authored;
