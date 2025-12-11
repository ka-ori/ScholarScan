import { ExternalLink } from 'lucide-react'
import LazyImage from './LazyImage'

function FeaturedPapers() {
  const papers = [
    {
      id: 'paper-1',
      title: 'Advanced Learners\' Use of Mobile Devices for English Language Study',
      url: 'https://files.eric.ed.gov/fulltext/EJ1172284.pdf',
      image: 'https://lh7-rt.googleusercontent.com/slidesz/AGV27_Z1m8RZlb1zQyKLhqQ5bQwvJdhqXeGS3Ek8vE0nPTPO5PtCLm0_f5VmEhSk4K1qgFQ7RqgJXYLjPJzEUVZoYQr8Kb9ZIoGkNq0eJJWEqhGHvkJCw70=s1280?key=EVh3fZMOl7CZGPqDFczCNA',
      description: 'Research on mobile device usage in English language learning'
    },
    {
      id: 'paper-2',
      title: 'Introduction to 2D Materials - NITI Aayog Future Front',
      url: 'https://niti.gov.in/sites/default/files/2025-09/FTH-Quaterly-Insight-Sep-2025.pdf',
      image: 'https://lh7-rt.googleusercontent.com/slidesz/AGV27_YhMvLHdC1cdhJ2CbVNNE5hEgz-O1fCG-KYf6d7gXVLevpGWcJ0vKGANPjfvmF4H-7gHj-r0uKD-g4UXvFH-h6jYdDj9m4PqPx2lQNWGf2x42jl0=s1280?key=EVh3fZMOl7CZGPqDFczCNA',
      description: 'Quarterly frontier tech insights on 2D materials'
    },
    {
      id: 'paper-3',
      title: 'India\'s Data Imperative - The Pivot Towards Quality',
      url: 'https://niti.gov.in/sites/default/files/2025-06/FTH-Quaterly-Insight-june.pdf',
      image: 'https://lh7-rt.googleusercontent.com/slidesz/AGV27_YidhfvQqNOkwXXiJr5K5CG1PXUIJqSfOSd1p1pYJ9wUX7LyCnXvg7D5Vjh04bCUCyWk7G_wOPl3w_KN1Iur4YnCWN4cBKpzfxOq3s51-nfhNNwG_Q=s1280?key=EVh3fZMOl7CZGPqDFczCNA',
      description: 'India\'s data strategy and quality initiatives'
    },
    {
      id: 'paper-4',
      title: 'The Only Way to Predict the Future is to Create It',
      url: 'https://niti.gov.in/sites/default/files/2025-03/Future-Front-Quarterly-Frontier-Tech-Insights-March-2025.pdf',
      image: 'https://lh7-rt.googleusercontent.com/slidesz/AGV27_aHLLVf06fHMdwbh8YU5WbK7ELZqkIv8EKZvp7YDT3LhKDHqkDkB7_C_wXJ0d3fhPK0F9LDMSNvVV0w1Io_VuCNhqEwvKNJnXmYBQF0KeYhPYFxU=s1280?key=EVh3fZMOl7CZGPqDFczCNA',
      description: 'Future tech insights and predictions for 2025'
    },
    {
      id: 'paper-5',
      title: 'Research Paper - Computer Science',
      url: 'https://www.sciencedirect.com/topics/computer-science/research-paper',
      image: 'https://lh7-rt.googleusercontent.com/slidesz/AGV27_bXY0cUvVPq5X0vz-xN3SsVIxK1cHR0DQpMXNzpBG0_4Z2TKpO6TXB-YlLPkxAOI1oT5xr2SN30VxLh6mNIbvPKW0R99d5ZXLWt0YfE3YaEu6HXp0Q=s1280?key=EVh3fZMOl7CZGPqDFczCNA',
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
