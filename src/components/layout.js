/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faCloudMoon } from '@fortawesome/free-solid-svg-icons';

import Header from './header';
import '../css/layout.css';

const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
`;

const Main = styled.main`
  flex-grow: 1;
`;

const Switch = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);

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

const Layout = ({ children, noHeader }) => {
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
    <Wrapper>
      <Switch mode={mode}>
        <FontAwesomeIcon icon={faSun} className="sun" />

        <button onClick={toggleMode}></button>

        <FontAwesomeIcon icon={faCloudMoon} className="moon" />
      </Switch>

      {!noHeader && <Header />}

      <Main>{children}</Main>
    </Wrapper>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
