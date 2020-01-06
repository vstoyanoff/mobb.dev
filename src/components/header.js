import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faSun, faCloudMoon } from '@fortawesome/free-solid-svg-icons';

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

const Switch = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  z-index: 100;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);

  @media (max-width: 767px) {
    position: static;
    transform: translateY(0);
    flex-direction: row;
    justify-content: center;
    margin: 20px 0 0;
  }

  button {
    position: relative;
    margin: 10px 0;
    border: 1px solid transparent;
    border-color: ${({ mode }) => (mode === 'light' ? '#f9d71c' : '#f5f3ce')};
    height: 40px;
    width: 16px;
    border-radius: 50px;
    outline: none;
    cursor: pointer;
    background: transparent;

    @media (max-width: 767px) {
      width: 40px;
      height: 16px;
      margin: 0 10px;
    }
  }

  button:after {
    content: '';
    position: absolute;
    top: ${({ mode }) => (mode === 'light' ? '2px' : 'auto')};
    bottom: ${({ mode }) => (mode === 'light' ? 'auto' : '2px')};
    left: 2px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${({ mode }) => (mode === 'light' ? '#f9d71c' : '#f5f3ce')};

    @media (max-width: 767px) {
      left: ${({ mode }) => (mode === 'light' ? '2px' : 'auto')};
      right: ${({ mode }) => (mode === 'light' ? 'auto' : '2px')};
    }
  }

  .sun {
    color: #f9d71c;
    font-size: 24px;
  }

  .moon {
    color: ${({ mode }) => (mode === 'light' ? '#1f263b' : '#f5f3ce')};
    font-size: 24px;
  }
`;

const Header = () => {
  const [mode, setMode] = React.useState('light');

  React.useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      document.body.classList.add('dark-mode');
      setMode('dark');
    }
  }, []);
  const toggleMode = () => {
    if (mode === 'light') {
      document.body.classList.add('dark-mode');
      setMode('dark');
    } else {
      document.body.classList.remove('dark-mode');
      setMode('light');
    }
  };
  return (
    <>
      <Switch mode={mode}>
        <FontAwesomeIcon icon={faSun} className="sun" />

        <button onClick={toggleMode}></button>

        <FontAwesomeIcon icon={faCloudMoon} className="moon" />
      </Switch>

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
    </>
  );
};

export default Header;
