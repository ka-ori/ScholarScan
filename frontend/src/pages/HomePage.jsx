import { Link } from 'react-router-dom'
import { GraduationCap, Sparkles, Zap, ArrowRight, BookOpen, Brain, CheckCircle } from 'lucide-react'
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
              <span className="text-sm font-medium">AI-Powered Research Analysis</span>
            </div>

            {/* Main Heading with Gradient */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 animate-slide-up">
              Unlock Research Insights
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mt-2">
                With AI Intelligence
              </span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-10 animate-slide-up-delay">
              Transform research papers into actionable insights. Upload, analyze, and discover 
              key findings with the power of artificial intelligence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-delay">
              <Link
                to={isAuthenticated ? "/dashboard" : "/signup"}
                className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Get Started Free
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#features"
                className="flex items-center gap-2 px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold text-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 border border-gray-200"
              >
                Learn More
              </a>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto animate-fade-in-delay-2">
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600">10K+</div>
                <div className="text-sm text-gray-600 mt-1">Papers Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600">95%</div>
                <div className="text-sm text-gray-600 mt-1">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-pink-600">5min</div>
                <div className="text-sm text-gray-600 mt-1">Avg. Analysis Time</div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements Animation */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="w-20 h-20 bg-indigo-200 rounded-full opacity-30 blur-xl"></div>
        </div>
        <div className="absolute top-40 right-20 animate-float-delay">
          <div className="w-32 h-32 bg-purple-200 rounded-full opacity-30 blur-xl"></div>
        </div>
        <div className="absolute bottom-20 left-1/4 animate-float-delay-2">
          <div className="w-24 h-24 bg-pink-200 rounded-full opacity-30 blur-xl"></div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Research
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to analyze and understand research papers efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">AI Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced AI extracts key findings, methodologies, and conclusions from your research papers automatically.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Instant Insights</h3>
              <p className="text-gray-600 leading-relaxed">
                Get comprehensive summaries, keywords, and categorizations in minutes, not hours.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-pink-50 to-pink-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Smart References</h3>
              <p className="text-gray-600 leading-relaxed">
                Click on any finding to view the exact location in the PDF with intelligent highlighting.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-24 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting Lines */}
            <div className="hidden md:block absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200" style={{ top: '48px', left: '16.66%', right: '16.66%' }}></div>

            {/* Step 1 */}
            <div className="relative text-center">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-6 shadow-lg">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Upload Paper</h3>
              <p className="text-gray-600">
                Simply drag and drop your research paper PDF into the upload area
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative text-center">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-6 shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Processing</h3>
              <p className="text-gray-600">
                Our AI analyzes the content and extracts key insights automatically
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative text-center">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-6 shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Get Results</h3>
              <p className="text-gray-600">
                Access summaries, findings, and interactive PDF references instantly
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose ScholarScan?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Save Time</h3>
                    <p className="text-gray-600">Reduce paper review time by 90% with AI-powered analysis</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Better Understanding</h3>
                    <p className="text-gray-600">Get clear summaries and key findings highlighted</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Organized Library</h3>
                    <p className="text-gray-600">Keep all your research papers in one searchable place</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Interactive References</h3>
                    <p className="text-gray-600">Click to view exact sections in the original PDF</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center">
                <GraduationCap className="h-48 w-48 text-indigo-600 opacity-20" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Research?
          </h2>
          <p className="text-xl text-indigo-100 mb-10">
            Join researchers worldwide who are saving time with AI-powered analysis
          </p>
          <Link
            to={isAuthenticated ? "/dashboard" : "/signup"}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            Start Analyzing Now
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
              © 2025 ScholarScan. Empowering research with AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
