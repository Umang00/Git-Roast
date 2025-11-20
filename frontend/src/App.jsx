import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Confetti from 'react-confetti'
import { Flame, Github, Trophy, Clock, GitBranch, Code2, Zap, AlertCircle, Twitter, Linkedin, Copy, Check, Mail, Globe, Download } from 'lucide-react'
import axios from 'axios'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
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
  const [linkedInCopied, setLinkedInCopied] = useState(false)
  const [downloadingPDF, setDownloadingPDF] = useState(false)

  // Refs to track timeouts for cleanup
  const linkedInTimeoutRef = useRef(null)
  const confettiTimeoutRef = useRef(null)
  const resultsRef = useRef(null)

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

      if (!response.body) {
        throw new Error('Streaming not supported in this environment')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = '' // Buffer for partial SSE lines

      const processLine = (line) => {
        if (!line.startsWith('data: ')) return

        try {
          const data = JSON.parse(line.slice(6))

          if (data.type === 'stats') {
            // Initial stats received (don't log to avoid leaking PII)
          } else if (data.type === 'chunk') {
            // Streaming text chunk
            setStreamText(prev => prev + data.text)
          } else if (data.type === 'complete' || data.type === 'fallback') {
            // Complete roast data
            setRoastData(data.data)
            setShowConfetti(true)

            // Clear any existing confetti timeout
            if (confettiTimeoutRef.current) {
              clearTimeout(confettiTimeoutRef.current)
            }
            confettiTimeoutRef.current = setTimeout(() => {
              setShowConfetti(false)
              confettiTimeoutRef.current = null
            }, 5000)
          } else if (data.type === 'error') {
            throw new Error(data.error)
          }
        } catch (parseError) {
          console.error('Error parsing SSE data:', parseError)
        }
      }

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          // Process any remaining buffered data
          if (buffer.trim()) {
            buffer.split('\n').forEach(processLine)
          }
          break
        }

        // Decode chunk and add to buffer (stream: true preserves partial UTF-8)
        buffer += decoder.decode(value, { stream: true })

        // Split on newlines and process complete lines
        const lines = buffer.split('\n')
        buffer = lines.pop() || '' // Keep incomplete line in buffer

        lines.forEach(processLine)
      }
    } catch (streamError) {
      console.warn('Streaming failed, using regular endpoint:', streamError)

      // Fallback to regular non-streaming endpoint
      try {
        const response = await axios.post(`${API_URL}/roast`, { repoUrl })
        setRoastData(response.data)
        setShowConfetti(true)

        // Clear any existing confetti timeout
        if (confettiTimeoutRef.current) {
          clearTimeout(confettiTimeoutRef.current)
        }
        confettiTimeoutRef.current = setTimeout(() => {
          setShowConfetti(false)
          confettiTimeoutRef.current = null
        }, 5000)
      } catch (err) {
        // Ensure error is always a string, not an object
        const errorMessage = err.response?.data?.error
          || err.message
          || 'Failed to analyze. Make sure the username/repo is correct!'
        setError(String(errorMessage))
      }
    } finally {
      setLoading(false)
      setStreaming(false)
      setStreamText('')
    }
  }

  // Generate viral social message using the most savage roast
  const generateViralMessage = () => {
    if (!roastData) return ''

    const isProfile = roastData.analysisType === 'profile'
    const target = roastData.repository
      ? (isProfile ? `@${roastData.repository.username}` : roastData.repository.fullName)
      : 'my code'

    // Get website URL from env or use current location
    const websiteUrl = import.meta.env.VITE_WEBSITE_URL || window.location.origin

    // Find the most savage roast (highest severity)
    const roasts = Array.isArray(roastData.roasts) ? roastData.roasts : []
    const savageRoast = roasts
      .filter(r => r.severity >= 4)
      .sort((a, b) => b.severity - a.severity)[0]

    if (savageRoast) {
      // Use savage roast as hook
      const roastSnippet = savageRoast.content.substring(0, 120)
      return `🔥 Holy shit, I just got DESTROYED by AI!

${target} - Grade: ${roastData.grade}
Roast: "${roastSnippet}..."

I can't believe this is real 💀

Get roasted: ${websiteUrl}
#GitRoast`
    }

    // Fallback if no savage roasts
    return `🔥 An AI just brutally roasted ${target}!

Grade: ${roastData.grade}

This is savage AF 💀

Try it: ${websiteUrl}
#GitRoast`
  }

  const shareToTwitter = () => {
    const text = generateViralMessage()
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  const shareToLinkedIn = async () => {
    // LinkedIn doesn't support pre-filled text, so copy to clipboard + show toast
    const text = generateViralMessage()

    // Clear any existing timeout
    if (linkedInTimeoutRef.current) {
      clearTimeout(linkedInTimeoutRef.current)
    }

    try {
      await navigator.clipboard.writeText(text)
      setLinkedInCopied(true)

      // Open LinkedIn post page after short delay
      linkedInTimeoutRef.current = setTimeout(() => {
        window.open('https://www.linkedin.com/feed/', '_blank')
        linkedInTimeoutRef.current = null
      }, 500)
    } catch (err) {
      console.error('Copy failed:', err)
      // Fallback: just open LinkedIn immediately
      window.open('https://www.linkedin.com/feed/', '_blank')
    }
  }

  const copyToClipboard = async () => {
    const text = generateViralMessage()

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch (err) {
      console.error('Copy failed:', err)

      // Fallback for non-HTTPS or denied permissions
      try {
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        setCopied(true)
      } catch (fallbackErr) {
        console.error('Fallback copy also failed:', fallbackErr)
        setError('Failed to copy to clipboard')
      }
    }
  }

  const downloadAsPDF = async () => {
    if (!resultsRef.current || downloadingPDF) return

    try {
      setDownloadingPDF(true)

      // Scroll to top to ensure full content is visible
      window.scrollTo(0, 0)

      // Wait for scroll to complete
      await new Promise(resolve => setTimeout(resolve, 300))

      // Capture the results div as canvas with high quality
      const canvas = await html2canvas(resultsRef.current, {
        scale: 2, // Higher quality (2x resolution)
        useCORS: true, // Allow cross-origin images
        logging: false,
        backgroundColor: '#0a0a0f', // Match dark background
        windowWidth: resultsRef.current.scrollWidth,
        windowHeight: resultsRef.current.scrollHeight,
      })

      // Calculate PDF dimensions
      const imgWidth = 210 // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgData = canvas.toDataURL('image/png')

      // Handle multi-page PDFs for long content
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= 297 // A4 height in mm

      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= 297
      }

      // Generate filename from repo/profile name
      const filename = roastData.repository?.fullName
        ? `GitRoast-${roastData.repository.fullName.replace('/', '-')}.pdf`
        : roastData.repository?.username
        ? `GitRoast-${roastData.repository.username}.pdf`
        : 'GitRoast-Report.pdf'

      // Download PDF
      pdf.save(filename)

      setDownloadingPDF(false)
    } catch (error) {
      console.error('Failed to generate PDF:', error)
      setError('Failed to generate PDF. Please try again.')
      setDownloadingPDF(false)
    }
  }

  // Cleanup timer for copied state
  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  // Cleanup timer for LinkedIn copied state
  useEffect(() => {
    if (!linkedInCopied) return
    const timer = setTimeout(() => setLinkedInCopied(false), 3000)
    return () => clearTimeout(timer)
  }, [linkedInCopied])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (linkedInTimeoutRef.current) {
        clearTimeout(linkedInTimeoutRef.current)
      }
      if (confettiTimeoutRef.current) {
        clearTimeout(confettiTimeoutRef.current)
      }
    }
  }, [])

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
            The Most Savage GitHub Roaster - AI-Powered & Brutally Honest
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
              ref={resultsRef}
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

                  <motion.button
                    onClick={downloadAsPDF}
                    disabled={downloadingPDF}
                    className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:shadow-lg transition-all ${
                      downloadingPDF
                        ? 'bg-gradient-to-r from-gray-600 to-gray-800 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-500 to-red-600'
                    }`}
                    whileHover={{ scale: downloadingPDF ? 1 : 1.05 }}
                    whileTap={{ scale: downloadingPDF ? 1 : 0.95 }}
                  >
                    <Download className="w-5 h-5" />
                    {downloadingPDF ? 'Generating PDF...' : 'Download as PDF'}
                  </motion.button>
                </div>

                {/* LinkedIn Toast Notification */}
                <AnimatePresence>
                  {linkedInCopied && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-3 bg-blue-500/20 border border-blue-500/50 rounded-lg p-3 text-center"
                    >
                      <p className="text-sm text-blue-300">
                        ✅ Text copied! Paste it into LinkedIn 📝
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
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

                {(Array.isArray(roastData.roasts) ? roastData.roasts : []).map((roast, index) => (
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
                        whileHover={{ scale: 1.02 }}
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
                  {(Array.isArray(roastData.suggestions) ? roastData.suggestions : []).map((suggestion, index) => (
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
          className="text-center mt-16 pb-8"
        >
          <p className="mb-2 text-gray-500">Made with 🔥 and absolutely no mercy</p>
          <p className="text-sm text-gray-500 mb-4">Share your savage roast and go viral! 🚀</p>

          {/* Developer Credit */}
          {import.meta.env.VITE_DEVELOPER_NAME && (
            <div className="mt-6 pt-6 border-t border-gray-800">
              <p className="text-sm text-gray-400 mb-3">
                Crafted by <span className="gradient-text font-semibold">{import.meta.env.VITE_DEVELOPER_NAME}</span>
              </p>
              <div className="flex items-center justify-center gap-4">
                {import.meta.env.VITE_DEVELOPER_LINKEDIN && (
                  <motion.a
                    href={import.meta.env.VITE_DEVELOPER_LINKEDIN}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                    title="LinkedIn Profile"
                  >
                    <Linkedin className="w-5 h-5" />
                  </motion.a>
                )}
                {import.meta.env.VITE_DEVELOPER_WEBSITE && (
                  <motion.a
                    href={import.meta.env.VITE_DEVELOPER_WEBSITE}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                    title="Portfolio Website"
                  >
                    <Globe className="w-5 h-5" />
                  </motion.a>
                )}
                {import.meta.env.VITE_DEVELOPER_EMAIL && (
                  <motion.a
                    href={`mailto:${import.meta.env.VITE_DEVELOPER_EMAIL}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-gray-400 hover:text-green-400 transition-colors"
                    title="Email"
                  >
                    <Mail className="w-5 h-5" />
                  </motion.a>
                )}
              </div>
            </div>
          )}
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
      whileHover={{ scale: 1.02 }}
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
