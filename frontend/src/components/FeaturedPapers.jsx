import { useRef, useEffect, useState } from 'react'
import { BarChart3, FileText, Zap, TrendingUp } from 'lucide-react'

function StatisticsMetrics() {
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (hasAnimated) return

    const currentRef = containerRef.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true)
          setHasAnimated(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      observer.disconnect()
    }
  }, [hasAnimated])

  const stats = [
    {
      id: 'stat-1',
      label: 'Papers Analyzed',
      value: '15,240',
      icon: FileText,
      trend: '+12% this month'
    },
    {
      id: 'stat-2',
      label: 'Research Time Saved',
      value: '2,450h',
      icon: Zap,
      trend: '+28% faster'
    },
    {
      id: 'stat-3',
      label: 'AI Insights Generated',
      value: '48,756',
      icon: BarChart3,
      trend: '+45% accuracy'
    },
    {
      id: 'stat-4',
      label: 'Active Researchers',
      value: '3,842',
      icon: TrendingUp,
      trend: '+18% growth'
    }
  ]

  return (
    <div ref={containerRef} className="mb-12">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2">Platform Statistics</h2>
        <p className="text-gray-600">ScholarScan impact and metrics</p>
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {stats.map((stat) => {
          const IconComponent = stat.icon
          return (
            <div
              key={stat.id}
              className="bg-white border-2 border-black rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-default"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              </div>

              <h3 className="text-gray-600 text-sm font-medium mb-2">{stat.label}</h3>

              <div className="mb-4">
                <p className="text-3xl sm:text-4xl font-bold text-black">{stat.value}</p>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-black bg-gray-100 px-3 py-1 rounded-full w-fit">
                <TrendingUp className="w-3 h-3" />
                {stat.trend}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default StatisticsMetrics
