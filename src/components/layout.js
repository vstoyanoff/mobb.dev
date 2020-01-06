/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import '../css/base.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faCloudMoon } from '@fortawesome/free-solid-svg-icons';

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Header from './header';
import Footer from './footer';

config.autoAddCss = false;

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

const Layout = ({ children }) => {
  const [mode, setMode] = React.useState(
    typeof window !== `undefined`
      ? localStorage.getItem('mobbdev-mode')
      : 'light'
  );

  React.useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      setMode('dark');
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem('mobbdev-mode', mode);

    if (mode === 'light') {
      document.body.classList.remove('dark-mode');
    } else {
      document.body.classList.add('dark-mode');
    }
  }, [mode]);

  const toggleMode = () => {
    if (mode === 'light') {
      setMode('dark');
    } else {
      setMode('light');
    }
  };

  return (
    <Wrapper>
      <Header />

      <Switch mode={mode}>
        <FontAwesomeIcon icon={faSun} className="sun" />

        <button onClick={toggleMode}></button>

        <FontAwesomeIcon icon={faCloudMoon} className="moon" />
      </Switch>

      <Main>{children}</Main>

      <Footer />
    </Wrapper>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
