import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';

const StyledHeader = styled.header`
  text-align: center;

  h1 {
    margin-bottom: 1rem;
    font-family: 'Inconsolata', monospace;

    a {
      text-decoration: none;
    }
  }
`;

const Header = () => {
  return (
    <StyledHeader>
      <div className="shell">
        <h1>
          <Link to="/">&#402;(m)(o)(b)(b).dev</Link>
        </h1>

        <h2>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.linkedin.com/in/veselin-stoyanov-20382b47/"
          >
            <FontAwesomeIcon icon={faLinkedin} size="sm" />
          </a>
          &nbsp;&nbsp;&nbsp;
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://twitter.com/mobbdev"
          >
            <FontAwesomeIcon icon={faTwitter} size="sm" />
          </a>
        </h2>
      </div>
    </StyledHeader>
  );
};

export default Header;
