import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Confetti from 'react-confetti'
import { Flame, Github, Share2, Trophy, Clock, GitBranch, Code2, Zap, AlertCircle } from 'lucide-react'
import axios from 'axios'
import './App.css'

// API URL configuration - uses environment variable or falls back to relative path
const API_URL = import.meta.env.VITE_API_URL || '/api'

function App() {
  const [repoPath, setRepoPath] = useState('')
  const [loading, setLoading] = useState(false)
  const [roastData, setRoastData] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [error, setError] = useState('')

  const analyzeRepo = async () => {
    if (!repoPath.trim()) {
      setError('Please enter a repository path!')
      return
    }

    setLoading(true)
    setError('')
    setRoastData(null)

    try {
      const response = await axios.post(`${API_URL}/roast`, { repoPath })
      setRoastData(response.data)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze repository. Make sure the path is correct!')
    } finally {
      setLoading(false)
    }
  }

  const shareResults = () => {
    const text = `I just got roasted by GitRoast! 🔥\n\nMy Developer Grade: ${roastData?.grade}\n\nGet roasted at GitRoast!`

    if (navigator.share) {
      navigator.share({
        title: 'GitRoast - My Coding Report Card',
        text: text,
      })
    } else {
      navigator.clipboard.writeText(text)
      alert('Copied to clipboard! Share it on social media!')
    }
  }

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
            Discover your coding sins, share your developer report card, and go viral!
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
              <h2 className="text-2xl font-bold">Analyze Your Git Repo</h2>
            </div>

            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={repoPath}
                  onChange={(e) => setRepoPath(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && analyzeRepo()}
                  placeholder="/path/to/your/repo (or use current directory: .)"
                  className="w-full px-4 py-3 bg-dark-bg border border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple transition-colors"
                />
                <p className="text-sm text-gray-400 mt-2">
                  💡 Tip: Use "." to analyze the current directory
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
                    Analyzing Your Coding Sins...
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

                <motion.button
                  onClick={shareResults}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-lg font-bold flex items-center gap-2 mx-auto hover:shadow-lg transition-shadow"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Share2 className="w-5 h-5" />
                  Share Your Grade
                </motion.button>
              </motion.div>

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
          <p className="mb-2">Made with 🔥 by AI that loves roasting code</p>
          <p className="text-sm">Share your roast and make both of us go viral! 🚀</p>
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
