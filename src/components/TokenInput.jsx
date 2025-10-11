import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TokenInput.css';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const TokenInput = () => {
  const [token, setToken] = useState('');
  const [status, setStatus] = useState(null);
  const [saveMessage, setSaveMessage] = useState('');
  const [savedToken, setSavedToken] = useState('');
  const [savedAccessToken, setSavedAccessToken] = useState('');
  const [postText, setPostText] = useState('');
  const [postStatus, setPostStatus] = useState('');
  const [accessTokenMessage, setAccessTokenMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSavedToken();
  }, []);

  const fetchSavedToken = async () => {
    try {
      setIsLoading(true);

      // Fetch latest auth token
      const response = await axios.get(`${baseUrl}/save-token`);
      setSavedToken(response.data.token || '');

      // Fetch latest access token (sub)
      const allTokensRes = await axios.get(`${baseUrl}/save-token?all=true`);
      if (allTokensRes.data.tokens && allTokensRes.data.tokens.length > 0) {
        const latestRow = allTokensRes.data.tokens[0];
        setSavedAccessToken(latestRow.access_token || '');
      } else {
        setSavedAccessToken('');
      }
    } catch (error) {
      setSavedToken('');
      setSavedAccessToken('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    setStatus(null);
    setIsLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/verify-token`, { token });
      setStatus(response.data.valid ? 'valid' : 'invalid');
    } catch (error) {
      setStatus('invalid');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setSaveMessage('');
    setIsLoading(true);
    try {
      await axios.post(`${baseUrl}/save-token`, { token });
      setSaveMessage('Token saved!');
      fetchSavedToken();
    } catch (error) {
      setSaveMessage('Failed to save token.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccessToken = async () => {
    setAccessTokenMessage('');
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/access-token`);
      setAccessTokenMessage(
        `Access token (sub) saved: ${response.data.access_token}`
      );
      fetchSavedToken();
    } catch (error) {
      setAccessTokenMessage('Failed to fetch access token.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePost = async () => {
    setPostStatus('');
    setIsLoading(true);
    try {
      await axios.post(`${baseUrl}/post-to-linkedin`, { text: postText });
      setPostStatus('Posted successfully!');
    } catch (error) {
      setPostStatus('Failed to post.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-title">LinkedIn Token Manager</div>
        <div className="app-subtitle">
          Manage and post with your LinkedIn access tokens securely.
        </div>
      </header>
      <div className="main-content">
        <main className="left-column">
          {/* Token Management */}
          <section className="card">
            <div className="card-header">
              <div className="card-title">Token Management</div>
              <div className="card-description">
                Verify, save, and fetch LinkedIn access token below.
                <div className="token-warning">
                  Please save a <b>valid token</b> before clicking <b>Get Access Token</b>.
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="input-group">
                <label className="input-label">Auth Token</label>
                <input
                  type="text"
                  placeholder="Enter LinkedIn Token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="button-group">
                <button
                  className="btn btn-primary"
                  onClick={handleVerify}
                  disabled={isLoading || !token}
                >
                  Verify
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={handleSave}
                  disabled={isLoading || !token}
                >
                  Save
                </button>
                <button
                  className="btn btn-accent"
                  onClick={handleAccessToken}
                  disabled={isLoading}
                >
                  Get Access Token
                </button>
              </div>
              {status && (
                <div className={`status-message ${status === 'valid' ? 'success' : 'error'}`}>
                  Token is {status}
                </div>
              )}
              {saveMessage && <div className="status-message success">{saveMessage}</div>}
              {accessTokenMessage && (
                <div className="status-message success">{accessTokenMessage}</div>
              )}
            </div>
          </section>

          {/* Post Creation */}
          <section className="card">
            <div className="card-header">
              <div className="card-title">Post to LinkedIn</div>
              <div className="card-description">
                Write and publish a post directly to LinkedIn.
              </div>
              <div className="token-warning">
                Please save a <b>valid Auth and Access (sub) token</b> before clicking{' '}
                <b>Post to LinkedIn</b>.
              </div>
            </div>
            <div className="card-body">
              <div className="input-group">
                <label className="input-label">Post Text</label>
                <textarea
                  className="input-field textarea"
                  placeholder="Write a post to LinkedIn"
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  rows={3}
                />
                <div className="char-count">{postText.length} characters</div>
              </div>
              <button
                className="btn btn-accent"
                onClick={handlePost}
                disabled={isLoading || !postText}
              >
                Post to LinkedIn
              </button>
              {postStatus && (
                <div
                  className={`status-message ${
                    postStatus === 'Posted successfully!' ? 'success' : 'error'
                  }`}
                >
                  {postStatus}
                </div>
              )}
            </div>
          </section>
        </main>

        {/* RIGHT COLUMN - Separate cards */}
        <aside className="right-column">
          {/* Auth Token Card */}
          <section className="card">
            <div className="card-header">
              <div className="card-title">Last Saved Auth Token</div>
            </div>
            <div className="card-body">
              {savedToken ? (
                <code>{savedToken}</code>
              ) : (
                <span className="no-token">No token saved yet.</span>
              )}
            </div>
          </section>

          {/* Access Token Card */}
          <section className="card">
            <div className="card-header">
              <div className="card-title">Last Saved Access Token (sub)</div>
            </div>
            <div className="card-body">
              {savedAccessToken ? (
                <code>{savedAccessToken}</code>
              ) : (
                <span className="no-token">No access token saved yet.</span>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default TokenInput;