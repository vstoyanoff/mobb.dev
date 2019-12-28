import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';

const StyledHeader = styled.header`
  text-align: center;

  h1 {
    margin-bottom: 0.5rem;
  }

  p {
    max-width: 700px;
    margin: 0 auto 20px;
    font-size: 16px;
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

        <p>
          Thanks for passing by! <br /> I really love JavaScript and Functional
          Programming so below you will find articles primary related to these
          things. Some of them are written by me while others are from various
          sources some of which are the big names in the game.
          <br />
          If you wanna know more about me take a look at my social media
          profiles below. <br />
          Cheers!
        </p>

        <h2 className="socials">
          <a href="https://www.linkedin.com/in/veselin-stoyanov-20382b47/">
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
          &nbsp;&nbsp;&nbsp;
          <a href="https://twitter.com/mobbdev">
            <FontAwesomeIcon icon={faTwitter} />
          </a>
        </h2>
      </div>
    </StyledHeader>
  );
};

export default Header;
