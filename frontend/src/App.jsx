import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Confetti from 'react-confetti'
import { Flame, Github, Trophy, Clock, GitBranch, Zap, AlertCircle, Twitter, Linkedin, Copy, Check, Mail, Globe, Download } from 'lucide-react'
import axios from 'axios'
import { Analytics } from '@vercel/analytics/react'
import MCPIntegration from './components/MCPIntegration'
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
  const [pdfError, setPdfError] = useState('')

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
        // More tolerant parsing - handle variations in whitespace
        if (!line.startsWith('data:')) return

        // Parse JSON separately from business logic
        let data
        try {
          // Strip "data:" prefix and trim whitespace
          const payload = line.slice(5).replace(/^\s*/, '').trim()
          data = JSON.parse(payload)
        } catch (err) {
          console.error('Error parsing SSE JSON:', err)
          return // Only JSON parse errors are caught here
        }

        // Handle business logic outside try/catch so errors can propagate
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
          // Surface streaming errors to user instead of swallowing them
          setError(data.error || 'Streaming failed')
          setStreaming(false)
          setStreamText('')
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

    // Twitter character limit
    const TWITTER_LIMIT = 280

    // Find the most savage roast (highest severity)
    const roasts = Array.isArray(roastData.roasts) ? roastData.roasts : []
    const savageRoast = roasts
      .filter(r => r.severity >= 4)
      .sort((a, b) => b.severity - a.severity)[0]

    if (savageRoast) {
      // Build template with variable content
      const template = `🔥 Holy shit, I just got DESTROYED by AI!

${target} - Grade: ${roastData.grade}
Roast: "ROAST_PLACEHOLDER..."

I can't believe this is real 💀

Get roasted: ${websiteUrl}
#GitRoast`

      // Calculate how much space we have for the roast snippet
      const templateLength = template.replace('ROAST_PLACEHOLDER', '').length
      const availableForRoast = TWITTER_LIMIT - templateLength

      // Trim roast to fit within character limit
      let roastSnippet = savageRoast.content
      if (availableForRoast > 0) {
        roastSnippet = roastSnippet.substring(0, availableForRoast)
        // Try to end at a word boundary for cleaner truncation
        const lastSpace = roastSnippet.lastIndexOf(' ')
        if (lastSpace > availableForRoast * 0.8) {
          roastSnippet = roastSnippet.substring(0, lastSpace)
        }
      } else {
        // Template itself is too long, use minimal roast
        roastSnippet = ''
      }

      return template.replace('ROAST_PLACEHOLDER', roastSnippet)
    }

    // Fallback if no savage roasts
    const fallbackTemplate = `🔥 An AI just brutally roasted ${target}!

Grade: ${roastData.grade}

This is savage AF 💀

Try it: ${websiteUrl}
#GitRoast`

    // Ensure fallback also fits within limit
    if (fallbackTemplate.length > TWITTER_LIMIT) {
      // Truncate target if needed
      const overflow = fallbackTemplate.length - TWITTER_LIMIT
      const maxTargetLength = Math.max(10, target.length - overflow - 3) // Reserve 3 for "..."
      const truncatedTarget = target.length > maxTargetLength
        ? target.substring(0, maxTargetLength) + '...'
        : target

      return `🔥 An AI just brutally roasted ${truncatedTarget}!

Grade: ${roastData.grade}

This is savage AF 💀

Try it: ${websiteUrl}
#GitRoast`
    }

    return fallbackTemplate
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
    if (!roastData || downloadingPDF) return

    try {
      setDownloadingPDF(true)
      setPdfError('')

      // Call the PDF generation API endpoint
      const response = await axios.post(`${API_URL}/generate-pdf`, roastData, {
        responseType: 'blob',
      })

      // Create a blob URL and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url

      // Extract filename from Content-Disposition header (if available)
      // Falls back to generating filename client-side
      let filename = 'GitRoast-Report.pdf'
      const contentDisposition = response.headers['content-disposition']
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/)
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1]
        }
      } else {
        // Fallback: Generate filename with sanitization (same logic as backend)
        const repoName = roastData.repository?.fullName || roastData.repository?.username || 'Report'
        const safeRepoName = String(repoName).replace(/[/\\?%*:|"<>]/g, '-')
        filename = `GitRoast-${safeRepoName}.pdf`
      }

      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()

      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to download PDF:', err)

      // Extract specific error message from API response if available
      let errorMessage = 'Failed to generate PDF. Please try again.'

      if (err.response?.data) {
        // For blob responses that failed, we need to parse the error
        if (err.response.data instanceof Blob) {
          try {
            const text = await err.response.data.text()
            const errorData = JSON.parse(text)
            if (errorData.error) {
              errorMessage = `PDF generation failed: ${errorData.error}`
            }
          } catch (parseErr) {
            // If we can't parse the blob, use default message
            console.error('Failed to parse error blob:', parseErr)
          }
        } else if (typeof err.response.data === 'string') {
          errorMessage = `PDF generation failed: ${err.response.data}`
        } else if (err.response.data.error) {
          errorMessage = `PDF generation failed: ${err.response.data.error}`
        }
      } else if (err.message) {
        errorMessage = `PDF generation failed: ${err.message}`
      }

      setPdfError(errorMessage)
    } finally {
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

  // Cleanup timer for PDF error state
  useEffect(() => {
    if (!pdfError) return
    const timer = setTimeout(() => setPdfError(''), 5000)
    return () => clearTimeout(timer)
  }, [pdfError])

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

          {/* Developer Credit */}
          {import.meta.env.VITE_DEVELOPER_NAME && (
            <div className="flex items-center justify-center gap-3 text-gray-400">
              <span className="text-lg">
                Unfortunately built by <span className="gradient-text font-bold">{import.meta.env.VITE_DEVELOPER_NAME}</span>
              </span>
              <div className="flex items-center gap-3">
                {import.meta.env.VITE_DEVELOPER_LINKEDIN && (
                  <motion.a
                    href={import.meta.env.VITE_DEVELOPER_LINKEDIN}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.15 }}
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
                    whileHover={{ scale: 1.15 }}
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
                    whileHover={{ scale: 1.15 }}
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
              <h2 className="text-2xl font-bold">Analyze Public GitHub Repos or Profiles</h2>
            </div>

            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && analyzeRepo()}
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

                <p className="text-xl text-gray-300 mb-6">{parseMarkdown(roastData.gradeDescription)}</p>

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
                    {downloadingPDF ? 'Generating PDF...' : 'Download Full Roast'}
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

                {/* PDF Error Notification */}
                <AnimatePresence>
                  {pdfError && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-3 bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-center"
                    >
                      <p className="text-sm text-red-300">
                        ❌ {pdfError}
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
              <div className="grid md:grid-cols-2 gap-4">
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
                  note="Calculated using UTC timezone (11PM-5AM)"
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
                        <div className="font-bold text-yellow-400">{parseMarkdown(achievement.title)}</div>
                        <div className="text-sm text-gray-400">{parseMarkdown(achievement.description)}</div>
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
                      <span>{parseMarkdown(suggestion)}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MCP Integration Section - Shows after input, pushed down when results appear */}
        <div className="mt-16">
          <MCPIntegration />
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-16 pb-8"
        >
          <p className="mb-2 text-gray-500">Made with 🔥 and absolutely no mercy</p>
          <p className="text-sm text-gray-500">Share your savage roast and go viral! 🚀</p>
        </motion.div>
      </div>

      {/* Vercel Analytics */}
      <Analytics />
    </div>
  )
}

function StatCard({ icon, label, value, color, subtitle, note }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-dark-card rounded-xl p-6 card-glow border border-purple-500/30"
    >
      <div className={`${color} mb-2`}>{icon}</div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-gray-400">{label}</div>
      {subtitle && <div className="text-sm text-gray-500 mt-1">{subtitle}</div>}
      {note && <div className="text-xs text-gray-600 mt-1">{note}</div>}
    </motion.div>
  )
}

// Helper function to parse simple markdown (bold text) in roast content
/**
 * Comprehensive inline markdown parser
 * Handles common markdown syntax: bold, italic, code, paragraph breaks, etc.
 * Processes in correct order to avoid conflicts (e.g., ** before *)
 *
 * Features:
 * - Defensive typing: coerces non-strings to string to avoid rendering [object Object]
 * - Paragraph breaks: treats \n\n as paragraph separators
 * - Overlap resolution: prioritizes earlier patterns when matches conflict
 * - Safari-compatible: uses lookahead instead of lookbehind for broader browser support
 */
function parseMarkdown(text) {
  // Defensive typing: coerce non-string inputs to string instead of returning as-is
  // This prevents accidentally rendering [object Object] if backend sends non-string data
  if (!text) return text;
  if (typeof text !== 'string') {
    text = String(text);
  }

  // Split by double newlines to handle paragraph breaks
  // Single newlines are preserved within paragraphs
  const paragraphs = text.split(/\n\n+/);

  // Process each paragraph separately
  const processedParagraphs = paragraphs.map((paragraph, paragraphIndex) => {
    // Process markdown tokens and convert to React elements
    let currentIndex = 0;
    let keyCounter = 0;

    // Regex patterns for different markdown syntax (ordered by specificity)
    const patterns = [
      { regex: /\*\*(.*?)\*\*/g, component: (content, key) => <strong key={key} className="font-bold text-white">{content}</strong> },
      { regex: /__(.*?)__/g, component: (content, key) => <strong key={key} className="font-bold text-white">{content}</strong> },
      { regex: /`([^`]+)`/g, component: (content, key) => <code key={key} className="px-1.5 py-0.5 bg-gray-800 rounded text-sm text-cyan-400 font-mono">{content}</code> },
      { regex: /\*([^\s*](?:.*?[^\s*])?)\*/g, component: (content, key) => <em key={key} className="italic text-gray-200">{content}</em> },
      { regex: /_([^\s_](?:.*?[^\s_])?)_/g, component: (content, key) => <em key={key} className="italic text-gray-200">{content}</em> },
    ];

    // Find all matches across all patterns
    const allMatches = [];
    patterns.forEach((pattern, patternIndex) => {
      let match;
      const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
      while ((match = regex.exec(paragraph)) !== null) {
        allMatches.push({
          start: match.index,
          end: regex.lastIndex,
          content: match[1],
          component: pattern.component,
          patternIndex,
        });
      }
    });

    // Sort matches by start position, then by pattern priority (earlier patterns win)
    allMatches.sort((a, b) => {
      if (a.start !== b.start) return a.start - b.start;
      return a.patternIndex - b.patternIndex;
    });

    // Remove overlapping matches (keep first one)
    const validMatches = [];
    let lastEnd = 0;
    allMatches.forEach(match => {
      if (match.start >= lastEnd) {
        validMatches.push(match);
        lastEnd = match.end;
      }
    });

    // Build the result with React elements
    const parts = [];
    validMatches.forEach(match => {
      // Add text before this match
      if (match.start > currentIndex) {
        parts.push(paragraph.substring(currentIndex, match.start));
      }
      // Add the formatted element
      parts.push(match.component(match.content, `md-${paragraphIndex}-${keyCounter++}`));
      currentIndex = match.end;
    });

    // Add remaining text
    if (currentIndex < paragraph.length) {
      parts.push(paragraph.substring(currentIndex));
    }

    return parts.length > 0 ? parts : paragraph;
  });

  // If we have multiple paragraphs, add <br /> separators between them
  // Otherwise return the single paragraph result
  if (processedParagraphs.length > 1) {
    const result = [];
    processedParagraphs.forEach((paragraph, index) => {
      result.push(...(Array.isArray(paragraph) ? paragraph : [paragraph]));
      // Add paragraph break between paragraphs (but not after the last one)
      if (index < processedParagraphs.length - 1) {
        result.push(<br key={`br-${index}`} />);
        result.push(<br key={`br2-${index}`} />);
      }
    });
    return result;
  }

  return processedParagraphs[0];
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
          <h4 className="text-xl font-bold text-red-400 mb-2">{parseMarkdown(roast.title)}</h4>
          <p className="text-gray-300 leading-relaxed">{parseMarkdown(roast.content)}</p>
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
