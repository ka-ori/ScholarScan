import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { GraduationCap, ArrowRight, Mail, MessageSquare, Linkedin, Twitter } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

function Contact() {
  const { isAuthenticated } = useAuthStore()
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
     
    console.log('Form submitted:', formData)
    alert('Thank you for your message! We will get back to you soon.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-white">
      { }
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

      { }
      <div className="relative pt-32 pb-20 px-4">
        <div className={`max-w-5xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-black mb-6">
            Get in Touch
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Have a question or feedback? We would love to hear from you.
          </p>
        </div>
      </div>

      { }
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            { }
            <div>
              <h2 className="text-3xl font-bold text-black mb-8">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-black outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-black outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-black outline-none transition-colors"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-black outline-none transition-colors"
                    placeholder="Your message..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                >
                  Send Message
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            { }
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
                <Mail className="w-8 h-8 text-black mb-4" />
                <h3 className="text-xl font-bold text-black mb-2">Email</h3>
                <p className="text-gray-600 mb-2">contact@scholarscan.com</p>
                <p className="text-gray-600 text-sm">We will respond within 24 hours</p>
              </div>

              <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
                <MessageSquare className="w-8 h-8 text-black mb-4" />
                <h3 className="text-xl font-bold text-black mb-2">Support</h3>
                <p className="text-gray-600 mb-2">support@scholarscan.com</p>
                <p className="text-gray-600 text-sm">For technical support and troubleshooting</p>
              </div>

              <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
                <h3 className="text-xl font-bold text-black mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <a href="#" className="text-black hover:text-gray-600 transition-colors">
                    <Linkedin className="w-6 h-6" />
                  </a>
                  <a href="#" className="text-black hover:text-gray-600 transition-colors">
                    <Twitter className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      { }
      <div className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-16 text-black">FAQ</h2>
          <div className="space-y-6">
            <div className="border-2 border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-black mb-2">What is your response time?</h3>
              <p className="text-gray-600">We aim to respond to all inquiries within 24 hours during business days.</p>
            </div>
            <div className="border-2 border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-black mb-2">Do you offer phone support?</h3>
              <p className="text-gray-600">Phone support is available for enterprise customers. Contact us to learn more.</p>
            </div>
            <div className="border-2 border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-black mb-2">Can I schedule a demo?</h3>
              <p className="text-gray-600">Yes, contact our sales team and we will schedule a personalized demo for you.</p>
            </div>
          </div>
        </div>
      </div>

      { }
      <div className="py-32 bg-black">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-6xl font-bold mb-6 text-white">
            Ready to get started?
          </h2>
          <p className="text-2xl text-gray-300 mb-12">
            Join thousands of researchers using ScholarScan.
          </p>
          <Link
            to={isAuthenticated ? "/dashboard" : "/signup"}
            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-black rounded-lg font-semibold text-lg hover:bg-gray-100"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      { }
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

export default Contact
