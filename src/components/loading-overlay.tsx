import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

//Local styled components
const StyledOverlay = styled.div`
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background-color: rgba(249, 215, 28, 1);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingOverlay: React.FC = () => (
  <StyledOverlay>
    <FontAwesomeIcon icon={faSpinner} spin size="lg" color="#333" />
  </StyledOverlay>
);

export default LoadingOverlay;
