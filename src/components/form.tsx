import React from 'react';
import styled from 'styled-components';

//Global styled components
import { StyledInput, StyledButton } from '../css/styled';

//Local styled components
const StyledForm = styled.form`
  max-width: 370px;
  margin: 0 auto;
`;

type Props = {
  setLoading: Function;
  auth: Function;
};

const Form: React.FC<Props> = props => {
  /**
   * Refs
   */
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passRef = React.useRef<HTMLInputElement>(null);

  /**
   * Methods
   */
  const formSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    props.setLoading(true);
    props.auth({
      email: emailRef.current !== null ? emailRef.current.value : '',
      pass: passRef.current !== null ? passRef.current.value : '',
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
