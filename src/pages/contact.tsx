import React, { useRef, useState } from 'react';
import styled from 'styled-components';
//@ts-ignore
import ReactHtmlParser from 'react-html-parser';
//@ts-ignore
import Recaptcha from 'react-google-recaptcha';

//Components
import Layout from '../components/layout';
import SEO from '../components/seo';

//Global styled components
import { StyledInput, StyledButton, StyledTextarea } from '../css/styled';

//Utils
import { useInterval } from '../utils';

//Types
import { FormState } from '../types';

//Local styled components
const StyledRow = styled.article`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;

  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

const StyledContent = styled.div`
  width: 58%;
  margin-bottom: 0;

  @media (max-width: 992px) {
    width: 100%;
    margin-bottom: 20px;

    h1 {
      font-size: 24px;
    }
  }
`;

const StyledAside = styled.aside`
  width: 38%;
  min-height: 220px;

  .dark-mode & {
    border-color: #f5f3ce;
  }

  h3 {
    position: relative;
    display: inline-block;
    margin-bottom: 10px;
    font-size: 28px;

    &:before {
      content: '';
      position: absolute;
      z-index: -1;
      bottom: 0;
      left: -10px;
      right: -10px;
      background: yellow;
      height: 40%;
      transform: skewX(-15deg);
    }

    .dark-mode &:before {
      background: blue;
    }
  }

  h4 {
    line-height: 1.5;
    margin-bottom: 0;
    font-size: 20px;
  }

  @media (max-width: 992px) {
    width: 100%;
    min-height: 0;

    h3 {
      font-size: 24px;
    }

    h4 {
      font-size: 18px;
    }
  }
`;

const StyledSuccessMessage = styled.h3`
  margin-bottom: 20px;
  line-height: 1.8;
`;

const StyledHeading = styled.h1`
  font-size: 28px;

  @media (max-width: 992px) {
    font-size: 20px;
  }
`;

const quickFacts = [
  `I am from <a href="https://en.wikipedia.org/wiki/Bulgaria">Bulgaria</a>. Currently living in <a target="_blank" rel="noopener noreferrer" href="https://goo.gl/maps/yJQ6seGS793ykcXL7">Varna</a>`,
  `My name is Veselin and it is pronounced like <a target="_blank" rel="noopener noreferrer" href="https://www.howtopronounce.com/veselin/">this</a>`,
  `I enjoy remote lifestyle! It gives me freedom and I feel more focused on my work.`,
  `I love JavaScript and everything related. Although I am working with React right now, I want to get in the Vue world as well. Also might try Svelte soon...`,
  `I have 3 years of professional experience. My focus is Frontend, but I am doing things quite well as Fullstack JS Developer. Node.js is my preferred choice for backend.`,
];

const encode = (data: any) => {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');
};

const ContactPage: React.FC = () => {
  /**
   * State
   */
  const [fact, setFact] = useState<{ i: number; text: string }>({
    i: 0,
    text: quickFacts[0],
  });
  const [formState, setFormState] = useState<FormState>({
    name: '',
    email: '',
    message: '',
  });
  const [success, setSuccess] = useState<boolean>(false);

  /**
   * Ref
   */
  const recaptchaRef = useRef(null);

  /**
   * Hooks
   */
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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

  const handleChange = (e: React.SyntheticEvent) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  return (
    <Layout>
      <SEO
        title="Contact me"
        description="If you have opportunities for me or you want to say Hi! just use this form and I will get back to you right away."
      />

      <section>
        <div className="shell">
          <StyledHeading>
            If you have opportunities for me or you want to say <em>Hi!</em>{' '}
            just use this form and will get back to you right away.
          </StyledHeading>

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
