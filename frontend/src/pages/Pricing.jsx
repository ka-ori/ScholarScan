import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { GraduationCap, ArrowRight, Check } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

function Pricing() {
  const { isAuthenticated } = useAuthStore()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      description: 'Perfect for getting started',
      features: [
        '5 papers per month',
        'Basic AI analysis',
        'Community support',
        'Standard processing speed'
      ]
    },
    {
      name: 'Professional',
      price: '$29',
      period: '/month',
      description: 'For active researchers',
      features: [
        'Unlimited papers',
        'Advanced AI analysis',
        'Priority support',
        'Fast processing',
        'Collaboration tools',
        'Export to multiple formats'
      ],
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For institutions',
      features: [
        'Everything in Professional',
        'Team management',
        'Advanced analytics',
        'Custom integrations',
        'Dedicated support',
        'SLA guarantee'
      ]
    }
  ]

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
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Choose the plan that works for you. Start free, upgrade anytime.
          </p>
        </div>
      </div>

      { }
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-2xl p-8 border-2 transition-all ${
                  plan.highlighted
                    ? 'border-black bg-white shadow-xl scale-105'
                    : 'border-gray-200 bg-white shadow-sm'
                }`}
              >
                {plan.highlighted && (
                  <div className="bg-black text-white px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-black mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6 text-sm">{plan.description}</p>
                <div className="mb-8">
                  <span className="text-5xl font-bold text-black">{plan.price}</span>
                  {plan.period && <span className="text-gray-600 ml-2">{plan.period}</span>}
                </div>
                <Link
                  to={isAuthenticated ? "/dashboard" : "/signup"}
                  className={`w-full py-3 px-4 rounded-lg font-medium mb-8 transition-all flex items-center justify-center gap-2 ${
                    plan.highlighted
                      ? 'bg-black text-white hover:bg-gray-800'
                      : 'bg-gray-100 text-black hover:bg-gray-200'
                  }`}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      { }
      <div className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-16 text-black">FAQ</h2>
          <div className="space-y-6">
            <div className="border-2 border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-black mb-2">Can I switch plans anytime?</h3>
              <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div className="border-2 border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-black mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">Yes, start with our Starter plan completely free. No credit card required.</p>
            </div>
            <div className="border-2 border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-black mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept all major credit cards, PayPal, and bank transfers for enterprise plans.</p>
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
            Try ScholarScan free today.
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

export default Pricing
