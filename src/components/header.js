import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';

const StyledHeader = styled.header`
  text-align: center;

  h1 {
    margin-bottom: 0.5rem;
  }

  .socials {
    font-weight: 500;
    font-size: 24px;
  }
`;

const Header = () => {
  return (
    <StyledHeader>
      <div className="shell">
        <h1>Just a dev blog</h1>

        <h2 className="socials">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.linkedin.com/in/veselin-stoyanov-20382b47/"
          >
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
          &nbsp;&nbsp;&nbsp;
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://twitter.com/mobbdev"
          >
            <FontAwesomeIcon icon={faTwitter} />
          </a>
        </h2>
      </div>
    </StyledHeader>
  );
};

export default Header;
