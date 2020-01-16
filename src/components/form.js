import React from 'react';
import styled from 'styled-components';

import { StyledInput, StyledButton } from '../css/styled';

const StyledForm = styled.form`
  max-width: 370px;
  margin: 0 auto;
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
    props.setLoading(true);
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
