/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import '../css/base.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';

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

const Layout = ({ children }) => {
  return (
    <Wrapper>
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
