import React from 'react';
import styled from 'styled-components';
import { useFirebase, FirebaseContext } from 'gatsby-plugin-firebase';

//Components
import Layout from '../components/layout';
import Form from '../components/form';
import LoadingOverlay from '../components/loading-overlay';
import Authored from '../components/authored';
import External from '../components/external';

//Types
import { Article, ArticleState } from '../types';

//Global Styled components
import { StyledButton, StyledSelect } from '../css/styled';

//Local styled components
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

const StyledList = styled.div`
  flex: 1 0 48%;
  max-width: 48%;
  max-height: 60vh;
  overflow: auto;
  box-shadow: 6px 6px 14px 0 rgba(20, 20, 20, 0.2),
    -8px -8px 18px 0 rgba(255, 255, 255, 0.55);
  border-radius: 30px;
  padding: 20px;

  .dark-mode & {
    box-shadow: 6px 6px 14px 0 rgba(20, 20, 20, 0.2),
      -8px -8px 18px 0 rgba(20, 20, 20, 0.55);
  }

  @media (max-width: 767px) {
    flex: 1 0 100%;
    max-width: 100%;
    margin-bottom: 30px;
  }

  button {
    appearance: none;
    text-align: left;
    border: none;
    padding: 0;
    margin: 0;
    background: transparent;
    text-decoration: underline;
    cursor: pointer;

    .dark-mode & {
      color: #fff;
    }
  }
`;

const Cms: React.FC = () => {
  /**
   * State
   */
  const [auth, setAuth] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [mode, setMode] = React.useState<string>('');
  const [allArticles, setAllArticles] = React.useState<Article[]>([]);
  const [featured, setFeatured] = React.useState<Article[]>([]);
  const [drafts, setDrafts] = React.useState<Article[]>([]);
  const [draftId, setDraftId] = React.useState<number | null>(null);
  const [data, setData] = React.useState<Article>({
    date: Date.now(),
    type: 'external',
    url: '',
    image: '',
    title: '',
    description: '',
    content: '',
    site: '',
    featured: false,
    state: ArticleState.DRAFT,
  });

  //Firebase context
  const firebase = React.useContext(FirebaseContext);

  /**
   * Hooks
   */
  useFirebase(firebase => {
    setLoading(true);
    firebase.auth().onAuthStateChanged(user => {
      setAuth(!!user);
      setLoading(false);

      if (!!user) {
        firebase
          .database()
          .ref('/articles')
          .on('value', (snapshot: firebase.database.DataSnapshot) => {
            const articles: Article[] = Object.values(snapshot.val());
            setAllArticles(articles);
            setFeatured(articles.filter(article => article.featured));
            setDrafts(
              articles.filter(article => article.state === ArticleState.DRAFT)
            );
          });
      }
    });
  }, []);

  /**
   * Methods
   */
  const handleAuth = ({
    email,
    pass,
  }: {
    email: string;
    pass: string;
  }): void => {
    if (typeof firebase !== 'undefined') {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, pass)
        .then(() => setAuth(true))
        .catch(e => {
          setAuth(false);
          console.log(e);
        });
    }
  };

  const handleSignOut = () => {
    setLoading(true);

    if (typeof firebase !== 'undefined') {
      firebase
        .auth()
        .signOut()
        .then(() => {
          setAuth(false);
          setLoading(false);
        })
        .catch(e => console.log(e));
    }
  };

  const handleDB = (state: ArticleState) => {
    setLoading(true);
    const dataToSave = { ...data, state };

    if (typeof firebase !== 'undefined') {
      firebase
        .database()
        .ref(`articles/${data.date}`)
        .set(dataToSave)
        .then(() => {
          if (state === ArticleState.PUBLISHED) {
            setDrafts(prevState =>
              prevState.filter(draft => draft.date !== draftId)
            );
            setDraftId(null);
          }

          setLoading(false);
          setType(data.type);
        });
    }
  };

  const setType = (type: string) =>
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
      state: ArticleState.DRAFT,
    });

  const loadDraft = () => {
    setLoading(true);

    if (typeof firebase !== 'undefined') {
      firebase
        .database()
        .ref(`/articles/${draftId}`)
        .once('value')
        .then(data => {
          setData(data.val());
          setLoading(false);
        });
    }
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
      const doc: HTMLDocument = parser.parseFromString(html, 'text/html');
      const metaImage: HTMLMetaElement | null = doc.querySelector(
        "meta[property='og:image']"
      );
      const description: HTMLMetaElement | null =
        doc.querySelector("meta[name='description']") ||
        doc.querySelector("meta[property='og:description']");
      const title = doc.querySelector('title');
      const site: HTMLMetaElement | null = doc.querySelector(
        "meta[property='og:site_name']"
      );
      setData({
        ...data,
        title: title ? title.text : '',
        description: description ? description.content : '',
        site: site ? site.content : '',
        content: '',
        image: metaImage ? metaImage.content : '',
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
      body: null,
    }).then(() => setLoading(false));
  };

  const handleFeatured = (article: Article, state: boolean) => {
    if (typeof firebase !== 'undefined') {
      const updated = { ...article, featured: state };
      firebase
        .database()
        .ref(`articles/${updated.date}`)
        .set(updated);
    }
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

              <StyledButton
                active={mode === 'featured'}
                onClick={() => setMode('featured')}
              >
                Featured
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
                      onClick={() => handleDB(ArticleState.PUBLISHED)}
                    >
                      Publish
                    </StyledButton>
                  </>
                )}

                {data.type === 'authored' && (
                  <>
                    <Authored setData={setData} data={data} />

                    <StyledActions>
                      <StyledButton
                        onClick={() => handleDB(ArticleState.DRAFT)}
                      >
                        Save Draft
                      </StyledButton>

                      <StyledButton
                        onClick={() => handleDB(ArticleState.PUBLISHED)}
                      >
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
                      setDraftId(
                        parseInt(event.target.selectedOptions[0].value, 10)
                      )
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
                      <StyledButton
                        onClick={() => handleDB(ArticleState.DRAFT)}
                      >
                        Save changes
                      </StyledButton>

                      <StyledButton
                        onClick={() => handleDB(ArticleState.PUBLISHED)}
                      >
                        Publish
                      </StyledButton>
                    </StyledActions>
                  </>
                )}
              </>
            )}

            {mode === 'featured' && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 40,
                  flexWrap: 'wrap',
                }}
              >
                <StyledList>
                  {allArticles.reverse().map(article => (
                    <p key={article.date}>
                      <button onClick={() => handleFeatured(article, true)}>
                        {article.title}
                      </button>
                    </p>
                  ))}
                </StyledList>

                <StyledList>
                  {featured.map(article => (
                    <p key={article.date}>
                      <button onClick={() => handleFeatured(article, false)}>
                        {article.title}
                      </button>
                    </p>
                  ))}
                </StyledList>
              </div>
            )}
          </div>
        </section>
      )}
    </Layout>
  );
};

export default Cms;
