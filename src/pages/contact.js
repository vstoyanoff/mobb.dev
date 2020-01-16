import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import ReactHtmlParser from 'react-html-parser';
import Recaptcha from 'react-google-recaptcha';

import Layout from '../components/layout';
import SEO from '../components/seo';

import { StyledInput, StyledButton, StyledTextarea } from '../css/styled';

import useInterval from '../utils/useInterval';

const quickFacts = [
  `I am from <a href="https://en.wikipedia.org/wiki/Bulgaria">Bulgaria</a>. Currently living in <a target="_blank" rel="noopener noreferrer" href="https://goo.gl/maps/yJQ6seGS793ykcXL7">Varna</a>`,
  `My name is Veselin and it is pronounced like <a target="_blank" rel="noopener noreferrer" href="https://www.howtopronounce.com/veselin/">this</a>`,
  `I enjoy remote lifestyle! It gives me freedom and I feel more focused on my work.`,
  `I love JavaScript and everything related. Although I am working with React right now, I want to get in the Vue world as well. Also might try Svelte soon...`,
  `I have 3 years of professional experience. My focus is Frontend, but I am doing things quite well as Fullstack JS Developer. Node.js is my preferred choice for backend.`,
];

const StyledRow = styled.article`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;

  @media (max-width: 767px) {
    flex-direction: column;
  }
`;

const StyledContent = styled.div`
  width: 58%;
  margin-bottom: 0;

  @media (max-width: 767px) {
    width: 100%;
    margin-bottom: 20px;
  }
`;

const StyledAside = styled.aside`
  width: 38%;
  min-height: 220px;

  @media (max-width: 767px) {
    width: 100%;
    min-height: 0;
  }

  .dark-mode & {
    border-color: #f5f3ce;
  }

  h4 {
    line-height: 1.5;
    margin-bottom: 0;
  }
`;

const StyledSuccessMessage = styled.h3`
  margin-bottom: 20px;
  line-height: 1.8;
`;

const encode = data => {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');
};

const ContactPage = () => {
  const [fact, setFact] = useState({
    i: 0,
    text: quickFacts[0],
  });
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [success, setSuccess] = useState(false);

  const recaptchaRef = useRef(null);

  useInterval(() => {
    if (fact.i >= quickFacts.length - 1) {
      setFact({
        i: 0,
        text: quickFacts[0],
      });
    } else {
      setFact({
        i: fact.i + 1,
        text: quickFacts[fact.i + 1],
      });
    }
  }, 10000);

  const handleSubmit = e => {
    e.preventDefault();
    const form = e.target;
    const recaptchaValue = recaptchaRef.current.getValue();

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({
        'form-name': form.getAttribute('name'),
        'g-recaptcha-response': recaptchaValue,
        ...formState,
      }),
    })
      .then(() => {
        setFormState({
          name: '',
          email: '',
          message: '',
        });
        setSuccess(true);
      })
      .catch(error => alert(error));
  };

  const handleChange = e => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  return (
    <Layout>
      <SEO title="Contact me" />

      <section>
        <div className="shell">
          {success && (
            <StyledSuccessMessage>
              Yay! Thank you! <br /> I'll get back to you soon.
            </StyledSuccessMessage>
          )}

          <StyledRow>
            <StyledContent>
              <form
                name="contact"
                method="post"
                data-netlify="true"
                data-netlify-recaptcha="true"
                onSubmit={handleSubmit}
              >
                <input type="hidden" name="form-name" value="contact" />

                <StyledInput
                  value={formState.name}
                  name="name"
                  type="text"
                  placeholder="Your Names"
                  required
                  onChange={handleChange}
                />

                <StyledInput
                  value={formState.email}
                  name="email"
                  type="emal"
                  placeholder="Your Email"
                  required
                  onChange={handleChange}
                />

                <StyledTextarea
                  value={formState.message}
                  name="message"
                  placeholder="Your Message"
                  required
                  onChange={handleChange}
                />

                <Recaptcha
                  style={{ marginBottom: 20 }}
                  ref={recaptchaRef}
                  sitekey={process.env.GATSBY_APP_SITE_RECAPTCHA_KEY}
                />

                <StyledButton type="submit">Send</StyledButton>
              </form>
            </StyledContent>

            <StyledAside>
              <h3>Some quick facts about me: </h3>

              <h4>{ReactHtmlParser(fact.text)}</h4>
            </StyledAside>
          </StyledRow>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
