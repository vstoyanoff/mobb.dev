import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const StyledOverlay = styled.div`
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background-color: rgba(255, 40, 0, 1);
  display: flex;
  align-items: center;
  justify-content: center;

  p {
    color: #fff;
    margin-left: 20px;
    font-size: 16px;
    margin-bottom: 0;
    font-weight: 500;
  }

  .close {
    appearance: none;
    border: none;
    background-color: transparent;
    outline: none !important;
    cursor: pointer;
    padding: 0;
    margin: 0;
  }
`;

const ErrorOverlay = ({ text, close }) => (
  <StyledOverlay>
    <button onClick={close} className="close">
      <FontAwesomeIcon icon={faTimesCircle} size="lg" color="#fff" />
    </button>

    <p>{text}</p>
  </StyledOverlay>
);

export default ErrorOverlay;
