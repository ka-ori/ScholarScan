import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { GraduationCap, ArrowRight, Users, Sparkles, Target, Heart } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

function About() {
  const { isAuthenticated } = useAuthStore()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-black">ScholarScan</span>
          </Link>
          <div className="flex gap-3">
            <Link
              to={isAuthenticated ? "/dashboard" : "/login"}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-black transition-colors"
            >
              Sign in
            </Link>
            <Link
              to={isAuthenticated ? "/dashboard" : "/signup"}
              className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-4">
        <div className={`max-w-5xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-black mb-6">
            About ScholarScan
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
            We're on a mission to transform research by combining AI with human expertise.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-bold text-black mb-6">Our Mission</h2>
              <p className="text-xl text-gray-600 mb-6">
                ScholarScan exists to empower researchers, academics, and students with AI-powered tools that transform how they analyze, understand, and share research.
              </p>
              <p className="text-xl text-gray-600 mb-8">
                We believe that research should be accessible, efficient, and impactful. By leveraging cutting-edge AI technology, we're making research analysis faster and more accurate than ever before.
              </p>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-all"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-12 border-2 border-gray-200">
              <Target className="w-16 h-16 text-black mb-6" />
              <p className="text-lg text-gray-700">
                Our vision is to make research analysis accessible to everyone, regardless of their technical background or resources.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-16 text-black">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-gray-200">
              <Sparkles className="w-10 h-10 text-black mb-4" />
              <h3 className="text-2xl font-bold mb-3 text-black">Innovation</h3>
              <p className="text-gray-600">
                We continuously push the boundaries of what's possible with AI and research technology.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-gray-200">
              <Users className="w-10 h-10 text-black mb-4" />
              <h3 className="text-2xl font-bold mb-3 text-black">Accessibility</h3>
              <p className="text-gray-600">
                Research tools should be available to everyone, not just well-funded institutions.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-gray-200">
              <Heart className="w-10 h-10 text-black mb-4" />
              <h3 className="text-2xl font-bold mb-3 text-black">Excellence</h3>
              <p className="text-gray-600">
                We're committed to delivering the highest quality results and user experience.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-12 text-black">Built by Researchers</h2>
          <p className="text-center text-xl text-gray-600 mb-16 max-w-3xl mx-auto">
            Our team combines expertise in AI, academia, and product design to create tools that actually work for researchers.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-32 bg-black">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-6xl font-bold mb-6 text-white">
            Join the Research Revolution
          </h2>
          <p className="text-2xl text-gray-300 mb-12">
            Start analyzing research papers with AI today.
          </p>
          <Link
            to={isAuthenticated ? "/dashboard" : "/signup"}
            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-black rounded-lg font-semibold text-lg hover:bg-gray-100"
          >
            Get ScholarScan free
            <ArrowRight className="w-5 h-5" />
          </Link>
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
              <Link to="/about" className="hover:text-black cursor-pointer transition-colors">About</Link>
              <Link to="/pricing" className="hover:text-black cursor-pointer transition-colors">Pricing</Link>
              <Link to="/security" className="hover:text-black cursor-pointer transition-colors">Security</Link>
              <Link to="/contact" className="hover:text-black cursor-pointer transition-colors">Contact</Link>
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

export default About
