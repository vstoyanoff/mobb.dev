import React from 'react';
import styled from 'styled-components';

import { IconGatsby } from './images';

const StyledFooter = styled.footer`
  .shell {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  p {
    font-size: 14px;
    margin-bottom: 0;
    margin-right: 10px;
  }

  a {
    display: flex;
    align-items: center;
    margin-bottom: 0;
  }

  img {
    margin-bottom: 0;
  }
`;

const Footer = () => (
  <StyledFooter>
    <div className="shell">
      <p>Powered by</p>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.gatsbyjs.org/"
      >
        <IconGatsby />
      </a>
    </div>
  </StyledFooter>
);

export default Footer;
