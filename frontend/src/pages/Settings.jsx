import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Mail, Lock, Trash2, Save, FileText, BarChart3 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { useAuthStore } from '../store/authStore'

function Settings() {
  const navigate = useNavigate()
  const { logout, user: authUser } = useAuthStore()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [profile, setProfile] = useState({ name: '', email: '' })
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [stats, setStats] = useState({ totalPapers: 0, categoryCounts: [], recentPapers: [] })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const [userRes, statsRes] = await Promise.all([
        api.get('/user'),
        api.get('/user/stats')
      ])
      setProfile({ name: userRes.data.user.name, email: userRes.data.user.email })
      setStats(statsRes.data)
    } catch (error) {
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/user', profile)
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    if (passwords.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    if (!passwords.currentPassword) {
      toast.error('Please enter your current password')
      return
    }
    setSaving(true)
    try {
      await api.put('/user/password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      })
      toast.success('Password changed successfully')
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      console.error('Password change error:', error.response?.data)
      const errorMessage = error.response?.data?.error || 'Failed to change password'
      toast.error(errorMessage, { duration: 4000 })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      await api.delete('/user')
      toast.success('Account deleted')
      logout()
      navigate('/')
    } catch (error) {
      toast.error('Failed to delete account')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        { }
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
        </div>

        <h1 className="text-2xl font-semibold text-black mb-8">Settings</h1>

        { }
        <div className="flex gap-1 mb-8 border-b border-gray-100">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'security', label: 'Security', icon: Lock },
            { id: 'stats', label: 'Statistics', icon: BarChart3 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.id 
                  ? 'border-black text-black' 
                  : 'border-transparent text-gray-500 hover:text-black'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        { }
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-md">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-black transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-black transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}

        { }
        {activeTab === 'security' && (
          <div className="space-y-8">
            <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
              <h2 className="text-lg font-medium">Change Password</h2>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="password"
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="password"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Changing...' : 'Change Password'}
              </button>
            </form>

            { }
            <div className="pt-8 border-t border-gray-100">
              <h2 className="text-lg font-medium text-red-600 mb-4">Danger Zone</h2>
              <p className="text-sm text-gray-600 mb-4">
                Once you delete your account, there is no going back. All your papers and data will be permanently deleted.
              </p>
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 px-6 py-2.5 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </button>
              ) : (
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-800 mb-4">Are you sure? This action cannot be undone.</p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleDeleteAccount}
                      className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Yes, delete my account
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:border-black transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        { }
        {activeTab === 'stats' && (
          <div className="space-y-8">
            { }
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-gray-50 rounded-xl">
                <div className="text-3xl font-semibold text-black">{stats.totalPapers}</div>
                <div className="text-sm text-gray-500 mt-1">Total Papers</div>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl">
                <div className="text-3xl font-semibold text-black">{stats.categoryCounts.length}</div>
                <div className="text-sm text-gray-500 mt-1">Categories Used</div>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl">
                <div className="text-3xl font-semibold text-black">
                  {new Date(authUser?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </div>
                <div className="text-sm text-gray-500 mt-1">Member Since</div>
              </div>
            </div>

            { }
            {stats.categoryCounts.length > 0 && (
              <div>
                <h2 className="text-lg font-medium mb-4">Papers by Category</h2>
                <div className="space-y-3">
                  {stats.categoryCounts.map((cat, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">{cat.category}</span>
                      <span className="text-sm font-medium text-black">{cat.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            { }
            {stats.recentPapers.length > 0 && (
              <div>
                <h2 className="text-lg font-medium mb-4">Recent Papers</h2>
                <div className="space-y-2">
                  {stats.recentPapers.map((paper) => (
                    <div
                      key={paper.id}
                      onClick={() => navigate(`/paper/${paper.id}`)}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      <FileText className="h-4 w-4 text-gray-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 truncate">{paper.title}</p>
                        <p className="text-xs text-gray-500">{paper.category}</p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(paper.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Settings
