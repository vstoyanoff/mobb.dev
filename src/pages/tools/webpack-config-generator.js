import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import Recaptcha from 'react-google-recaptcha';
import nanoid from 'nanoid';
import download from 'downloadjs';

import Layout from '../../components/layout';
import LoadingOverlay from '../../components/loading-overlay';
import ErrorOverlay from '../../components/error-overlay';
import SEO from '../../components/seo';
import {
  StyledInput,
  StyledCheckbox,
  StyledRadiobutton,
  StyledButton,
} from '../../css/styled';

const url = 'https://mobb.dev/.netlify/functions/webpack-config-generator';

const StyledGenerator = styled.div`
  padding: 30px;
  border: 2px solid #333;

  fieldset {
    padding: 0;
    margin-bottom: 20px;
    border: none;
  }

  label {
    display: block;
    margin-bottom: 10px;
    font-weight: 600;
    font-size: 20px;
    span {
      font-size: 16px;
      font-weight: 500;
    }
  }

  .dark-mode & {
    border-color: #f3f5ce;
  }
`;

const StyledQuestion = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;

  h3 {
    margin-bottom: 0;
  }
`;

const StyledOptionsList = styled.div`
  & > div {
    margin-bottom: 15px;
  }

  label {
    font-size: 16px;
  }
`;

const WebpackConfigGenerator = () => {
  const [state, setState] = useState({
    id: '',
    jsEntry: 'main',
    processHTML: 'no',
    htmlPreference: 'no',
    processStyles: 'no',
    stylesPreference: 'css-in-js',
    stylesType: 'css',
    stylesEntry: 'style',
    processImages: 'no',
    resolveSize: 0,
    imageUrlResolve: false,
    imageOptimization: false,
    svgOptimization: false,
    optimizations: 'no',
    devServer: 'no',
    splitChunks: false,
    webp: false,
    criticalCss: false,
    purgeCss: false,
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const recaptchaRef = useRef(null);

  const handleInput = e => {
    if (e.target.type !== 'number') {
      if (!/\w/g.test(e.target.value[e.target.value.length - 1])) {
        return;
      }
    }

    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handleRadio = e => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckbox = e => {
    setState({
      ...state,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);

      //Get recaptcha response
      const recaptchaValue = recaptchaRef.current.getValue();

      //Send generate request
      const res = await fetch(`${url}/generate`, {
        method: 'POST',
        body: JSON.stringify({
          ...state,
          id: nanoid(),
          gResp: recaptchaValue,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const response = await res.json();

      if (response.error) {
        setError(response.error);
        setLoading(false);
        return false;
      }

      //Send request for generated files
      const resFile = await fetch(`${url}/download?id=${response.id}`, {
        method: 'GET',
      });
      const file = await resFile.blob();
      download(file, 'your_webpack_config.zip');
      setLoading(false);

      //Send remove request
      await fetch(`${url}/remove?id=${response.id}`, {
        method: 'GET',
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout>
      <SEO
        title="Webpack Config Generator"
        description="Generate your webpack powered boilerplate and start off your project. Easy."
      />

      <section>
        <div className="shell">
          <h3>
            This tool let's <em>you</em> generate dev boilerplate powered by
            Webpack. <br />I will constantly improve and extend this, so any
            feedback is greatly appreciated.
          </h3>

          <h4>
            The default configuration comes bundled only with JS processing,
            transpiling and optimization for best performance. There will be{' '}
            <code>static</code> folder and everything from there will be copied
            to the end dist folder as-is. But you really can do much more with
            webpack. <em>Customize</em> it below to fit your needs.
          </h4>
        </div>
      </section>

      <section>
        <div className="shell">
          <StyledGenerator>
            <form onSubmit={handleSubmit}>
              {error && (
                <ErrorOverlay text={error} close={() => setError(false)} />
              )}

              {loading && <LoadingOverlay />}

              <fieldset>
                <label htmlFor="entry-name">
                  Entry name{' '}
                  <span>
                    (the convention is to use index.js or main.js. The output js
                    bundle will be with the same name)
                  </span>
                </label>

                <StyledInput
                  value={state.jsEntry}
                  onChange={handleInput}
                  type="text"
                  name="jsEntry"
                  id="entry-name"
                  required
                />
              </fieldset>

              <fieldset>
                <StyledQuestion>
                  <h3>Do you need to process HTML?</h3>

                  <div>
                    <StyledRadiobutton>
                      <label htmlFor="html-yes">Yes</label>

                      <input
                        type="radio"
                        id="html-yes"
                        name="processHTML"
                        value="yes"
                        checked={state.processHTML === 'yes'}
                        onChange={handleRadio}
                      />
                    </StyledRadiobutton>

                    <StyledRadiobutton>
                      <label htmlFor="html-no">No</label>

                      <input
                        type="radio"
                        id="html-no"
                        name="processHTML"
                        value="no"
                        checked={state.processHTML === 'no'}
                        onChange={handleRadio}
                      />
                    </StyledRadiobutton>
                  </div>
                </StyledQuestion>

                {state.processHTML === 'yes' && (
                  <div>
                    <h4>
                      This option will process all .html files injecting .js and
                      .css bundles in each of them. You can extend further with
                      HTML template language - Pug, PostHTML, or Handlebars. You
                      can find more information in the README that will be
                      provided.
                    </h4>

                    <StyledOptionsList>
                      <StyledRadiobutton>
                        <label htmlFor="no-html-preprocessor">
                          No preprocessor
                        </label>

                        <input
                          type="radio"
                          id="no-html-preprocessor"
                          name="htmlPreference"
                          value="no"
                          checked={state.htmlPreference === 'no'}
                          onChange={handleRadio}
                        />
                      </StyledRadiobutton>

                      <br />

                      <StyledRadiobutton>
                        <label htmlFor="pug">
                          Use{' '}
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://pugjs.org/api/getting-started.html"
                          >
                            Pug
                          </a>
                        </label>

                        <input
                          type="radio"
                          id="pug"
                          name="htmlPreference"
                          value="pug"
                          checked={state.htmlPreference === 'pug'}
                          onChange={handleRadio}
                        />
                      </StyledRadiobutton>

                      <br />

                      <StyledRadiobutton>
                        <label htmlFor="posthtml">
                          Use{' '}
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://github.com/posthtml/posthtml"
                          >
                            PostHTML
                          </a>
                        </label>

                        <input
                          type="radio"
                          id="posthtml"
                          name="htmlPreference"
                          value="posthtml"
                          checked={state.htmlPreference === 'posthtml'}
                          onChange={handleRadio}
                        />
                      </StyledRadiobutton>

                      <br />

                      <StyledRadiobutton>
                        <label htmlFor="handlebars">
                          Use{' '}
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://handlebarsjs.com/"
                          >
                            Handlebars
                          </a>
                        </label>

                        <input
                          type="radio"
                          id="handlebars"
                          name="htmlPreference"
                          value="handlebars"
                          checked={state.htmlPreference === 'handlebars'}
                          onChange={handleRadio}
                        />
                      </StyledRadiobutton>
                    </StyledOptionsList>
                  </div>
                )}
              </fieldset>

              <fieldset>
                <StyledQuestion>
                  <h3>Do you need to process CSS?</h3>

                  <div>
                    <StyledRadiobutton>
                      <label htmlFor="styles-yes">Yes</label>

                      <input
                        type="radio"
                        id="styles-yes"
                        name="processStyles"
                        value="yes"
                        checked={state.processStyles === 'yes'}
                        onChange={handleRadio}
                      />
                    </StyledRadiobutton>

                    <StyledRadiobutton>
                      <label htmlFor="styles-no">No</label>

                      <input
                        type="radio"
                        id="styles-no"
                        name="processStyles"
                        value="no"
                        checked={state.processStyles === 'no'}
                        onChange={handleRadio}
                      />
                    </StyledRadiobutton>
                  </div>
                </StyledQuestion>

                {state.processStyles === 'yes' && (
                  <div>
                    <h4>
                      You can easily process styles either in vanilla CSS or
                      preprocessor like SASS. Also you can configure how to
                      import and use styles and tell webpack what you want to be
                      the end result. Make you prefered choice below.
                    </h4>

                    <p>Choose your preference</p>

                    <StyledOptionsList>
                      <StyledRadiobutton>
                        <label htmlFor="styles-in-js">
                          Import styles directly in JS files. The end JS bundle
                          will also contain the styles and inject them via JS.
                        </label>

                        <input
                          type="radio"
                          id="styles-in-js"
                          name="stylesPreference"
                          value="css-in-js"
                          checked={state.stylesPreference === 'css-in-js'}
                          onChange={handleRadio}
                        />
                      </StyledRadiobutton>

                      <StyledRadiobutton>
                        <label htmlFor="styles-extract">
                          Import styles directly in JS, but extract them in
                          separate file in the end bundle.
                        </label>

                        <input
                          type="radio"
                          id="styles-extract"
                          name="stylesPreference"
                          value="css-in-js-separate-file"
                          checked={
                            state.stylesPreference === 'css-in-js-separate-file'
                          }
                          onChange={handleRadio}
                        />
                      </StyledRadiobutton>

                      <StyledRadiobutton>
                        <label htmlFor="styles-files">
                          Load styles in separate .scss file. <br /> This will
                          make a new entry for webpack and the end styles will
                          be extracted in separate file. This is best from both
                          worlds since it gives you freedom to import styles in
                          JS and also make global styles.
                        </label>

                        <input
                          type="radio"
                          id="styles-files"
                          name="stylesPreference"
                          value="separate-files"
                          checked={state.stylesPreference === 'separate-files'}
                          onChange={handleRadio}
                        />
                      </StyledRadiobutton>
                    </StyledOptionsList>

                    {state.stylesPreference === 'separate-files' && (
                      <>
                        <label htmlFor="styles-entry-name">
                          Styles entry name{' '}
                          <span>
                            (the convention is to use "style". The output css
                            bundle will be with the same name)
                          </span>
                        </label>

                        <StyledInput
                          name="stylesEntry"
                          type="text"
                          id="styles-entry-name"
                          value={state.stylesEntry}
                          onChange={handleInput}
                        />
                      </>
                    )}

                    <br />

                    <p>How would you like to use CSS?</p>

                    <StyledOptionsList>
                      <StyledRadiobutton>
                        <label htmlFor="vanilla-css">
                          Use plain vanilla CSS. (<code>@import</code>{' '}
                          statements will be utilized)
                        </label>

                        <input
                          type="radio"
                          id="vanilla-css"
                          name="stylesType"
                          value="css"
                          checked={state.stylesType === 'css'}
                          onChange={handleRadio}
                        />
                      </StyledRadiobutton>

                      <br />

                      <StyledRadiobutton>
                        <label htmlFor="scss">Use SCSS preprocessor.</label>

                        <input
                          type="radio"
                          id="scss"
                          name="stylesType"
                          value="scss"
                          checked={state.stylesType === 'scss'}
                          onChange={handleRadio}
                        />
                      </StyledRadiobutton>
                    </StyledOptionsList>
                  </div>
                )}
              </fieldset>

              <fieldset>
                <StyledQuestion>
                  <h3>Do you need to process images?</h3>

                  <div>
                    <StyledRadiobutton>
                      <label htmlFor="images-yes">Yes</label>

                      <input
                        type="radio"
                        id="images-yes"
                        name="processImages"
                        value="yes"
                        checked={state.processImages === 'yes'}
                        onChange={handleRadio}
                      />
                    </StyledRadiobutton>

                    <StyledRadiobutton>
                      <label htmlFor="images-no">No</label>

                      <input
                        type="radio"
                        id="images-no"
                        name="processImages"
                        value="no"
                        checked={state.processImages === 'no'}
                        onChange={handleRadio}
                      />
                    </StyledRadiobutton>
                  </div>
                </StyledQuestion>

                {state.processImages === 'yes' && (
                  <div>
                    <h4>
                      Images processing is an essential part of every setup.
                      Here it is taken seriously, but also you have a certain
                      level of customization in order to fit your needs. You can
                      store your images directly in <code>static</code> folder
                      and they will be safely copied to the end dist and ready
                      to use, but if you want to import them in JS, optimize
                      them or resolve them in CSS <code>url()</code> here you
                      can specify these options.
                    </h4>

                    <StyledOptionsList>
                      {state.processStyles === 'yes' && (
                        <>
                          <StyledCheckbox>
                            <label htmlFor="url-resolve">
                              Resolve images from <code>url()</code> in CSS
                            </label>

                            <input
                              type="checkbox"
                              id="url-resolve"
                              name="imageUrlResolve"
                              checked={state.imageUrlResolve}
                              onChange={handleCheckbox}
                            />
                          </StyledCheckbox>

                          <br />

                          {state.imageUrlResolve && (
                            <>
                              <label htmlFor="resolve-size">
                                You can use DataURL instead of loading separate
                                file. Here you can specify under what size the
                                image should be embeded as DataURL in CSS (in
                                bytes)
                              </label>

                              <StyledInput
                                type="number"
                                id="resolve-size"
                                name="resolveSize"
                                value={state.resolveSize}
                                onChange={handleInput}
                              />
                            </>
                          )}
                        </>
                      )}

                      <StyledCheckbox>
                        <label htmlFor="image-optimization">
                          Optimize with Imagemin
                        </label>

                        <input
                          type="checkbox"
                          id="image-optimization"
                          name="imageOptimization"
                          checked={state.imageOptimization}
                          onChange={handleCheckbox}
                        />
                      </StyledCheckbox>

                      {state.imageOptimization && (
                        <p style={{ marginBottom: 0 }}>
                          You can adjust your settings in the end file.
                        </p>
                      )}

                      <br />

                      <StyledCheckbox>
                        <label htmlFor="svg-optimization">
                          Optimize SVGs with SVGO
                        </label>

                        <input
                          type="checkbox"
                          id="svg-optimization"
                          name="svgOptimization"
                          checked={state.svgOptimization}
                          onChange={handleCheckbox}
                        />
                      </StyledCheckbox>

                      {state.svgOptimization && (
                        <p style={{ marginBottom: 0 }}>
                          You can adjust your settings in the end file.
                        </p>
                      )}
                    </StyledOptionsList>
                  </div>
                )}
              </fieldset>

              <fieldset>
                <StyledQuestion>
                  <h3>Do you need more optimizations?</h3>

                  <div>
                    <StyledRadiobutton>
                      <label htmlFor="optimizations-yes">Yes</label>

                      <input
                        type="radio"
                        id="optimizations-yes"
                        name="optimizations"
                        value="yes"
                        checked={state.optimizations === 'yes'}
                        onChange={handleRadio}
                      />
                    </StyledRadiobutton>

                    <StyledRadiobutton>
                      <label htmlFor="optimizations-no">No</label>

                      <input
                        type="radio"
                        id="optimizations-no"
                        name="optimizations"
                        value="no"
                        checked={state.optimizations === 'no'}
                        onChange={handleRadio}
                      />
                    </StyledRadiobutton>
                  </div>
                </StyledQuestion>

                {state.optimizations === 'yes' && (
                  <div>
                    <h4>
                      You can set further optimizations in order to get the
                      maximum.
                    </h4>

                    <StyledOptionsList>
                      <StyledCheckbox>
                        <label htmlFor="split-chunks">
                          Split external libraries and scripts in to separate JS
                          files.
                        </label>

                        <input
                          type="checkbox"
                          id="split-chunks"
                          name="splitChunks"
                          checked={state.splitChunks}
                          onChange={handleCheckbox}
                        />
                      </StyledCheckbox>

                      <br />

                      {state.processImages === 'yes' && (
                        <>
                          <StyledCheckbox>
                            <label htmlFor="webp">
                              Generate WebP assets from images.
                            </label>

                            <input
                              type="checkbox"
                              id="webp"
                              name="webp"
                              checked={state.webp}
                              onChange={handleCheckbox}
                            />
                          </StyledCheckbox>

                          <br />
                        </>
                      )}

                      {state.processHTML === 'yes' && (
                        <>
                          <StyledCheckbox>
                            <label htmlFor="above-the-fold">
                              Inline critical CSS in order to minimize{' '}
                              <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href="https://vuejsdevelopers.com/2017/07/24/critical-css-webpack/"
                              >
                                render blocking
                              </a>
                            </label>

                            <input
                              type="checkbox"
                              id="above-the-fold"
                              name="criticalCss"
                              checked={state.criticalCss}
                              onChange={handleCheckbox}
                            />
                          </StyledCheckbox>

                          <br />
                        </>
                      )}

                      {state.processStyles === 'yes' && (
                        <StyledCheckbox>
                          <label htmlFor="purgeCss">
                            Remove unneccessary CSS. Useful when using CSS
                            libraries like Bootstrap.
                          </label>

                          <input
                            type="checkbox"
                            id="purgeCss"
                            name="purgeCss"
                            checked={state.purgeCss}
                            onChange={handleCheckbox}
                          />
                        </StyledCheckbox>
                      )}
                    </StyledOptionsList>
                  </div>
                )}
              </fieldset>

              <fieldset>
                <StyledQuestion>
                  <h3>Do you need dev server?</h3>

                  <div>
                    <StyledRadiobutton>
                      <label htmlFor="devserver-yes">Yes</label>

                      <input
                        type="radio"
                        id="devserver-yes"
                        name="devServer"
                        value="yes"
                        checked={state.devServer === 'yes'}
                        onChange={handleRadio}
                      />
                    </StyledRadiobutton>

                    <StyledRadiobutton>
                      <label htmlFor="devserver-no">No</label>

                      <input
                        type="radio"
                        id="devserver-no"
                        name="devServer"
                        value="no"
                        checked={state.devServer === 'no'}
                        onChange={handleRadio}
                      />
                    </StyledRadiobutton>
                  </div>
                </StyledQuestion>

                {state.devServer === 'yes' && (
                  <div>
                    <h4>You can change the configuration in the end file.</h4>
                  </div>
                )}
              </fieldset>

              <Recaptcha
                style={{ marginBottom: 20 }}
                ref={recaptchaRef}
                sitekey={process.env.GATSBY_APP_SITE_RECAPTCHA_KEY}
              />

              <StyledButton type="submit" disabled={loading}>
                Get your webpack configuration
              </StyledButton>
            </form>
          </StyledGenerator>
        </div>
      </section>
    </Layout>
  );
};

export default WebpackConfigGenerator;
