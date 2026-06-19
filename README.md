# 🔍 GitHub Profile Finder

A clean, fast GitHub profile search app — look up any developer, explore their repositories, see their top languages, and check key stats, all powered by the public GitHub REST API.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![GitHub API](https://img.shields.io/badge/GitHub-REST_API-181717?style=flat&logo=github&logoColor=white)

## 🚀 Live Demo

[View Live Demo](#) <!-- replace with your deployed link -->

## 📸 Preview

Search any GitHub username and instantly see their avatar, bio, follower stats, top languages (with a visual breakdown), and a sortable grid of their public repositories.

## ✨ Features

- **Live GitHub search** — fetches real profile data via the GitHub REST API
- **Repository grid** — shows up to 12 repos with stars, forks, language, and last-updated time
- **Sort repos** by recently updated, most starred, or name
- **Top languages breakdown** with animated bar chart
- **Recent searches** — quickly revisit profiles you searched before
- **Graceful error handling** — clear message for invalid usernames or rate limits
- **Fully responsive** — works on mobile and desktop
- **No API key required** — uses GitHub's public unauthenticated API

## 🛠️ Built With

- React 18 (hooks: `useState`, `useEffect`, `useCallback`, `useRef`)
- GitHub REST API (`/users/{username}` and `/users/{username}/repos`)
- Plain CSS (no UI framework)

## 📂 Project Structure

```
github-profile-finder/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx        # Main component — search, fetch, render
│   ├── App.css         # All styling
│   ├── index.js         # React entry point
│   └── index.css
├── package.json
└── README.md
```

## 🏃 Run Locally

```bash
git clone https://github.com/Jatinmor89/github-profile-finder.git
cd github-profile-finder
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deploy

This is a static React app — deploy free on **Netlify** or **Vercel**:

**Netlify:**
```bash
npm run build
# drag the /build folder onto netlify.com, or connect your GitHub repo
```

**Vercel:**
```bash
npm install -g vercel
vercel
```

## ⚠️ Rate Limits

GitHub's public API allows **60 unauthenticated requests per hour** per IP. If you hit the limit, wait an hour or add a personal access token to increase it to 5,000 requests/hour (see [GitHub API docs](https://docs.github.com/en/rest/overview/rate-limits-for-the-rest-api)).

## 📄 License

This project is open source and free to use for learning and portfolio purposes.

## 👤 Author

**Jatin**
- GitHub: [@Jatinmor89](https://github.com/Jatinmor89)
- LinkedIn: [Jatin Mor](https://www.linkedin.com/in/jatin-mor-6b10043b6/)
- Email: jatinmor342@gmail.com
