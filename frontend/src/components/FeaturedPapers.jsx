import { ExternalLink } from 'lucide-react'
import LazyImage from './LazyImage'

function FeaturedPapers() {
  const papers = [
    {
      id: 'paper-1',
      title: 'Advanced Learners\' Use of Mobile Devices for English Language Study',
      url: 'https://files.eric.ed.gov/fulltext/EJ1172284.pdf',
      image: 'https://images.unsplash.com/photo-1507842217343-583f7270bfba?w=400&h=400&fit=crop',
      description: 'Research on mobile device usage in English language learning'
    },
    {
      id: 'paper-2',
      title: 'Introduction to 2D Materials - NITI Aayog Future Front',
      url: 'https://niti.gov.in/sites/default/files/2025-09/FTH-Quaterly-Insight-Sep-2025.pdf',
      image: 'https://images.unsplash.com/photo-1635070041078-e291bc3d3f0f?w=400&h=400&fit=crop',
      description: 'Quarterly frontier tech insights on 2D materials'
    },
    {
      id: 'paper-3',
      title: 'India\'s Data Imperative - The Pivot Towards Quality',
      url: 'https://niti.gov.in/sites/default/files/2025-06/FTH-Quaterly-Insight-june.pdf',
      image: 'https://images.unsplash.com/photo-1526374965328-7f5ae4e8b51b?w=400&h=400&fit=crop',
      description: 'India\'s data strategy and quality initiatives'
    },
    {
      id: 'paper-4',
      title: 'The Only Way to Predict the Future is to Create It',
      url: 'https://niti.gov.in/sites/default/files/2025-03/Future-Front-Quarterly-Frontier-Tech-Insights-March-2025.pdf',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=400&fit=crop',
      description: 'Future tech insights and predictions for 2025'
    },
    {
      id: 'paper-5',
      title: 'Research Paper - Computer Science',
      url: 'https://www.sciencedirect.com/topics/computer-science/research-paper',
      image: 'https://images.unsplash.com/photo-1516979187457-635ffe35ff8f?w=400&h=400&fit=crop',
      description: 'ScienceDirect research paper definitions and resources'
    }
  ]

  return (
    <div className="mb-12">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2">Featured Research Papers</h2>
        <p className="text-gray-600">Explore curated research papers in various domains</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {papers.map((paper) => (
          <a
            key={paper.id}
            href={paper.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-xl bg-gray-200 aspect-square shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <LazyImage
              src={paper.image}
              alt={paper.title}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <div className="text-white">
                <h3 className="text-sm font-bold line-clamp-2 mb-1 group-hover:line-clamp-none">
                  {paper.title}
                </h3>
                <p className="text-xs text-gray-200 mb-2 line-clamp-1">{paper.description}</p>
                <div className="flex items-center gap-1 text-xs font-medium text-blue-300 group-hover:text-blue-200">
                  <span>Open Paper</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

export default FeaturedPapers
