'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  FileText,
  Image,
  Users,
  Eye,
  Plus,
  TrendingUp,
  Clock
} from 'lucide-react'

export default function Dashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    pages: { total: 0, published: 0, draft: 0 },
    media: 0,
    users: 0
  })
  const [recentPages, setRecentPages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    fetchRecentPages()
  }, [])

  const fetchStats = async () => {
    try {
      const [pagesRes, mediaRes, usersRes] = await Promise.all([
        fetch('/api/pages'),
        fetch('/api/media'),
        fetch('/api/users')
      ])
      
      const pagesData = await pagesRes.json()
      const mediaData = await mediaRes.json()
      const usersData = await usersRes.json()
      
      if (pagesData.success) {
        const pages = pagesData.data
        setStats({
          pages: {
            total: pages.length,
            published: pages.filter(p => p.status === 'published').length,
            draft: pages.filter(p => p.status === 'draft').length
          },
          media: mediaData.success ? mediaData.data.length : 0,
          users: usersData.success ? usersData.data.length : 0
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentPages = async () => {
    try {
      const res = await fetch('/api/pages?limit=5')
      const data = await res.json()
      if (data.success) {
        setRecentPages(data.data)
      }
    } catch (error) {
      console.error('Error fetching recent pages:', error)
    }
  }

  const statCards = [
    {
      title: 'Total Pages',
      value: stats.pages.total,
      icon: FileText,
      color: 'blue',
      link: '/admin/pages'
    },
    {
      title: 'Published',
      value: stats.pages.published,
      icon: Eye,
      color: 'green',
      link: '/admin/pages?status=published'
    },
    {
      title: 'Media Files',
      value: stats.media,
      icon: Image,
      color: 'purple',
      link: '/admin/media'
    },
    {
      title: 'Users',
      value: stats.users,
      icon: Users,
      color: 'orange',
      link: '/admin/users'
    }
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to your admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon
          const colorClasses = {
            blue: 'bg-blue-50 text-blue-600',
            green: 'bg-green-50 text-green-600',
            purple: 'bg-purple-50 text-purple-600',
            orange: 'bg-orange-50 text-orange-600'
          }
          return (
            <Link
              key={stat.title}
              href={stat.link}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => router.push('/admin/pages/new')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            New Page
          </button>
          <button
            onClick={() => router.push('/admin/media')}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Image className="w-4 h-4" />
            Upload Media
          </button>
          <button
            onClick={() => router.push('/admin/menus')}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FileText className="w-4 h-4" />
            Manage Menus
          </button>
        </div>
      </div>

      {/* Recent Pages */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Recent Pages</h2>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : recentPages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No pages yet</div>
          ) : (
            <div className="space-y-4">
              {recentPages.map((page) => (
                <div
                  key={page._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <Link
                        href={`/admin/pages/${page._id}`}
                        className="font-medium text-gray-900 hover:text-blue-600"
                      >
                        {page.title}
                      </Link>
                      <p className="text-sm text-gray-500">/{page.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      page.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {page.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(page.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

