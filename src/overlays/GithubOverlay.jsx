import { useState } from 'react'
import '../App.css'
import ExitButton from '../ui/ExitButton'

const languageColors = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  HTML: '#e34c26',
  CSS: '#563d7c',
  React: '#61dafb',
  Python: '#3572A5',
  Java: '#b07219',
  PHP: '#4F5D95',
  Shell: '#89e051',
  Vue: '#41b883',
}

function GithubOverlay({ activeOverlay, setActiveOverlay }) {
  const [username, setUsername] = useState('')
  const [stats, setStats] = useState(null)
  const [state, setState] = useState('empty')

  if(activeOverlay !== 'github') return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!username.trim()) return

    setState('loading')

    try {
      const userRes = await fetch(`https://api.github.com/users/${username}`)
      if(!userRes.ok) { setState('error'); return }
      const user = await userRes.json()

      const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`)
      const repos = await reposRes.json()

      const languages = repos
        .filter(r => !r.fork)
        .map(r => r.language)
        .filter(l => l !== null)

      const counts = {}
      languages.forEach(lang => {
        counts[lang] = (counts[lang] || 0) + 1
      })

      const top3 = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([lang]) => lang)

      const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0)

      setStats({
        name: user.name || user.login,
        login: user.login,
        followers: user.followers,
        repos: user.public_repos,
        stars: totalStars,
        location: user.location || 'No Location',
        avatar: user.avatar_url,
        languages: top3
      })

      setState('card')

    } catch {
      setState('error')
    }
  }

  return (
    <>
      <div className="github-overlay">
        <ExitButton setActiveOverlay={setActiveOverlay}/>

        <a href="https://github.com/Neliuzx" target="_blank" className="github-link">
          <span className="github-redirect-title">Redirect to my Github profile</span>
          <svg className='redirect-icon' width="90" height="90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </a>

        <div className="github-searcher">
          <form onSubmit={handleSubmit} className="github-form">
            <input
              type="text"
              placeholder="Enter a GitHub username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="github-input"
            />
            <button type="submit" className="github-submit">Generate</button>
          </form>

          {state === 'loading' && <p className="github-status">Loading...</p>}
          {state === 'error' && <p className="github-status">User not found.</p>}

          {state === 'card' && stats && (
            <div className="github-card">
              <div className="github-card-header">
                <img src={stats.avatar} alt={stats.login} className="github-avatar"/>
                <div className="github-card-info">
                  <h2 className="github-name">{stats.name}</h2>
                  <span className="github-login">@{stats.login}</span>
                  <span className="github-location">{stats.location}</span>
                </div>
              </div>
              <div className="github-card-stats">
                <div className="github-stat">
                  <span className="github-stat-value">{stats.followers}</span>
                  <span className="github-stat-label">Followers</span>
                </div>
                <div className="github-stat">
                  <span className="github-stat-value">{stats.repos}</span>
                  <span className="github-stat-label">Repos</span>
                </div>
                <div className="github-stat">
                  <span className="github-stat-value">{stats.stars}</span>
                  <span className="github-stat-label">Stars</span>
                </div>
              </div>
              <div className="github-languages">
                {stats.languages.map(lang => (
                  <span key={lang} className="github-language">
                    <span className="github-language-dot" style={{ background: languageColors[lang] || '#ccc' }}></span>
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="github-card-footer">
            <span>This little project is on my GitHub</span>
            <a href="https://github.com/Neliuzx/Github-Stats-Card" target="_blank" className="github-card-footer-link">
                Github-Stats-Card
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
            </a>
            </div>
        </div>

      </div>
    </>
  )
}

export default GithubOverlay