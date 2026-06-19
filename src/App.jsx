import { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';

const GITHUB_API = 'https://api.github.com';

function timeAgo(dateStr) {
  const date = new Date(dateStr);
  const seconds = Math.floor((new Date() - date) / 1000);
  const intervals = [
    ['year', 31536000], ['month', 2592000], ['week', 604800],
    ['day', 86400], ['hour', 3600], ['minute', 60]
  ];
  for (const [label, secs] of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count} ${label}${count > 1 ? 's' : ''} ago`;
  }
  return 'just now';
}

function formatNumber(num) {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num;
}

export default function App() {
  const [query, setQuery] = useState('');
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [repoSort, setRepoSort] = useState('updated');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const searchUser = useCallback(async (username) => {
    if (!username.trim()) return;
    setLoading(true);
    setError(null);
    setUser(null);
    setRepos([]);

    try {
      const userRes = await fetch(`${GITHUB_API}/users/${username}`);
      if (userRes.status === 404) {
        throw new Error(`No GitHub user found for "${username}"`);
      }
      if (!userRes.ok) {
        throw new Error('Something went wrong. GitHub API may be rate-limited — try again shortly.');
      }
      const userData = await userRes.json();
      setUser(userData);

      const reposRes = await fetch(`${GITHUB_API}/users/${username}/repos?per_page=100&sort=updated`);
      const reposData = await reposRes.json();
      setRepos(Array.isArray(reposData) ? reposData : []);

      setRecentSearches(prev => {
        const filtered = prev.filter(u => u.toLowerCase() !== username.toLowerCase());
        return [username, ...filtered].slice(0, 5);
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    searchUser(query);
  };

  const sortedRepos = [...repos].sort((a, b) => {
    if (repoSort === 'stars') return b.stargazers_count - a.stargazers_count;
    if (repoSort === 'name') return a.name.localeCompare(b.name);
    return new Date(b.updated_at) - new Date(a.updated_at);
  });

  const languageStats = repos.reduce((acc, repo) => {
    if (repo.language) acc[repo.language] = (acc[repo.language] || 0) + 1;
    return acc;
  }, {});
  const topLanguages = Object.entries(languageStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const langColors = {
    JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
    Java: '#b07219', HTML: '#e34c26', CSS: '#563d7c', Go: '#00ADD8',
    Rust: '#dea584', C: '#555555', 'C++': '#f34b7d', Ruby: '#701516',
    PHP: '#4F5D95', Swift: '#F05138', Kotlin: '#A97BFF', Shell: '#89e051'
  };

  return (
    <div className="app">
      <div className="bg-glow"></div>

      <header className="header">
        <div className="logo">
          <svg height="28" viewBox="0 0 16 16" width="28" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
              0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
              -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07
              -1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0
              .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82
              .44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54
              1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          <span>Profile Finder</span>
        </div>
      </header>

      <main className="main">
        {!user && !loading && !error && (
          <div className="intro">
            <h1>Find any developer<br/>on <span className="accent">GitHub</span></h1>
            <p>Search profiles, explore repositories, and check out contribution stats — all in one place.</p>
          </div>
        )}

        <form className="search-form" onSubmit={handleSubmit}>
          <div className="search-box">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search GitHub username..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button type="submit" disabled={loading || !query.trim()}>
              {loading ? <span className="spinner"></span> : 'Search'}
            </button>
          </div>
        </form>

        {recentSearches.length > 0 && !user && !loading && (
          <div className="recent-searches">
            <span className="recent-label">Recent:</span>
            {recentSearches.map(name => (
              <button key={name} className="recent-chip" onClick={() => { setQuery(name); searchUser(name); }}>
                {name}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div className="error-box">
            <span className="error-icon">⚠</span>
            <p>{error}</p>
          </div>
        )}

        {user && (
          <div className="profile">
            <div className="profile-card">
              <img src={user.avatar_url} alt={user.login} className="avatar" />
              <div className="profile-info">
                <h2>{user.name || user.login}</h2>
                <a href={user.html_url} target="_blank" rel="noreferrer" className="username">
                  @{user.login}
                </a>
                {user.bio && <p className="bio">{user.bio}</p>}

                <div className="meta-row">
                  {user.company && <span className="meta-item">🏢 {user.company}</span>}
                  {user.location && <span className="meta-item">📍 {user.location}</span>}
                  {user.blog && (
                    <a href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                       target="_blank" rel="noreferrer" className="meta-item link">
                      🔗 {user.blog}
                    </a>
                  )}
                  <span className="meta-item">📅 Joined {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </div>

                <div className="stats-row">
                  <div className="stat">
                    <span className="stat-num">{formatNumber(user.public_repos)}</span>
                    <span className="stat-label">Repos</span>
                  </div>
                  <div className="stat">
                    <span className="stat-num">{formatNumber(user.followers)}</span>
                    <span className="stat-label">Followers</span>
                  </div>
                  <div className="stat">
                    <span className="stat-num">{formatNumber(user.following)}</span>
                    <span className="stat-label">Following</span>
                  </div>
                  <div className="stat">
                    <span className="stat-num">{formatNumber(repos.reduce((s, r) => s + r.stargazers_count, 0))}</span>
                    <span className="stat-label">Total Stars</span>
                  </div>
                </div>
              </div>
            </div>

            {topLanguages.length > 0 && (
              <div className="lang-section">
                <h3>Top Languages</h3>
                <div className="lang-bars">
                  {topLanguages.map(([lang, count]) => (
                    <div key={lang} className="lang-bar-row">
                      <span className="lang-name">
                        <span className="lang-dot" style={{ background: langColors[lang] || '#888' }}></span>
                        {lang}
                      </span>
                      <div className="lang-bar-track">
                        <div
                          className="lang-bar-fill"
                          style={{
                            width: `${(count / topLanguages[0][1]) * 100}%`,
                            background: langColors[lang] || '#888'
                          }}
                        ></div>
                      </div>
                      <span className="lang-count">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="repos-section">
              <div className="repos-header">
                <h3>Repositories ({repos.length})</h3>
                <select value={repoSort} onChange={e => setRepoSort(e.target.value)} className="sort-select">
                  <option value="updated">Recently Updated</option>
                  <option value="stars">Most Stars</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>

              {repos.length === 0 ? (
                <p className="empty-repos">No public repositories</p>
              ) : (
                <div className="repos-grid">
                  {sortedRepos.slice(0, 12).map(repo => (
                    <a
                      key={repo.id}
                      href={repo.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="repo-card"
                    >
                      <div className="repo-top">
                        <span className="repo-name">📁 {repo.name}</span>
                        {repo.fork && <span className="fork-badge">Fork</span>}
                      </div>
                      {repo.description && <p className="repo-desc">{repo.description}</p>}
                      <div className="repo-meta">
                        {repo.language && (
                          <span className="repo-lang">
                            <span className="lang-dot small" style={{ background: langColors[repo.language] || '#888' }}></span>
                            {repo.language}
                          </span>
                        )}
                        <span className="repo-stat">⭐ {repo.stargazers_count}</span>
                        <span className="repo-stat">🍴 {repo.forks_count}</span>
                        <span className="repo-updated">{timeAgo(repo.updated_at)}</span>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        Built with the <a href="https://docs.github.com/en/rest" target="_blank" rel="noreferrer">GitHub REST API</a>
      </footer>
    </div>
  );
}
