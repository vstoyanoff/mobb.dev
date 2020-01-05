import React from 'react';
import styled from 'styled-components';

const StyledForm = styled.form`
  max-width: 370px;
  margin: 0 auto;
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

const Form = props => {
  /**
   * Refs
   */
  const emailRef = React.useRef(null);
  const passRef = React.useRef(null);

  /**
   * Methods
   */
  const formSubmit = event => {
    event.preventDefault();
    props.auth({
      email: emailRef.current.value,
      pass: passRef.current.value,
    });
  };

  return (
    <StyledForm onSubmit={formSubmit}>
      <StyledInput ref={emailRef} type="email" placeholder="Email" />

      <StyledInput ref={passRef} type="password" placeholder="Password" />

      <StyledButton type="submit">Login</StyledButton>
    </StyledForm>
  );
};

export default Form;
