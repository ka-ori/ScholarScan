import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { 
  FileText, Upload, Brain, Sparkles, Search, ChevronRight, 
  BookOpen, BarChart3, HelpCircle, LogOut, Menu, X, ChevronDown,
  TrendingUp, TrendingDown, Users
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('papers')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Mock data for demonstration
  const mockPapers = [
    {
      id: 1,
      title: "Deep Learning in Medical Imaging",
      authors: "Stanford University",
      uploadDate: "2024-11-01",
      citations: 234,
      status: "Analyzed"
    },
    {
      id: 2,
      title: "Quantum Computing Applications",
      authors: "MIT Research",
      uploadDate: "2024-10-28",
      citations: 189,
      status: "Processing"
    },
    {
      id: 3,
      title: "Climate Change Models 2024",
      authors: "Oxford University",
      uploadDate: "2024-10-25",
      citations: 567,
      status: "Analyzed"
    }
  ]

  const sidebarItems = [
    { id: 'overview', icon: BarChart3, label: 'Dashboard', active: false },
    { id: 'papers', icon: FileText, label: 'Research Papers', active: true },
    { id: 'analysis', icon: Brain, label: 'AI Analysis', active: false },
    { id: 'search', icon: Search, label: 'Search', active: false },
    { id: 'help', icon: HelpCircle, label: 'Help', active: false }
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-gray-900">ScholarScan</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  item.active || activeTab === item.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                <ChevronRight className="w-4 h-4 ml-auto" />
              </button>
            ))}
          </nav>

          {/* Upgrade CTA */}
          <div className="p-4 m-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white">
            <Sparkles className="w-8 h-8 mb-2" />
            <h3 className="font-bold mb-1">Upgrade to Pro</h3>
            <p className="text-sm text-indigo-100 mb-3">Get unlimited AI analysis!</p>
            <button className="w-full bg-white text-indigo-600 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
              Get Pro Now!
            </button>
          </div>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                {user?.name?.[0] || user?.email?.[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.name || user?.email?.split('@')[0]}
                </p>
                <p className="text-xs text-gray-500">Project Manager</p>
              </div>
              <button onClick={handleLogout} className="p-2 hover:bg-gray-100 rounded-lg">
                <LogOut className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="md:hidden">
                <Menu className="w-6 h-6 text-gray-500" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Hello {user?.name || user?.email?.split('@')[0]} 👋
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                  <TrendingUp className="w-4 h-4" />
                  18% this month
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">Total Papers</p>
              <p className="text-3xl font-bold text-gray-900">5,423</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex items-center gap-1 text-red-600 text-sm font-semibold">
                  <TrendingDown className="w-4 h-4" />
                  1% this month
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">AI Analyzed</p>
              <p className="text-3xl font-bold text-gray-900">1,893</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-pink-400 to-red-500 rounded-full border-2 border-white"></div>
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full border-2 border-white"></div>
                    <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white"></div>
                    <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-white"></div>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">Citations Found</p>
              <p className="text-3xl font-bold text-gray-900">189</p>
            </div>
          </div>

          {/* All Research Papers Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-gray-900">All Research Papers</h2>
                <button className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm flex items-center gap-1">
                  <Upload className="w-4 h-4" />
                  Upload Paper
                </button>
              </div>
              <p className="text-sm text-green-600 font-medium">Active Papers</p>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Short by:</span>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <span className="text-sm font-medium">Newest</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Paper Title</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Authors/Institution</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Upload Date</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Citations</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockPapers.map((paper) => (
                      <tr key={paper.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4 text-sm text-gray-900 font-medium">{paper.title}</td>
                        <td className="py-4 px-4 text-sm text-gray-600">{paper.authors}</td>
                        <td className="py-4 px-4 text-sm text-gray-600">{paper.uploadDate}</td>
                        <td className="py-4 px-4 text-sm text-gray-600">{paper.citations}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            paper.status === 'Analyzed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {paper.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing data 1 to 3 of 256 entries
                </p>
                <div className="flex items-center gap-2">
                  <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
                    <ChevronRight className="w-4 h-4 rotate-180" />
                  </button>
                  <button className="w-8 h-8 bg-indigo-600 text-white rounded font-semibold">1</button>
                  <button className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-50">2</button>
                  <button className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-50">3</button>
                  <button className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-50">4</button>
                  <span className="px-2">...</span>
                  <button className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-50">40</button>
                  <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
