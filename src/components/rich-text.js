/**
 * Rich Text Field Editor for React
 *
 * dependencies:
 * * https://www.npmjs.com/package/draft-js
 * * https://www.npmjs.com/package/draft-js-export-html
 * * https://www.npmjs.com/package/react-html-parser
 * * https://www.npmjs.com/package/js-base64
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  getDefaultKeyBinding,
} from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import ReactHtmlParser from 'react-html-parser';
import { Base64 } from 'js-base64';
import styled, { css } from 'styled-components';
import 'draft-js/dist/Draft.css';

const StyledRichText = styled.div`
  position: relative;
  border: 2px solid #333;

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

const StyledEditor = styled.div`
  min-height: 300px;
  padding: 0 10px;
`;

/**
 * Rich text field
 */
const RichTextField = props => {
  /**
   * State
   */
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const { data } = props;

  /**
   * Hooks
   */
  useEffect(() => {
    if (data.length) {
      const decodedContent = Base64.decode(data);
      const contentState = convertFromRaw(JSON.parse(decodedContent));
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, []);

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

  var INLINE_STYLES = [
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

  /**
   * Render
   */
  return (
    <StyledRichText>
      <StyledControls>
        <div>
          <BlockStyleControls
            editorState={editorState}
            onToggle={toggleBlockType}
          />

          <InlineStyleControls
            editorState={editorState}
            onToggle={toggleInlineStyle}
          />
        </div>
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
