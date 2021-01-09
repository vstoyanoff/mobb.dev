import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { OutboundLink } from 'gatsby-plugin-google-analytics';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLinkedin,
  faTwitter,
  faGithub,
} from '@fortawesome/free-brands-svg-icons';
import { IconMobbDev } from './images';

//Local styled components
const StyledHeader = styled.header`
  text-align: center;

  .shell {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  h1 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: 'Inconsolata', monospace;
  }

  h2 {
    margin-bottom: 0;
  }

  .socials {
    position: fixed;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 30px;
    display: flex;
    flex-direction: column;
  }

  .nav {
    ul {
      list-style-type: none;
      padding-left: 0;
      margin-bottom: 0;
      margin-left: 0;
    }

    li {
      font-size: 20px;
      margin-bottom: 0;
    }

    a {
      text-decoration: none;
      font-weight: 600;
    }
  }

  .image {
    .dark-mode & {
      filter: invert(100%);
    }
  }

  @media (max-width: 768px) {
    margin-bottom: 20px;

    .image {
      order: 1;
    }

    h1 {
      display: none;
    }

    .shell {
      flex-wrap: wrap;
    }

    .socials {
      position: static;
      flex-direction: row;
      justify-content: center;
      transform: translateY(0);
      order: 2;
    }

    .nav {
      order: 3;
      width: 100%;
      margin-top: 20px;

      ul {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
`;

const Header: React.FC = () => (
  <StyledHeader>
    <div className="shell">
      <div className="image">
        <Link to="/">
          <IconMobbDev />
        </Link>
      </div>

      <h1>&#402;(m)(o)(b)(b).dev</h1>

      <nav className="nav">
        <ul>
          <li>
            <Link to="/resources">JS Resources</Link>
          </li>

          <li>
            <Link to="/tools">Tools</Link>
          </li>
        </ul>
      </nav>

      <div className="socials">
        <OutboundLink
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.linkedin.com/in/veselin-stoyanov-20382b47/"
        >
          <FontAwesomeIcon icon={faLinkedin} size="sm" />
        </OutboundLink>
        &nbsp;&nbsp;&nbsp;
        <OutboundLink
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/vstoyanoff"
        >
          <FontAwesomeIcon icon={faGithub} size="sm" />
        </OutboundLink>
      </div>
    </div>
  </StyledHeader>
);

export default Header;
