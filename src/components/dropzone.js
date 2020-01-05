/**
 * Dropzone implementation
 *
 * dependencies:
 * * https://www.npmjs.com/package/react-dropzone
 *
 */

import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';

/**
 * Props
 * @param {Function} onUpload
 * @param {String} acceptedFileTypes
 * @param {Boolean} multiple
 * @param {Boolean} noText
 */

const StyledDropzone = styled.div`
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  border: 1px dashed #333;
  margin-bottom: 20px;
  ${({ status, image }) =>
    (status === 'uploading' &&
      css`
        background: rgba(249, 215, 28, 0.3);
      `) ||
    (status === 'error' &&
      css`
        background: rgba(255, 0, 0, 0.3);
      `) ||
    (status === 'success' &&
      image &&
      css`
        background-image: url(${image});
        background-size: cover;
        background-position: center;
      `)};

  .dark-mode & {
    border-color: #f5f3ce;
  }

  p {
    text-align: center;
    padding: 20px;
    margin-bottom: 0;
    pointer-events: none;
  }
`;

const Dropzone = props => {
  /**
   * State
   */
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState('done');

  /**
   * Methods
   */
  const onDrop = useCallback(acceptedFiles => {
    setStatus('uploading');

    acceptedFiles.map(async file => {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', 'mobb.dev');

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dz903j993/image/upload`,
        {
          method: 'POST',
          body: data,
        }
      );
      const f = await res.json();
      setStatus('success');
      setImage(f.secure_url);
      props.onUpload(f.secure_url);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <StyledDropzone status={status} image={image} {...getRootProps()}>
      <input
        {...getInputProps()}
        accept={props.acceptedFileTypes}
        multiple={props.multiple}
        name="upload"
      />
      {!props.noText && status === 'done' && (
        <p>
          {props.multiple
            ? "Drag 'n' drop some files here, \n or click to select files"
            : "Drag 'n' drop a file here, \n or click to select file"}
        </p>
      )}
      {status === 'uploading' && <FontAwesomeIcon icon={faSpinner} spin />}
      {status === 'error' && <FontAwesomeIcon icon={faTimes} />}
      {status === 'success' && <FontAwesomeIcon icon={faCheck} />}
    </StyledDropzone>
  );
};

Dropzone.defaultProps = {
  noText: false,
  multiple: false,
};

Dropzone.propTypes = {
  onUpload: PropTypes.func,
  acceptedFileTypes: PropTypes.string,
  multiple: PropTypes.bool,
  noText: PropTypes.bool,
};

export default Dropzone;
