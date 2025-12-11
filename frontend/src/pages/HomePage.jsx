import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { GraduationCap, Sparkles, ArrowRight, Brain, Users, ChevronRight, Search, FileText, TrendingUp, BookOpen } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import LazyImage from '../components/LazyImage'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function HomePage() {
  const { isAuthenticated } = useAuthStore()
  const [isVisible, setIsVisible] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const trustedByRef = useRef(null)
  const researchLibRef = useRef(null)
  const feature1Ref = useRef(null)
  const feature2Ref = useRef(null)
  const socialProofRef = useRef(null)
  const ctaRef = useRef(null)
  const instantAnalysisRef = useRef(null)
  const underlineRef = useRef(null)
  const periodRef = useRef(null)
  const letterRefs = useRef([])

  useEffect(() => {
    setIsVisible(true)

    // Scroll to top button visibility
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)

    // Enable smooth scrolling
    gsap.config({
      force3D: true
    })

    // Hero animation: "Instant Analysis" falls and bends the underline
    if (instantAnalysisRef.current && underlineRef.current && periodRef.current) {
      const heroTimeline = gsap.timeline({ delay: 0.5 })

      // Prepare initial states
      gsap.set(instantAnalysisRef.current, { y: -200, opacity: 0 })
      gsap.set(underlineRef.current, { rotation: 0 })

      const letterTrack = instantAnalysisRef.current.querySelector('.letter-track')
      const periodEl = periodRef.current

      if (letterTrack) {
        const colors = ['#EA4335', '#FBBC04', '#4285F4', '#34A853', '#FF6D00', '#46BDC6']
        let colorIndex = 0

        const periodSize = 16
        const underlineRect = underlineRef.current.getBoundingClientRect()
        const trackRect = letterTrack.getBoundingClientRect()
        const underlineTop = underlineRect.top - trackRect.top
        const periodBaseline = underlineTop - periodSize
        const startX = underlineRect.width - periodSize
        const endX = -periodSize
        const dropOffsetX = Math.min(40, underlineRect.width * 0.08)

        gsap.set(periodEl, {
          x: startX,
          y: periodBaseline,
          width: periodSize,
          height: periodSize,
          rotation: 0,
          opacity: 1,
          borderRadius: periodSize / 2,
          left: 0,
          top: 0,
          display: 'block'
        })

        // Reset letter state before animation
        letterRefs.current.forEach(letter => {
          if (letter) {
            letter.dataset.bounced = ''
            gsap.set(letter, { y: 0 })
          }
        })

        // Text falls in
        heroTimeline.to(instantAnalysisRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out'
        })

        // Underline bend
        heroTimeline.to(underlineRef.current, {
          rotation: -1,
          duration: 0.3,
          ease: 'elastic.out(1, 0.5)'
        }, '-=0.2')

        // Period drops to the underline
        heroTimeline.fromTo(periodEl,
          { x: startX + dropOffsetX, y: periodBaseline - 160 },
          {
            x: startX,
            y: periodBaseline,
            duration: 0.6,
            ease: 'power2.out'
          },
          '-=0.3'
        )

        // Period rolls left along the underline (constant height)
        heroTimeline.to(periodEl, {
          x: endX,
          rotation: -540,
          width: periodSize * 1.6,
          height: periodSize * 1.6,
          duration: 2.5,
          ease: 'none',
          onUpdate: () => {
            const periodRect = periodEl.getBoundingClientRect()
            const currentUnderlineRect = underlineRef.current.getBoundingClientRect()
            const currentTrackRect = letterTrack.getBoundingClientRect()
            
            // Recalculate period's y-position to match moving underline
            const currentUnderlineTop = currentUnderlineRect.top - currentTrackRect.top
            const currentPeriodY = currentUnderlineTop - (periodSize * 1.6) / 2
            gsap.set(periodEl, { y: currentPeriodY })

            letterRefs.current.forEach(letter => {
              if (!letter) return

              const letterRect = letter.getBoundingClientRect()
              const distance = Math.abs(periodRect.left - letterRect.left)

              if (distance < 40 && !letter.dataset.bounced) {
                letter.dataset.bounced = 'true'

                gsap.to(letter, {
                  y: -15,
                  duration: 0.15,
                  ease: 'power2.out',
                  onComplete: () => {
                    gsap.to(letter, {
                      y: 0,
                      duration: 0.15,
                      ease: 'power2.in'
                    })
                  }
                })

                gsap.to(letter, {
                  color: colors[colorIndex % colors.length],
                  duration: 0.3,
                  onComplete: () => {
                    gsap.to(letter, {
                      color: '#111',
                      duration: 0.3,
                      delay: 0.15
                    })
                  }
                })

                colorIndex++
              }
            })
          }
        }, '-=0.1')

        heroTimeline.to(periodEl, {
          x: endX - periodSize * 3,
          y: periodBaseline + 140,
          rotation: -900,
          opacity: 0,
          duration: 0.55,
          ease: 'power2.in'
        }, '-=0.05')

        heroTimeline.set(periodEl, { display: 'none' })
      }
    }

    // Infinite scrolling "Trusted By" section
    if (trustedByRef.current) {
      const logosContainer = trustedByRef.current.querySelector('.logos-scroll')
      
      if (logosContainer) {
        // Animation: scroll left infinitely
        gsap.fromTo(
          logosContainer,
          { x: 0 },
          {
            x: -logosContainer.offsetWidth / 3, // Scroll by one set width
            duration: 30,
            ease: 'none',
            repeat: -1,
            repeatDelay: 0
          }
        )
      }
    }

    // Animate research-lib with pop-up effect
    if (researchLibRef.current) {
      gsap.fromTo(researchLibRef.current,
        { scale: 0.8, opacity: 0, y: 50 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: researchLibRef.current,
            start: 'top 85%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }

    // Feature 1 - AI Analysis animation (slide from left)
    if (feature1Ref.current) {
      const leftContent = feature1Ref.current.querySelector('.feature-content')
      const rightContent = feature1Ref.current.querySelector('.feature-visual')
      
      gsap.fromTo(leftContent,
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: feature1Ref.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      gsap.fromTo(rightContent,
        { x: 100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: feature1Ref.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }

    // Feature 2 - Search animation (slide from right)
    if (feature2Ref.current) {
      const leftContent = feature2Ref.current.querySelector('.feature-visual')
      const rightContent = feature2Ref.current.querySelector('.feature-content')
      
      gsap.fromTo(leftContent,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: feature2Ref.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      gsap.fromTo(rightContent,
        { y: -100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: feature2Ref.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }

    // Social proof cards stagger animation
    if (socialProofRef.current) {
      const cards = socialProofRef.current.querySelectorAll('.proof-card')
      
      gsap.fromTo(cards,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: socialProofRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }

    // Final CTA scale animation
    if (ctaRef.current) {
      gsap.fromTo(ctaRef.current,
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll)
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  // Lazy load stats when scrolling into view
  useEffect(() => {
    const stats = document.querySelectorAll('.lazy-stat')
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
          }
        })
      },
      { threshold: 0.1, rootMargin: '50px' }
    )

    stats.forEach(stat => {
      observer.observe(stat)
    })

    return () => {
      stats.forEach(stat => observer.unobserve(stat))
      observer.disconnect()
    }
  }, [])

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden">
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-40 bg-black text-white p-2 sm:p-3 rounded-full hover:bg-gray-800 transition-all shadow-lg animate-fadeIn"
          aria-label="Scroll to top"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
          <div className="hidden sm:flex gap-4 md:gap-8">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
              Features
            </a>
            <a href="#search" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
              Search
            </a>
            <a href="#social-proof" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
              Testimonials
            </a>
          </div>
          <div className="sm:hidden">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-sm">ScholarScan</span>
            </div>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <Link
              to={isAuthenticated ? "/dashboard" : "/login"}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-black transition-colors"
            >
              Sign in
            </Link>
            <Link
              to={isAuthenticated ? "/dashboard" : "/signup"}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Add padding-top for navbar */}
      <div className="relative pt-20 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6">
        <div className={`max-w-5xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold text-black mb-4 sm:mb-6">
            AI-Powered Research.
            <br />
            <span ref={instantAnalysisRef} className="relative inline-block">
              <span className="letter-track inline-flex relative items-end">
                {['I', 'n', 's', 't', 'a', 'n', 't', ' ', 'A', 'n', 'a', 'l', 'y', 's', 'i', 's'].map((letter, index) => (
                  <span 
                    key={letter === ' ' ? 'space' : letter}
                    ref={el => letterRefs.current[index] = el}
                    className="inline-block"
                    style={{ display: 'inline-block' }}
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </span>
                ))}
                <span ref={periodRef} className="period-dot">.</span>
              </span>
              <div ref={underlineRef} className="absolute -bottom-2 sm:-bottom-4 left-0 right-0 h-1 sm:h-2 bg-black"></div>
            </span>
          </h1>

          <p className="text-base sm:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-10 max-w-3xl mx-auto px-2">
            Where your research papers and AI agents capture knowledge, find answers, and automate analysis.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 px-2">
            <Link
              to={isAuthenticated ? "/dashboard" : "/signup"}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base"
            >
              Get ScholarScan free
              <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
            </Link>
            {!isAuthenticated && (
              <Link
                to="/login"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-black rounded-lg font-medium hover:bg-gray-50 border-2 border-black transition-all text-sm sm:text-base"
              >
                Request a demo
              </Link>
            )}
          </div>

          {/* Demo Preview */}
          <div ref={researchLibRef} className="research-lib mt-12 sm:mt-16 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden mx-auto max-w-4xl">
            <div className="bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 border-b-2 border-gray-200">
              <div className="flex gap-2">
                <div className="w-2 sm:w-3 h-2 sm:h-3 bg-gray-300 rounded-full"></div>
                <div className="w-2 sm:w-3 h-2 sm:h-3 bg-gray-300 rounded-full"></div>
                <div className="w-2 sm:w-3 h-2 sm:h-3 bg-gray-300 rounded-full"></div>
              </div>
              <div className="flex-1 ml-4 sm:ml-8">
                <div className="bg-white rounded px-2 sm:px-3 py-1 text-xs sm:text-sm max-w-md border border-gray-200">📄 Research Library</div>
              </div>
            </div>
            
            <div className="p-3 sm:p-8 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 border-2 border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className="w-5 sm:w-8 h-5 sm:h-8 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                      <Brain className="w-3 sm:w-5 h-3 sm:h-5 text-black" />
                    </div>
                    <h4 className="font-semibold text-xs sm:text-base">Deep Learning Methods</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">Stanford University</p>
                  <span className="inline-block px-2 py-1 bg-gray-100 text-black rounded text-xs border border-gray-200">Analyzed</span>
                </div>

                <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 border-2 border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className="w-5 sm:w-8 h-5 sm:h-8 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                      <Sparkles className="w-3 sm:w-5 h-3 sm:h-5 text-black" />
                    </div>
                    <h4 className="font-semibold text-xs sm:text-base">Quantum Computing</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">MIT Research Lab</p>
                  <span className="inline-block px-2 py-1 bg-gray-100 text-black rounded text-xs border border-gray-200">Processing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trusted By Section */}
      <div ref={trustedByRef} className="py-10 sm:py-16 border-y border-gray-200 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 xl:px-8">
          <p className="text-center text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8 font-medium">TRUSTED BY TEAMS THAT SHIP</p>
          <div className="logos-scroll flex gap-12 sm:gap-16 md:gap-24 items-center" style={{ width: 'max-content' }}>
            {/* First set of logos */}
            <div className="flex gap-12 sm:gap-16 md:gap-24 opacity-40">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-black whitespace-nowrap">OpenAI</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-black whitespace-nowrap">Vercel</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-black whitespace-nowrap">Google</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-black whitespace-nowrap">MIT</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-black whitespace-nowrap">Stanford</div>
            </div>
            {/* Duplicate set for seamless loop */}
            <div className="flex gap-12 sm:gap-16 md:gap-24 opacity-40">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-black whitespace-nowrap">OpenAI</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-black whitespace-nowrap">Vercel</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-black whitespace-nowrap">Google</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-black whitespace-nowrap">MIT</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-black whitespace-nowrap">Stanford</div>
            </div>
            {/* Triple set for extra coverage */}
            <div className="flex gap-12 sm:gap-16 md:gap-24 opacity-40">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-black whitespace-nowrap">OpenAI</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-black whitespace-nowrap">Vercel</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-black whitespace-nowrap">Google</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-black whitespace-nowrap">MIT</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-black whitespace-nowrap">Stanford</div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature 1 - AI Analysis */}
      <div ref={feature1Ref} id="features" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 xl:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-16 items-center">
            <div className="feature-content">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 text-black rounded-full mb-4 sm:mb-6 text-xs sm:text-sm font-medium border border-gray-200">
                <Brain className="w-3 sm:w-4 h-3 sm:h-4" />
                AI Analysis
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold text-black mb-4 sm:mb-6">
                You upload the papers.
                <br />
                Your AI Agent does the work.
              </h2>
              <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8">
                Hand off your research analysis. What used to take days now takes minutes.
              </p>
              <Link to="/signup" className="inline-flex items-center gap-2 text-black font-semibold hover:underline text-sm sm:text-base">
                Learn more <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5" />
              </Link>
            </div>
            <div className="feature-visual bg-gray-50 rounded-2xl p-4 sm:p-8 shadow-xl border-2 border-gray-200">
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg mb-3 sm:mb-4 border border-gray-200">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-8 sm:w-10 h-8 sm:h-10 bg-black rounded-lg flex items-center justify-center">
                    <Brain className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base">AI Summary</h4>
                    <p className="text-xs sm:text-sm text-gray-500">Generated in 3.2s</p>
                  </div>
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-black rounded-full"></div>
                    <p className="text-xs sm:text-sm">Abstract extracted</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-black rounded-full"></div>
                    <p className="text-xs sm:text-sm">Methodology identified</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div className="bg-white rounded-lg p-3 sm:p-4 shadow border border-gray-200">
                  <TrendingUp className="w-5 sm:w-6 h-5 sm:h-6 text-black mb-1 sm:mb-2" />
                  <p className="text-lg sm:text-2xl font-bold">234</p>
                  <p className="text-xs sm:text-sm text-gray-600">Citations found</p>
                </div>
                <div className="bg-white rounded-lg p-3 sm:p-4 shadow border border-gray-200">
                  <Users className="w-5 sm:w-6 h-5 sm:h-6 text-black mb-1 sm:mb-2" />
                  <p className="text-lg sm:text-2xl font-bold">12</p>
                  <p className="text-xs sm:text-sm text-gray-600">Related papers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature 2 - Search */}
      <div ref={feature2Ref} id="search" className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 xl:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-16 items-center">
            <div className="feature-visual order-2 lg:order-1 bg-white rounded-2xl p-4 sm:p-8 shadow-2xl border-2 border-gray-200">
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 border-b pb-2 sm:pb-3">
                  <Search className="w-5 sm:w-6 h-5 sm:h-6 text-gray-400" />
                  <input type="text" placeholder="Search papers..." className="flex-1 text-base sm:text-lg outline-none" defaultValue="machine learning" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 sm:px-3 py-1 bg-gray-100 rounded-full text-xs sm:text-sm border border-gray-200">📄 ScholarScan</span>
                  <span className="px-2 sm:px-3 py-1 bg-gray-100 rounded-full text-xs sm:text-sm border border-gray-200">📊 Research</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <BookOpen className="w-4 sm:w-5 h-4 sm:h-5 text-black flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm sm:text-base truncate">Deep Learning Research</p>
                      <p className="text-xs sm:text-sm text-gray-600">Neural Networks • Stanford</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="feature-content order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 text-black rounded-full mb-4 sm:mb-6 text-xs sm:text-sm font-medium border border-gray-200">
                <Search className="w-3 sm:w-4 h-3 sm:h-4" />
                Enterprise Search
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4 sm:mb-6">
                One search for
                <br />
                everything.
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8">
                Search across all your research papers instantly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Research - Lazy Loaded Images */}
      <div className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">Research Powered by ScholarScan</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of researchers who use our platform to analyze complex papers and data.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                id: 1,
                src: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
                title: 'Advanced Laboratory Research',
                category: 'Biotechnology'
              },
              {
                id: 2,
                src: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
                title: 'Academic Literature Review',
                category: 'Humanities'
              },
              {
                id: 3,
                src: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=800&q=80',
                title: 'University Library Archives',
                category: 'Education'
              },
              {
                id: 4,
                src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
                title: 'Digital Data Analysis',
                category: 'Computer Science'
              },
              {
                id: 5,
                src: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
                title: 'Code & Algorithms',
                category: 'Software Engineering'
              },
              {
                id: 6,
                src: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&w=800&q=80',
                title: 'Statistical Modeling',
                category: 'Data Science'
              }
            ].map((item) => (
              <div key={item.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-black">
                <div className="aspect-w-16 aspect-h-10 bg-gray-200 overflow-hidden">
                  <LazyImage
                    src={item.src}
                    alt={item.title}
                    className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="text-xs font-bold text-blue-600 mb-2 uppercase tracking-wider">{item.category}</div>
                  <h3 className="text-xl font-bold text-black mb-2">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div ref={socialProofRef} id="social-proof" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 xl:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 lg:mb-16 text-black">
            Trusted by teams that ship.
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="proof-card bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 shadow-sm border-2 border-gray-200">
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Stanford University</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                &ldquo;ScholarScan has transformed how our research team processes papers.&rdquo;
              </p>
              <p className="text-xs sm:text-sm text-gray-500">— Research Director</p>
            </div>
            <div className="proof-card bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 shadow-sm border-2 border-gray-200">
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">MIT Research Lab</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                &ldquo;The AI analysis is incredibly accurate. Like a research assistant that never sleeps.&rdquo;
              </p>
              <p className="text-xs sm:text-sm text-gray-500">— Senior Researcher</p>
            </div>
            <div className="proof-card bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 shadow-sm border-2 border-gray-200 sm:col-span-2 lg:col-span-1">
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Cambridge AI Lab</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                &ldquo;Using AI-native tools like ScholarScan is an important competitive advantage.&rdquo;
              </p>
              <p className="text-xs sm:text-sm text-gray-500">— Lab Manager</p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div ref={ctaRef} className="py-16 sm:py-24 lg:py-32 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-black">
            Try for free.
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-10 lg:mb-12">
            Your AI research workspace with built-in analysis.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2">
            <Link
              to={isAuthenticated ? "/dashboard" : "/signup"}
              className="px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 bg-black text-white rounded-lg font-semibold text-sm sm:text-base lg:text-lg hover:bg-gray-800 transition-colors"
            >
              Get ScholarScan free
            </Link>
            {!isAuthenticated && (
              <Link
                to="/login"
                className="px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 bg-white rounded-lg font-semibold text-sm sm:text-base lg:text-lg hover:bg-gray-50 border-2 border-black transition-colors"
              >
                Request a demo
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-gray-200 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 xl:px-8">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-7 sm:w-8 h-7 sm:h-8 bg-black rounded-lg flex items-center justify-center">
                <GraduationCap className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-black">ScholarScan</span>
            </div>
          </div>
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t-2 border-gray-200 text-center text-xs sm:text-sm text-gray-500">
            © 2025 ScholarScan Labs • AI-Powered Research Analysis
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
