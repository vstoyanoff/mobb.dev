import React from 'react';
import styled, { css } from 'styled-components';
import { useFirebase, FirebaseContext } from 'gatsby-plugin-firebase';

import Layout from '../components/layout';
import Form from '../components/form';
import LoadingOverlay from '../components/loading-overlay';
import Authored from '../components/authored';
import External from '../components/external';

const StyledFields = styled.fieldset`
  border: none;
  padding: 0 0 10px;

  label {
    margin: 0 5px;
    cursor: pointer;
  }

  input {
    display: inline-block;
    vertical-align: middle;
    margin-right: 5px;
  }

  span {
    display: inline-block;
    vertical-align: middle;
  }
`;

const StyledButton = styled.button`
  background: transparent;
  border: 2px solid #333;
  color: #333;
  padding: 8px 20px;
  text-transform: uppercase;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  font-size: 14px;
  margin-right: 10px;
  margin-bottom: 20px;

  @media (max-width: 576px) {
    display: block;
    width: 100%;
  }

  ${({ active }) =>
    active &&
    css`
      color: #f5f3ce !important;
      background-color: #333 !important;

      .dark-mode & {
        color: #333 !important;
        background-color: #f5f3ce !important;
      }
    `}

  &:disabled {
    opacity: 0.4;
    pointer-events: none;
  }

  &:hover:disabled {
    cursor: not-allowed;
  }

  &:hover {
    background: #333;
    color: #f5f3ce;
  }

  .dark-mode & {
    color: #f5f3ce;
    border-color: #f5f3ce;

    &:hover {
      background: #f5f3ce;
      color: #333;
    }
  }
`;

const StyledSelect = styled.select`
  width: 100%;
  background-color: transparent;
  border: 2px solid #333;
  padding: 10px;
  margin-right: 20px;
  color: #333;
  outline: none;

  .dark-mode & {
    border-color: #f5f3ce;
    color: #f5f3ce;
  }
`;

const StyledActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  button {
    min-width: 100px;
  }

  button + button {
    margin-left: 10px;
  }

  @media (max-width: 576px) {
    display: block;

    button + button {
      margin-left: 0;
    }
  }
`;

const Cms = () => {
  /**
   * State
   */
  const [auth, setAuth] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [mode, setMode] = React.useState('');
  const [drafts, setDrafts] = React.useState([]);
  const [draftId, setDraftId] = React.useState(null);
  const [data, setData] = React.useState({
    date: Date.now(),
    type: 'external',
    url: '',
    image: '',
    title: '',
    description: '',
    content: '',
    site: '',
    featured: false,
  });
  const firebase = React.useContext(FirebaseContext);

  /**
   * Hooks
   */
  useFirebase(firebase => {
    setLoading(true);
    firebase.auth().onAuthStateChanged(user => {
      setAuth(!!user);
      setLoading(false);
    });
    if (auth) {
      firebase
        .database()
        .ref('/articles')
        .once('value')
        .then(data => {
          const articles = Object.values(data.val());
          const filtered = articles.filter(
            article => article.state === 'draft'
          );
          setDrafts(filtered);
        });
    }
  }, []);

  /**
   * Methods
   */
  const handleAuth = ({ email, pass }) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, pass)
      .then(() => setAuth(true))
      .catch(e => {
        setAuth(false);
        console.log(e);
      });
  };

  const handleSignOut = () => {
    setLoading(true);
    firebase
      .auth()
      .signOut()
      .then(() => {
        setAuth(false);
        setLoading(false);
      })
      .catch(e => console.log(e));
  };

  const handleDB = state => {
    setLoading(true);
    const dataToSave = { ...data, state };
    firebase
      .database()
      .ref(`articles/${data.date}`)
      .set(dataToSave)
      .then(() => {
        if (state === 'published') {
          setDrafts(prevState =>
            prevState.filter(draft => draft.id !== draftId)
          );
          setDraftId(null);
        }

        setLoading(false);
        setType(data.type);
      });
  };

  const setType = type =>
    setData({
      date: Date.now(),
      type,
      url: '',
      image: '',
      title: '',
      description: '',
      content: '',
      site: '',
      featured: false,
    });

  const loadDraft = () => {
    setLoading(true);
    firebase
      .database()
      .ref(`/articles/${draftId}`)
      .once('value')
      .then(data => {
        setData(data.val());
        setLoading(false);
      });
  };

  const getMetaData = async () => {
    try {
      setLoading(true);
      const { url } = data;

      const fetchedData = await fetch(
        `https://cors-anywhere.herokuapp.com/${url}`
      );
      const html = await fetchedData.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const metaImage = doc.querySelector("meta[property='og:image']");
      const description =
        doc.querySelector("meta[name='description']") ||
        doc.querySelector("meta[property='og:description']");
      const title = doc.querySelector('title');
      const site = doc.querySelector("meta[property='og:site_name']");
      setData({
        ...data,
        title: title ? title.text : '',
        description: description ? description.content : '',
        site: site && site.content,
        content: '',
        image: metaImage && metaImage.content,
      });

      setLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeploy = () => {
    setLoading(true);
    fetch('https://api.netlify.com/build_hooks/5e1325748f25809185cb13d5', {
      method: 'POST',
      body: {},
    }).then(res => setLoading(false));
  };

  return (
    <Layout>
      {loading && <LoadingOverlay />}

      {!auth ? (
        <section>
          <div className="shell">
            <Form auth={handleAuth} setLoading={setLoading} />
          </div>
        </section>
      ) : (
        <section>
          <div className="shell">
            <StyledActions>
              <StyledButton
                active={mode === 'add'}
                onClick={() => setMode('add')}
              >
                Add New
              </StyledButton>

              <StyledButton
                active={mode === 'edit'}
                onClick={() => setMode('edit')}
              >
                Edit existing
              </StyledButton>

              <StyledButton onClick={handleDeploy}>Deploy changes</StyledButton>

              <StyledButton onClick={handleSignOut}>Sign out</StyledButton>
            </StyledActions>

            {mode === 'add' && (
              <>
                <h2>A tiny form for adding new article</h2>

                <h3>1. Choose the type</h3>

                <StyledFields>
                  <label htmlFor="external">
                    <input
                      type="radio"
                      name="type"
                      id="external"
                      value="external"
                      checked={data.type === 'external'}
                      onClick={() => setType('external')}
                    />{' '}
                    <span>External</span>
                  </label>

                  <label htmlFor="authored">
                    <input
                      type="radio"
                      name="type"
                      id="authored"
                      value="authored"
                      checked={data.type === 'authored'}
                      onClick={() => setType('authored')}
                    />{' '}
                    <span>Authored</span>
                  </label>
                </StyledFields>

                {data.type === 'external' && (
                  <>
                    <External
                      setData={setData}
                      data={data}
                      getMetaData={getMetaData}
                    />

                    <StyledButton
                      disabled={data.url === ''}
                      onClick={() => handleDB('published')}
                    >
                      Publish
                    </StyledButton>
                  </>
                )}

                {data.type === 'authored' && (
                  <>
                    <Authored setData={setData} data={data} />

                    <StyledActions>
                      <StyledButton onClick={() => handleDB('draft')}>
                        Save Draft
                      </StyledButton>

                      <StyledButton onClick={() => handleDB('published')}>
                        Publish
                      </StyledButton>
                    </StyledActions>
                  </>
                )}
              </>
            )}

            {mode === 'edit' && (
              <>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: 20,
                  }}
                >
                  <StyledSelect
                    value={draftId}
                    onChange={event =>
                      setDraftId(event.target.selectedOptions[0].value)
                    }
                  >
                    <option defaultChecked disabled selected>
                      Select
                    </option>
                    {drafts.map(item => (
                      <option value={item.date}>{item.title}</option>
                    ))}
                  </StyledSelect>

                  <StyledButton
                    onClick={loadDraft}
                    style={{ marginBottom: 0, marginRight: 0 }}
                  >
                    Load
                  </StyledButton>
                </div>

                {data.title && (
                  <>
                    <Authored data={data} setData={setData} />
                    <StyledActions>
                      <StyledButton onClick={() => handleDB('draft')}>
                        Save changes
                      </StyledButton>

                      <StyledButton onClick={() => handleDB('published')}>
                        Publish
                      </StyledButton>
                    </StyledActions>
                  </>
                )}
              </>
            )}
          </div>
        </section>
      )}
    </Layout>
  );
};

export default Cms;
