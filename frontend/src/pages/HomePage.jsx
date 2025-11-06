import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { GraduationCap, Sparkles, ArrowRight, Brain, Users, ChevronRight, TrendingUp, BookOpen, Search } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

function HomePage() {
  const { isAuthenticated } = useAuthStore()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-4">
        <div className={`max-w-5xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-black mb-6">
            AI-Powered Research.
            <br />
            <span className="relative inline-block">
              Instant Analysis.
              <div className="absolute -bottom-2 left-0 right-0 h-3 bg-black -rotate-1"></div>
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Where your research papers and AI agents capture knowledge, find answers, and automate analysis.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to={isAuthenticated ? "/dashboard" : "/signup"}
              className="px-8 py-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              Get ScholarScan free
              <ArrowRight className="w-5 h-5" />
            </Link>
            {!isAuthenticated && (
              <Link
                to="/login"
                className="px-8 py-4 bg-white text-black rounded-lg font-medium hover:bg-gray-50 border-2 border-black transition-all"
              >
                Request a demo
              </Link>
            )}
          </div>

          {/* Demo Preview */}
          <div className="mt-16 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 flex items-center gap-2 border-b-2 border-gray-200">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              </div>
              <div className="flex-1 ml-8">
                <div className="bg-white rounded px-3 py-1 text-sm max-w-md border border-gray-200">📄 Research Library</div>
              </div>
            </div>
            
            <div className="p-8 bg-white">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                      <Brain className="w-5 h-5 text-black" />
                    </div>
                    <h4 className="font-semibold">Deep Learning Methods</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Stanford University</p>
                  <span className="px-2 py-1 bg-gray-100 text-black rounded text-sm border border-gray-200">Analyzed</span>
                </div>

                <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                      <Sparkles className="w-5 h-5 text-black" />
                    </div>
                    <h4 className="font-semibold">Quantum Computing</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">MIT Research Lab</p>
                  <span className="px-2 py-1 bg-gray-100 text-black rounded text-sm border border-gray-200">Processing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trusted By Section */}
      <div className="py-16 border-y border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-sm text-gray-500 mb-8 font-medium">TRUSTED BY TEAMS THAT SHIP</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-40">
            <div className="text-2xl font-bold text-black">OpenAI</div>
            <div className="text-2xl font-bold text-black">Vercel</div>
            <div className="text-2xl font-bold text-black">Google</div>
            <div className="text-2xl font-bold text-black">MIT</div>
            <div className="text-2xl font-bold text-black">Stanford</div>
          </div>
        </div>
      </div>

      {/* Feature 1 - AI Analysis */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-black rounded-full mb-6 text-sm font-medium border border-gray-200">
                <Brain className="w-4 h-4" />
                AI Analysis
              </div>
              <h2 className="text-5xl font-bold text-black mb-6">
                You upload the papers.
                <br />
                Your AI Agent does the work.
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Hand off your research analysis. What used to take days now takes minutes.
              </p>
              <Link to="/signup" className="inline-flex items-center gap-2 text-black font-semibold hover:underline">
                Learn more <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 shadow-xl border-2 border-gray-200">
              <div className="bg-white rounded-xl p-6 shadow-lg mb-4 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold">AI Summary</h4>
                    <p className="text-sm text-gray-500">Generated in 3.2s</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <p className="text-sm">Abstract extracted</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <p className="text-sm">Methodology identified</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
                  <TrendingUp className="w-6 h-6 text-black mb-2" />
                  <p className="text-2xl font-bold">234</p>
                  <p className="text-sm text-gray-600">Citations found</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
                  <Users className="w-6 h-6 text-black mb-2" />
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-gray-600">Related papers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature 2 - Search */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="bg-white rounded-2xl p-8 shadow-2xl border-2 border-gray-200">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4 border-b pb-3">
                  <Search className="w-6 h-6 text-gray-400" />
                  <input type="text" placeholder="Search papers..." className="flex-1 text-lg outline-none" defaultValue="machine learning" />
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm border border-gray-200">📄 ScholarScan</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm border border-gray-200">📊 Research</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-black" />
                    <div>
                      <p className="font-semibold">Deep Learning Research</p>
                      <p className="text-sm text-gray-600">Neural Networks • Stanford</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-black rounded-full mb-6 text-sm font-medium border border-gray-200">
                <Search className="w-4 h-4" />
                Enterprise Search
              </div>
              <h2 className="text-5xl font-bold text-black mb-6">
                One search for
                <br />
                everything.
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Search across all your research papers instantly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-16 text-black">
            Trusted by teams that ship.
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-gray-200">
              <h3 className="text-xl font-bold mb-3">Stanford University</h3>
              <p className="text-gray-600 mb-4">
                "ScholarScan has transformed how our research team processes papers."
              </p>
              <p className="text-sm text-gray-500">— Research Director</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-gray-200">
              <h3 className="text-xl font-bold mb-3">MIT Research Lab</h3>
              <p className="text-gray-600 mb-4">
                "The AI analysis is incredibly accurate. Like a research assistant that never sleeps."
              </p>
              <p className="text-sm text-gray-500">— Senior Researcher</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-gray-200">
              <h3 className="text-xl font-bold mb-3">Cambridge AI Lab</h3>
              <p className="text-gray-600 mb-4">
                "Using AI-native tools like ScholarScan is an important competitive advantage."
              </p>
              <p className="text-sm text-gray-500">— Lab Manager</p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-32 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-6xl font-bold mb-6 text-black">
            Try for free.
          </h2>
          <p className="text-2xl text-gray-600 mb-12">
            Your AI research workspace with built-in analysis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={isAuthenticated ? "/dashboard" : "/signup"}
              className="px-10 py-5 bg-black text-white rounded-lg font-semibold text-lg hover:bg-gray-800"
            >
              Get ScholarScan free
            </Link>
            {!isAuthenticated && (
              <Link
                to="/login"
                className="px-10 py-5 bg-white rounded-lg font-semibold text-lg hover:bg-gray-50 border-2 border-black"
              >
                Request a demo
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-6 md:mb-0">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-black">ScholarScan</span>
            </div>
            <div className="flex gap-8 text-sm text-gray-600">
              <button className="hover:text-black cursor-pointer">About</button>
              <button className="hover:text-black cursor-pointer">Pricing</button>
              <button className="hover:text-black cursor-pointer">Security</button>
              <button className="hover:text-black cursor-pointer">Contact</button>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t-2 border-gray-200 text-center text-sm text-gray-500">
            © 2025 ScholarScan Labs • AI-Powered Research Analysis
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
