/**
 * Rich Text Field Editor for React
 *
 * dependencies:
 * * https://www.npmjs.com/package/draft-js
 * * https://www.npmjs.com/package/draft-js-export-html
 * * https://www.npmjs.com/package/react-html-parser
 * * https://www.npmjs.com/package/js-base64
 */

import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  getDefaultKeyBinding,
  CompositeDecorator,
} from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import ReactHtmlParser from 'react-html-parser';
import { Base64 } from 'js-base64';
import styled, { css } from 'styled-components';
import 'draft-js/dist/Draft.css';

const StyledRichText = styled.div`
  position: relative;
  border: 2px solid #333;
  margin-bottom: 20px;

  .dark-mode & {
    border: 2px solid #f5f3ce;
  }
`;

const StyledControls = styled.div`
  padding: 10px;
  margin-bottom: 20px;
  border-bottom: 2px dotted #333;

  .dark-mode & {
    border-bottom: 2px dotted #f5f3ce;
  }
`;

const StyledButton = styled.button`
  margin: 5px;
  background: #333;
  color: #f5f3ce;
  border-color: #333;
  border-radius: 5px;
  transition: all 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
  transform: ${({ active }) => (active ? `scale(1.3)` : `scale(1)`)};
  font-weight: ${({ active }) => (active ? '700' : '500')};
  cursor: pointer;

  .dark-mode & {
    background: #f5f3ce;
    border-color: #f5f3ce;
    color: #333;
  }

  ${({ small }) =>
    small &&
    css`
      font-size: 12px;
    `}
`;

const StyledInput = styled.input`
  width: 100%;
  background-color: transparent;
  border: 2px solid #333;
  padding: 5px 10px;
  color: #333;
  outline: none;
  font-size: 14px;

  .dark-mode & {
    border-color: #f5f3ce;
    color: #f5f3ce;
  }
`;

const StyledUrl = styled.div`
  max-width: 300px;
  display: flex;
  align-items: center;
`;

const StyledEditor = styled.div`
  height: 60vh;
  overflow: scroll;
  padding: 0 10px;

  div[data-contents] > div {
    margin-bottom: 1.45rem;
  }
`;

const findLinkEntities = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === 'LINK'
    );
  }, callback);
};

const Link = props => {
  const { url } = props.contentState.getEntity(props.entityKey).getData();
  return <a href={url}>{props.children}</a>;
};

/**
 * Rich text field
 */
const RichTextField = props => {
  const decorator = new CompositeDecorator([
    {
      strategy: findLinkEntities,
      component: Link,
    },
  ]);

  /**
   * State
   */
  const [editorState, setEditorState] = useState(
    EditorState.createEmpty(decorator)
  );
  const [link, setLink] = useState({
    showInput: false,
    url: '',
  });
  const { data } = props;

  /**
   * Refs
   */
  const urlInputRef = useRef(null);

  /**
   * Hooks
   */
  useEffect(() => {
    if (data.length) {
      const decodedContent = Base64.decode(data);
      const contentState = convertFromRaw(JSON.parse(decodedContent));
      setEditorState(EditorState.createWithContent(contentState, decorator));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (link.showInput) {
      urlInputRef.current.focus();
    }
  }, [link]);

  /**
   * Methods
   */
  const onChange = editorState => {
    const raw = convertToRaw(editorState.getCurrentContent());
    const encodedData = Base64.encode(JSON.stringify(raw));
    setEditorState(editorState);

    props.onChange(encodedData);
  };

  const handleKeyCommand = command => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      onChange(newState);
      return true;
    }
    return false;
  };

  const mapKeyToEditorCommand = e => {
    if (e.keyCode === 9 /* Tab */) {
      const newEditorState = RichUtils.onTab(e, editorState, 4);
      if (newEditorState !== editorState) {
        onChange(newEditorState);
      }
      return;
    }
    return getDefaultKeyBinding(e);
  };

  const toggleBlockType = blockType => {
    onChange(RichUtils.toggleBlockType(editorState, blockType));
  };

  const toggleInlineStyle = inlineStyle => {
    onChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  const getBlockStyle = block => {
    switch (block.getType()) {
      case 'blockquote':
        return 'blockquote';
      default:
        return null;
    }
  };

  const promptForLink = e => {
    e.preventDefault();

    if (link.showInput) {
      setLink({
        showInput: false,
        url: '',
      });

      return;
    }

    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      const contentState = editorState.getCurrentContent();
      const startKey = editorState.getSelection().getStartKey();
      const startOffset = editorState.getSelection().getStartOffset();
      const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
      const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);

      let url = '';
      if (linkKey) {
        const linkInstance = contentState.getEntity(linkKey);
        url = linkInstance.getData().url;
      }

      setLink({
        showInput: true,
        url: url,
      });
    }
  };

  const confirmLink = e => {
    e.preventDefault();

    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'LINK',
      'MUTABLE',
      { url: link.url }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });

    setEditorState(
      RichUtils.toggleLink(
        newEditorState,
        newEditorState.getSelection(),
        entityKey
      )
    );
    setLink({
      showInput: false,
      url: '',
    });
  };

  const removeLink = () => {
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      setEditorState(RichUtils.toggleLink(editorState, selection, null));
    }
  };

  /**
   * Options
   */
  const BLOCK_TYPES = [
    { label: 'H1', style: 'header-one' },
    { label: 'H2', style: 'header-two' },
    { label: 'H3', style: 'header-three' },
    { label: 'H4', style: 'header-four' },
    { label: 'H5', style: 'header-five' },
    { label: 'H6', style: 'header-six' },
    { label: 'Blockquote', style: 'blockquote' },
    { label: 'UL', style: 'unordered-list-item' },
    { label: 'OL', style: 'ordered-list-item' },
    { label: 'Code Block', style: 'code-block' },
  ];

  const INLINE_STYLES = [
    { label: 'Bold', style: 'BOLD' },
    { label: 'Italic', style: 'ITALIC' },
    { label: 'Underline', style: 'UNDERLINE' },
    { label: 'Monospace', style: 'CODE' },
  ];

  /**
   *
   * Inliner components
   */
  const Button = props => {
    /**
     * Methods
     */
    const onToggle = e => {
      e.preventDefault();
      props.onToggle(props.style);
    };

    return (
      <StyledButton
        small={props.small}
        active={props.active}
        onMouseDown={onToggle}
      >
        {props.label}
      </StyledButton>
    );
  };

  const BlockStyleControls = props => {
    const { editorState } = props;
    const selection = editorState.getSelection();
    const blockType = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType();

    return (
      <div>
        {BLOCK_TYPES.map(type => (
          <Button
            key={type.label}
            active={type.style === blockType}
            label={type.label}
            onToggle={props.onToggle}
            style={type.style}
          />
        ))}
      </div>
    );
  };

  const InlineStyleControls = props => {
    const currentStyle = props.editorState.getCurrentInlineStyle();

    return (
      <div>
        {INLINE_STYLES.map(type => (
          <Button
            small
            key={type.label}
            active={currentStyle.has(type.style)}
            label={type.label}
            onToggle={props.onToggle}
            style={type.style}
          />
        ))}
      </div>
    );
  };

  const MediaControls = () => {
    return (
      <div style={{ marginTop: 20 }}>
        <StyledButton onMouseDown={promptForLink}>Link</StyledButton>

        <StyledButton>Media</StyledButton>
      </div>
    );
  };

  const LinkInput = () => {
    return (
      <StyledUrl>
        <StyledInput
          ref={urlInputRef}
          type="url"
          value={link.url}
          onChange={e => setLink({ showInput: true, url: e.target.value })}
        />

        <StyledButton small onMouseDown={confirmLink}>
          Add
        </StyledButton>

        <StyledButton small onMouseDown={removeLink} disabled={!link.url}>
          Remove
        </StyledButton>
      </StyledUrl>
    );
  };

  /**
   * Render
   */
  return (
    <StyledRichText>
      <StyledControls>
        <BlockStyleControls
          editorState={editorState}
          onToggle={toggleBlockType}
        />

        <InlineStyleControls
          editorState={editorState}
          onToggle={toggleInlineStyle}
        />

        <MediaControls editorState={editorState} />

        {link.showInput && <LinkInput />}
      </StyledControls>

      <StyledEditor>
        <Editor
          blockStyleFn={getBlockStyle}
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          keyBindingFn={mapKeyToEditorCommand}
          onChange={onChange}
          onBlur={props.onBlur}
          spellCheck={true}
          placeholder="Add your content here..."
        />
      </StyledEditor>
    </StyledRichText>
  );
};

/**
 * Rich text rendering component
 */
const RichTextRenderer = props => {
  const decodedData =
    props.data !== '' ? JSON.parse(Base64.decode(props.data)) : '';
  const data = props.data.length
    ? stateToHTML(convertFromRaw(decodedData))
    : '';

  return ReactHtmlParser(data);
};

/**
 * Props
 * @param {Boolean} edit
 * @param {Base64 String} data
 * @param {Function} onChange
 * @param {Function} onBlur
 */

const RichText = props =>
  props.edit ? (
    <RichTextField data={props.data} onChange={props.onChange} />
  ) : (
    <RichTextRenderer data={props.data} />
  );

RichText.defaultProps = {
  edit: false,
  data: '',
};

RichText.propTypes = {
  edit: PropTypes.bool,
  data: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
};

export default RichText;
