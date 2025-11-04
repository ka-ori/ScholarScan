import { Link } from 'react-router-dom'
import { GraduationCap, Sparkles, ArrowRight, Upload, Brain, FileText, Zap, Shield, Database, Star, BookOpen, TrendingUp, Rocket, Target, Award } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

function HomePage() {
  const { isAuthenticated } = useAuthStore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-24 sm:pb-32">
          <div className="text-center">
            {/* Glowing Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white mb-8 shadow-xl">
              <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
              <span className="text-sm font-semibold tracking-wide">Next-Gen AI Research Tool</span>
            </div>

            {/* Main Heading with Gradient */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-white mb-6">
              ScholarScan
              <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mt-3">
                Research, Reimagined
              </span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-3xl mx-auto text-xl text-gray-300 mb-12 leading-relaxed">
              Harness the power of AI to analyze academic papers instantly. Get deep insights, 
              smart summaries, and accelerate your research journey with cutting-edge technology.
            </p>

            {/* CTA Buttons with Glow Effects */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to={isAuthenticated ? "/dashboard" : "/signup"}
                className="group relative px-10 py-5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  {isAuthenticated ? 'Launch Dashboard' : 'Start Free Trial'}
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="px-10 py-5 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white rounded-2xl font-bold text-lg hover:bg-white/20 transform hover:scale-105 transition-all duration-300 shadow-xl"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Social Proof */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-gray-400">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <span className="text-sm">10k+ Researchers</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-gray-600"></div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-cyan-400" />
                <span className="text-sm">50k+ Papers Analyzed</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-gray-600"></div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-400" />
                <span className="text-sm">99% Accuracy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section with Cards */}
      <div className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Supercharge Your Research
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to analyze academic papers at lightning speed
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature Card 1 */}
            <div className="group p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl hover:bg-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Upload className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Instant Upload</h3>
              <p className="text-gray-400 leading-relaxed">
                Drag & drop PDFs with instant processing. Multi-page support with zero hassle.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="group p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">AI Magic</h3>
              <p className="text-gray-400 leading-relaxed">
                Advanced AI extracts insights, methodologies, and key findings automatically.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="group p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl hover:bg-white/10 hover:border-pink-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/20">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-red-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Smart Summaries</h3>
              <p className="text-gray-400 leading-relaxed">
                Get concise breakdowns of abstracts, methods, results, and conclusions instantly.
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="group p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl hover:bg-white/10 hover:border-green-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Lightning Fast</h3>
              <p className="text-gray-400 leading-relaxed">
                Process entire papers in seconds with our optimized AI pipeline infrastructure.
              </p>
            </div>

            {/* Feature Card 5 */}
            <div className="group p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Fort Knox Security</h3>
              <p className="text-gray-400 leading-relaxed">
                Bank-grade encryption, JWT auth, and secure cloud storage keep your research safe.
              </p>
            </div>

            {/* Feature Card 6 */}
            <div className="group p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl hover:bg-white/10 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/20">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Database className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Smart Library</h3>
              <p className="text-gray-400 leading-relaxed">
                Organize analyzed papers with searchable metadata, tags, and personal notes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Three Steps to Genius
            </h2>
            <p className="text-xl text-gray-300">
              From upload to insight in under 30 seconds
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center text-4xl font-black text-white mb-6 shadow-2xl shadow-cyan-500/50">
                  1
                </div>
                <Rocket className="h-10 w-10 text-cyan-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-3">Upload Paper</h3>
                <p className="text-gray-400 leading-relaxed">
                  Drop your PDF and watch our AI spring into action. Supports all academic formats.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center text-4xl font-black text-white mb-6 shadow-2xl shadow-purple-500/50">
                  2
                </div>
                <Target className="h-10 w-10 text-purple-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-3">AI Analysis</h3>
                <p className="text-gray-400 leading-relaxed">
                  Our neural networks extract key insights, methodologies, and critical findings.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-red-600 rounded-3xl flex items-center justify-center text-4xl font-black text-white mb-6 shadow-2xl shadow-pink-500/50">
                  3
                </div>
                <Award className="h-10 w-10 text-pink-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-3">Get Results</h3>
                <p className="text-gray-400 leading-relaxed">
                  View structured summaries, visualizations, and actionable insights immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl p-12 shadow-2xl">
            <GraduationCap className="h-16 w-16 text-white mx-auto mb-6" />
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
              Ready to 10x Your Research?
            </h2>
            <p className="text-xl text-white/90 mb-10">
              Join thousands of researchers who are already using ScholarScan to accelerate their work.
            </p>
            <Link
              to={isAuthenticated ? "/dashboard" : "/signup"}
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-purple-600 rounded-2xl font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started - It\'s Free'}
              <ArrowRight className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-white/10 bg-black/20 backdrop-blur-md py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <GraduationCap className="h-6 w-6 text-purple-400" />
              <span className="text-xl font-bold text-white">ScholarScan</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2025 ScholarScan. Powered by AI. Built for Researchers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
