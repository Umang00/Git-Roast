# 🔥 Contributing to GitRoast

First off, thanks for taking the time to contribute! GitRoast is all about making developers laugh while learning, and your contributions can help make it even better.

## 🎯 Ways to Contribute

### 1. Add New Roasts 🔥
The roasting engine is in `api/roastEngine.js`. Add new patterns and roasts:

```javascript
if (stats.yourPattern) {
  roasts.push({
    emoji: '😎',
    title: 'Your Roast Title',
    content: 'Your hilarious roast message!',
    severity: 1-5
  });
}
```

**Good Roast Qualities:**
- Funny but not mean
- Based on actual git patterns
- Self-deprecating developer humor
- Educational (hidden wisdom in the jokes)

### 2. Improve GitHub Analysis 📊
Enhance `api/githubAnalyzer.js` to detect more patterns:
- Code review response time
- Branch naming conventions
- Pull request patterns
- Commit time patterns
- Documentation quality analysis

### 3. Enhance the UI 🎨
Make the frontend even more viral-worthy:
- Add more animations
- Create new chart visualizations
- Improve the sharing experience
- Add themes/color schemes
- Mobile responsiveness improvements

### 4. Add Features ✨
Ideas for new features:
- ✅ GitHub integration (analyze public repos by URL) - **DONE!**
- ✅ AI-powered roasts with Google Gemini - **DONE!**
- ✅ MCP Server integration - **DONE!**
- Team roasting (compare multiple developers)
- Historical tracking (roast your past self)
- Custom roast templates
- Export to image for social media
- Leaderboard of most roasted patterns

### 5. Fix Bugs 🐛
Found a bug? Great! Please:
1. Check if it's already reported
2. Create an issue with reproduction steps
3. Submit a PR with the fix

## 🚀 Getting Started

1. **Fork the repo**
   ```bash
   git clone https://github.com/yourusername/gitroast.git
   cd gitroast
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Create a branch**
   ```bash
   git checkout -b feature/your-awesome-feature
   ```

4. **Make your changes**
   - Write clean, commented code
   - Test your changes
   - Follow the existing code style

5. **Test thoroughly**
   ```bash
   npm run dev
   # Test in browser at localhost:3000
   ```

6. **Commit your changes**
   ```bash
   git commit -m "Add: Your awesome feature"
   ```

   **Commit Message Format:**
   - `Add: New feature or functionality`
   - `Fix: Bug fix`
   - `Update: Improvements to existing features`
   - `Refactor: Code restructuring`
   - `Docs: Documentation changes`

7. **Push and create a PR**
   ```bash
   git push origin feature/your-awesome-feature
   ```

## 📝 Code Style Guidelines

### JavaScript/React
- Use ES6+ features
- Functional components with hooks
- Meaningful variable names
- Comment complex logic
- Keep functions small and focused

### Git Commits
- Write descriptive commit messages
- One logical change per commit
- Reference issues when applicable

## 🎨 Roast Writing Guidelines

When adding new roasts:

### DO ✅
- Be funny and creative
- Base roasts on real patterns
- Keep it lighthearted
- Include emojis
- Make it shareable
- Add educational value

### DON'T ❌
- Be actually mean or hurtful
- Use profanity
- Target specific people
- Make assumptions about skill level
- Punch down

### Example of a Good Roast
```javascript
{
  emoji: '🦉',
  title: 'The Night Owl Developer',
  content: '67% of your commits happen between 11 PM and 5 AM. Ever heard of sleep? Your code probably hasn\'t either. Those bugs aren\'t features, they\'re hallucinations from sleep deprivation.',
  severity: 4
}
```

## 🧪 Testing

Before submitting:
- [ ] Test on multiple git repositories
- [ ] Check responsive design on mobile
- [ ] Verify all animations work smoothly
- [ ] Test error handling
- [ ] Ensure sharing features work

## 📋 Pull Request Process

1. **Update the README** if you've added features
2. **Test everything** - seriously, test it
3. **Update CHANGELOG** if applicable
4. **Describe your changes** clearly in the PR
5. **Link related issues**
6. **Wait for review** - we'll try to be quick!

## 🌟 Recognition

Contributors will be:
- Listed in the README
- Mentioned in release notes
- Forever immortalized in git history
- Part of something that (hopefully) goes viral!

## 💡 Ideas for Contributions

Not sure what to work on? Try these:

### Easy (Good First Issues)
- Add new roast messages
- Improve error messages
- Add more emojis
- Fix typos in documentation
- Add more achievements

### Medium
- Add new git analysis patterns
- Improve UI animations
- Add data visualizations
- Create more detailed stats

### Hard
- GitHub API integration
- Team/organization analysis
- Historical trend tracking
- Machine learning for roast generation
- Social media auto-sharing

## 🤔 Questions?

- Create an issue for discussion
- Tag it with `question`
- We're friendly, promise!

## 🎉 Thank You!

Every contribution makes GitRoast better and helps it go viral!

Your code might get roasted, but your contributions will be celebrated! 🔥

---

**Remember:** The goal is to make developers laugh, learn, and share. Keep it fun! 😄
