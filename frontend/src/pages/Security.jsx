import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { GraduationCap, ArrowRight, Lock, ShieldCheck, Eye, Database } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

function Security() {
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
            Security & Privacy
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Your data security and privacy are our top priorities.
          </p>
        </div>
      </div>

      {/* Security Features */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <Lock className="w-12 h-12 text-black mb-4" />
              <h3 className="text-2xl font-bold mb-3 text-black">End-to-End Encryption</h3>
              <p className="text-gray-600">
                All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <ShieldCheck className="w-12 h-12 text-black mb-4" />
              <h3 className="text-2xl font-bold mb-3 text-black">SOC 2 Compliant</h3>
              <p className="text-gray-600">
                We maintain SOC 2 Type II compliance and undergo regular security audits.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <Eye className="w-12 h-12 text-black mb-4" />
              <h3 className="text-2xl font-bold mb-3 text-black">Privacy First</h3>
              <p className="text-gray-600">
                We never sell your data. Your research papers are yours alone.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <Database className="w-12 h-12 text-black mb-4" />
              <h3 className="text-2xl font-bold mb-3 text-black">Secure Infrastructure</h3>
              <p className="text-gray-600">
                Hosted on enterprise-grade infrastructure with redundancy and backup.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Security Info */}
      <div className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-5xl font-bold text-black mb-12">Our Security Measures</h2>
          
          <div className="space-y-12">
            <div>
              <h3 className="text-2xl font-bold text-black mb-4">Data Protection</h3>
              <p className="text-gray-600 mb-4">
                All user data is encrypted using industry-standard encryption algorithms. We use AES-256 for data at rest and TLS 1.3 for data in transit.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-black mb-4">Access Control</h3>
              <p className="text-gray-600 mb-4">
                We implement strict access controls and role-based permissions. Only authorized personnel can access user data, and all access is logged and monitored.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-black mb-4">Compliance</h3>
              <p className="text-gray-600 mb-4">
                We comply with GDPR, CCPA, and other data protection regulations. We are SOC 2 Type II certified and maintain continuous compliance monitoring.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-black mb-4">Incident Response</h3>
              <p className="text-gray-600 mb-4">
                We have a comprehensive incident response plan and security team on standby 24/7. Any security incidents are investigated thoroughly and reported transparently.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-black mb-4">Regular Audits</h3>
              <p className="text-gray-600 mb-4">
                We conduct regular security audits and penetration testing to identify and address vulnerabilities before they can be exploited.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-32 bg-black">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-6xl font-bold mb-6 text-white">
            Research Securely
          </h2>
          <p className="text-2xl text-gray-300 mb-12">
            Your data is protected with enterprise-grade security.
          </p>
          <Link
            to={isAuthenticated ? "/dashboard" : "/signup"}
            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-black rounded-lg font-semibold text-lg hover:bg-gray-100"
          >
            Get Started
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

export default Security
