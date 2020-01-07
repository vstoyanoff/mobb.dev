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
    margin: 20px 0 10px;
  }

  button {
    position: relative;
    margin: 10px 0;
    border: 1px solid transparent;
    border-color: #f9d71c;
    height: 40px;
    width: 16px;
    border-radius: 50px;
    outline: none;
    cursor: pointer;
    background: transparent;

    .dark-mode & {
      border-color: #f5f3ce;
    }

    @media (max-width: 767px) {
      width: 40px;
      height: 16px;
      margin: 0 10px;
    }
  }

  button:after {
    content: '';
    position: absolute;
    top: 2px;
    bottom: auto;
    left: 2px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #f9d71c;

    .dark-mode & {
      top: auto;
      bottom: 2px;
      background: #f5f3ce;
    }

    @media (max-width: 767px) {
      left: 2px;
      right: auto;

      .dark-mode & {
        left: auto;
        right: 2px;
      }
    }
  }

  .sun {
    color: #f9d71c;
    font-size: 24px;
  }

  .moon {
    color: #1f263b;
    font-size: 24px;

    .dark-mode & {
      color: #f5f3ce;
    }
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
      <Switch mode={mode}>
        <FontAwesomeIcon icon={faSun} className="sun" />

        <button onClick={toggleMode}></button>

        <FontAwesomeIcon icon={faCloudMoon} className="moon" />
      </Switch>

      <Header />

      <Main>{children}</Main>

      <Footer />
    </Wrapper>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
