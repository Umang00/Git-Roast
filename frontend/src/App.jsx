import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Confetti from 'react-confetti'
import { Flame, Github, Trophy, Clock, GitBranch, Code2, Zap, AlertCircle, Twitter, Linkedin, Copy, Check } from 'lucide-react'
import axios from 'axios'
import './App.css'

// API URL configuration - uses environment variable or falls back to relative path
const API_URL = import.meta.env.VITE_API_URL || '/api'

function App() {
  const [repoUrl, setRepoUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [streaming, setStreaming] = useState(false)
  const [streamText, setStreamText] = useState('')
  const [roastData, setRoastData] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const analyzeRepo = async () => {
    if (!repoUrl.trim()) {
      setError('Please enter a GitHub repository URL or username!')
      return
    }

    setLoading(true)
    setStreaming(true)
    setError('')
    setRoastData(null)
    setStreamText('')

    try {
      // Try streaming endpoint first
      const response = await fetch(`${API_URL}/roast-stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repoUrl }),
      })

      if (!response.ok) {
        throw new Error('Streaming failed, falling back to regular endpoint')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))

              if (data.type === 'stats') {
                // Initial stats received
                console.log('Stats received:', data.data)
              } else if (data.type === 'chunk') {
                // Streaming text chunk
                setStreamText(prev => prev + data.text)
              } else if (data.type === 'complete' || data.type === 'fallback') {
                // Complete roast data
                setRoastData(data.data)
                setShowConfetti(true)
                setTimeout(() => setShowConfetti(false), 5000)
              } else if (data.type === 'error') {
                throw new Error(data.error)
              }
            } catch (parseError) {
              console.error('Error parsing SSE data:', parseError)
            }
          }
        }
      }
    } catch (streamError) {
      console.warn('Streaming failed, using regular endpoint:', streamError)

      // Fallback to regular non-streaming endpoint
      try {
        const response = await axios.post(`${API_URL}/roast`, { repoUrl })
        setRoastData(response.data)
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 5000)
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to analyze. Make sure the username/repo is correct!')
      }
    } finally {
      setLoading(false)
      setStreaming(false)
      setStreamText('')
    }
  }

  const shareToTwitter = () => {
    const isProfile = roastData?.analysisType === 'profile'
    const target = roastData?.repository ?
      (isProfile ? `@${roastData.repository.username}` : roastData.repository.fullName) : 'my code'
    const text = `I just got ROASTED by GitRoast! 🔥\n\n${target} - Grade: ${roastData?.grade}\n\nGet your code brutally roasted:`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`
    window.open(url, '_blank')
  }

  const copyToClipboard = () => {
    const isProfile = roastData?.analysisType === 'profile'
    const target = roastData?.repository ?
      (isProfile ? `@${roastData.repository.username}` : roastData.repository.fullName) : 'my code'
    const text = `I just got ROASTED by GitRoast! 🔥\n\n${target} - Developer Grade: ${roastData?.grade}\n\nGet your code brutally roasted at GitRoast!`

    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [copied])

  const getGradeColor = (grade) => {
    const colors = {
      'A+': 'text-green-400',
      'A': 'text-green-400',
      'B': 'text-blue-400',
      'C': 'text-yellow-400',
      'D': 'text-orange-400',
      'F': 'text-red-400',
    }
    return colors[grade] || 'text-gray-400'
  }

  const getGradeEmoji = (grade) => {
    const emojis = {
      'A+': '🏆',
      'A': '⭐',
      'B': '👍',
      'C': '🤔',
      'D': '😬',
      'F': '💀',
    }
    return emojis[grade] || '❓'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-purple-900/10 to-dark-bg relative overflow-hidden">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-neon-purple rounded-full filter blur-3xl opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-neon-pink rounded-full filter blur-3xl opacity-20"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            className="inline-block mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Flame className="w-20 h-20 mx-auto text-neon-pink" />
          </motion.div>

          <h1 className="text-7xl font-bold mb-4 gradient-text text-shadow-glow">
            GitRoast
          </h1>

          <p className="text-2xl text-gray-300 mb-2">
            Get Your Code Brutally Roasted by AI 🔥
          </p>
          <p className="text-lg text-gray-400">
            Powered by Google Gemini AI - Savage, Streaming, Shareable
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="bg-dark-card rounded-2xl p-8 card-glow border border-purple-500/30">
            <div className="flex items-center gap-2 mb-4">
              <Github className="w-6 h-6 text-neon-purple" />
              <h2 className="text-2xl font-bold">Analyze GitHub Repos or Profiles</h2>
            </div>

            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && analyzeRepo()}
                  placeholder="facebook/react, Umang00, or https://github.com/torvalds/linux"
                  className="w-full px-4 py-3 bg-dark-bg border border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple transition-colors"
                />
                <p className="text-sm text-gray-400 mt-2">
                  💡 Enter a username for profile-wide analysis or owner/repo for single repository
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-center gap-2 text-red-400"
                >
                  <AlertCircle className="w-5 h-5" />
                  <p>{error}</p>
                </motion.div>
              )}

              <motion.button
                onClick={analyzeRepo}
                disabled={loading}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                  loading
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue hover:shadow-2xl neon-glow'
                }`}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Zap className="w-5 h-5" />
                    </motion.div>
                    {streaming ? 'AI is Roasting Your Code...' : 'Analyzing Your Coding Sins...'}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Flame className="w-5 h-5" />
                    Roast My Code!
                  </span>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Streaming Text Display */}
        {streaming && streamText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mb-6"
          >
            <div className="bg-dark-card rounded-2xl p-6 card-glow border border-neon-purple/50">
              <div className="flex items-center gap-2 mb-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="w-5 h-5 text-neon-purple" />
                </motion.div>
                <h3 className="text-lg font-bold text-neon-purple">AI is cooking up your roast...</h3>
              </div>
              <div className="text-gray-300 font-mono text-sm whitespace-pre-wrap break-words">
                {streamText}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="text-neon-purple"
                >
                  ▌
                </motion.span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results Section */}
        <AnimatePresence>
          {roastData && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              {/* Grade Card */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="bg-dark-card rounded-2xl p-8 card-glow border border-purple-500/30 text-center"
              >
                <div className="mb-4">
                  <Trophy className="w-16 h-16 mx-auto text-yellow-400 mb-2" />
                  <h2 className="text-3xl font-bold mb-2">Your Developer Grade</h2>
                </div>

                <motion.div
                  className={`text-9xl font-bold mb-4 ${getGradeColor(roastData.grade)}`}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {roastData.grade} {getGradeEmoji(roastData.grade)}
                </motion.div>

                <p className="text-xl text-gray-300 mb-6">{roastData.gradeDescription}</p>

                {/* Social Share Buttons */}
                <div className="flex flex-wrap gap-3 justify-center">
                  <motion.button
                    onClick={shareToTwitter}
                    className="bg-gradient-to-r from-blue-400 to-blue-600 px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:shadow-lg transition-shadow"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Twitter className="w-5 h-5" />
                    Share on Twitter
                  </motion.button>

                  <motion.button
                    onClick={shareToLinkedIn}
                    className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:shadow-lg transition-shadow"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Linkedin className="w-5 h-5" />
                    Share on LinkedIn
                  </motion.button>

                  <motion.button
                    onClick={copyToClipboard}
                    className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:shadow-lg transition-all ${
                      copied
                        ? 'bg-gradient-to-r from-green-500 to-green-700'
                        : 'bg-gradient-to-r from-purple-500 to-pink-600'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        Copy to Clipboard
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>

              {/* Profile Info (if analyzing a profile) */}
              {roastData.analysisType === 'profile' && roastData.repository && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-dark-card rounded-2xl p-6 card-glow border border-blue-500/30"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <Github className="w-8 h-8 text-blue-400" />
                    <div>
                      <h3 className="text-2xl font-bold">Profile Analysis: @{roastData.repository.username}</h3>
                      <p className="text-gray-400">Analyzed {roastData.repository.analyzedRepos} of {roastData.repository.totalRepos} repositories</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="bg-dark-bg rounded-lg p-3">
                      <div className="text-2xl font-bold text-blue-400">{roastData.repository.publicRepos}</div>
                      <div className="text-sm text-gray-400">Public Repos</div>
                    </div>
                    <div className="bg-dark-bg rounded-lg p-3">
                      <div className="text-2xl font-bold text-green-400">{roastData.repository.followers}</div>
                      <div className="text-sm text-gray-400">Followers</div>
                    </div>
                    <div className="bg-dark-bg rounded-lg p-3">
                      <div className="text-2xl font-bold text-purple-400">{roastData.repository.following}</div>
                      <div className="text-sm text-gray-400">Following</div>
                    </div>
                    <div className="bg-dark-bg rounded-lg p-3">
                      <div className="text-2xl font-bold text-yellow-400">{roastData.stats.totalCommits}</div>
                      <div className="text-sm text-gray-400">Total Commits</div>
                    </div>
                  </div>
                  {roastData.repository.topRepos && roastData.repository.topRepos.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-bold text-gray-400 mb-2">Most Active Repositories:</h4>
                      <div className="flex flex-wrap gap-2">
                        {roastData.repository.topRepos.map((repo, idx) => (
                          <span key={idx} className="bg-dark-bg px-3 py-1 rounded-full text-sm">
                            {repo.name} <span className="text-gray-500">({repo.commits} commits)</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Stats Grid */}
              <div className="grid md:grid-cols-3 gap-4">
                <StatCard
                  icon={<GitBranch className="w-8 h-8" />}
                  label="Total Commits"
                  value={roastData.stats.totalCommits}
                  color="text-blue-400"
                />
                <StatCard
                  icon={<Clock className="w-8 h-8" />}
                  label="Late Night Commits"
                  value={roastData.stats.lateNightCommits}
                  color="text-purple-400"
                  subtitle={`${roastData.stats.lateNightPercentage}%`}
                />
                <StatCard
                  icon={<Code2 className="w-8 h-8" />}
                  label="Avg Commit Size"
                  value={roastData.stats.avgCommitSize}
                  color="text-pink-400"
                  subtitle="lines"
                />
              </div>

              {/* Roasts */}
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-center mb-6 gradient-text">
                  The Roasts 🔥
                </h3>

                {roastData.roasts.map((roast, index) => (
                  <RoastCard key={index} roast={roast} index={index} />
                ))}
              </div>

              {/* Achievements */}
              {roastData.achievements && roastData.achievements.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="bg-dark-card rounded-2xl p-8 card-glow border border-yellow-500/30"
                >
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                    Dubious Achievements
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {roastData.achievements.map((achievement, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="bg-dark-bg rounded-lg p-4 border border-yellow-500/30"
                      >
                        <div className="text-3xl mb-2">{achievement.emoji}</div>
                        <div className="font-bold text-yellow-400">{achievement.title}</div>
                        <div className="text-sm text-gray-400">{achievement.description}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Suggestions */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-dark-card rounded-2xl p-8 card-glow border border-green-500/30"
              >
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-green-400" />
                  Ways to Improve (Or Not)
                </h3>
                <ul className="space-y-3">
                  {roastData.suggestions.map((suggestion, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                      className="flex items-start gap-3 text-gray-300"
                    >
                      <span className="text-green-400 font-bold">•</span>
                      <span>{suggestion}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-16 text-gray-500"
        >
          <p className="mb-2">Powered by Google Gemini AI 🤖 • Made with 🔥 and no mercy</p>
          <p className="text-sm">Share your savage roast and go viral! 🚀</p>
        </motion.div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color, subtitle }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-dark-card rounded-xl p-6 card-glow border border-purple-500/30"
    >
      <div className={`${color} mb-2`}>{icon}</div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-gray-400">{label}</div>
      {subtitle && <div className="text-sm text-gray-500 mt-1">{subtitle}</div>}
    </motion.div>
  )
}

function RoastCard({ roast, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.1 }}
      className="bg-dark-card rounded-xl p-6 card-glow border border-red-500/30"
    >
      <div className="flex items-start gap-4">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
          className="text-4xl"
        >
          {roast.emoji}
        </motion.div>
        <div className="flex-1">
          <h4 className="text-xl font-bold text-red-400 mb-2">{roast.title}</h4>
          <p className="text-gray-300 leading-relaxed">{roast.content}</p>
          {roast.severity && (
            <div className="mt-3 flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Flame
                  key={i}
                  className={`w-4 h-4 ${
                    i < roast.severity ? 'text-orange-500' : 'text-gray-600'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default App
