import { Link } from 'react-router-dom'
import { GraduationCap, Sparkles, ArrowRight, Upload, Brain, FileText, Zap, Shield, Database } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

function HomePage() {
  const { isAuthenticated } = useAuthStore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-24 sm:pb-32">
          <div className="text-center">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 mb-8 animate-fade-in">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">AI-Powered Research Assistant</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 animate-slide-up">
              ScholarScan
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mt-2">
                Transform Your Research
              </span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-10 animate-slide-up-delay">
              Upload academic papers and get instant AI-powered analysis, summaries, and insights. 
              Streamline your research workflow with intelligent document processing.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-delay">
              <Link
                to={isAuthenticated ? "/dashboard" : "/signup"}
                className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold text-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 border border-gray-200"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Researchers
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to analyze and understand academic papers faster
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards */}
            <div className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl transform hover:scale-105 transition-transform duration-300">
              <Upload className="h-8 w-8 text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Easy PDF Upload</h3>
              <p className="text-gray-600">
                Drag and drop your research papers. Support for multi-page PDFs with instant processing.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl transform hover:scale-105 transition-transform duration-300">
              <Brain className="h-8 w-8 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI-Powered Analysis</h3>
              <p className="text-gray-600">
                Advanced AI extracts key insights, methodologies, and findings from your papers automatically.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl transform hover:scale-105 transition-transform duration-300">
              <FileText className="h-8 w-8 text-pink-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Summaries</h3>
              <p className="text-gray-600">
                Get concise summaries of abstract, methodology, results, and conclusions in seconds.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl transform hover:scale-105 transition-transform duration-300">
              <Zap className="h-8 w-8 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">
                Process papers in seconds with our optimized AI pipeline and cloud infrastructure.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl transform hover:scale-105 transition-transform duration-300">
              <Shield className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-gray-600">
                Your research is protected with JWT authentication and encrypted cloud storage.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl transform hover:scale-105 transition-transform duration-300">
              <Database className="h-8 w-8 text-yellow-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Organized Library</h3>
              <p className="text-gray-600">
                Keep all your analyzed papers in one place with searchable metadata and notes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-24 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to get insights from your research papers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Upload Your Paper</h3>
              <p className="text-gray-600">
                Simply drag and drop your PDF or select it from your device. We support all academic paper formats.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Analyzes Content</h3>
              <p className="text-gray-600">
                Our advanced AI reads through the entire paper, extracting key information and generating insights.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Get Your Insights</h3>
              <p className="text-gray-600">
                View structured summaries, key findings, and methodology breakdowns in an easy-to-read format.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <GraduationCap className="h-16 w-16 text-white mx-auto mb-6 animate-bounce" />
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Supercharge Your Research?
          </h2>
          <p className="text-xl text-indigo-100 mb-10">
            Join researchers who are saving hours on paper analysis with ScholarScan
          </p>
          <Link
            to={isAuthenticated ? "/dashboard" : "/signup"}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            {isAuthenticated ? 'Open Dashboard' : 'Start Analyzing Now'}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <GraduationCap className="h-6 w-6 text-indigo-400" />
              <span className="text-xl font-bold text-white">ScholarScan</span>
            </div>
            <p className="text-sm text-gray-400">
              © 2025 ScholarScan - AI-Powered Research Analysis
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
