'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Plus, Trash2, Edit2, Save, X, Link as LinkIcon } from 'lucide-react'

export default function MenuManager() {
  const [menus, setMenus] = useState([])
  const [selectedMenu, setSelectedMenu] = useState(null)
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMenus()
    fetchPages()
  }, [])

  const fetchMenus = async () => {
    try {
      const res = await fetch('/api/menus')
      const data = await res.json()
      if (data.success) {
        setMenus(data.data)
        if (data.data.length > 0 && !selectedMenu) {
          setSelectedMenu(data.data[0]._id)
        }
      }
    } catch (error) {
      console.error('Error fetching menus:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPages = async () => {
    try {
      const res = await fetch('/api/pages?status=published')
      const data = await res.json()
      if (data.success) {
        setPages(data.data)
      }
    } catch (error) {
      console.error('Error fetching pages:', error)
    }
  }

  const currentMenu = menus.find(m => m._id === selectedMenu)

  const handleDragEnd = async (result) => {
    if (!result.destination || !currentMenu) return

    const items = Array.from(currentMenu.items)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    const updatedItems = items.map((item, index) => ({ ...item, order: index }))

    try {
      const res = await fetch(`/api/menus/${currentMenu._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: updatedItems })
      })
      const data = await res.json()
      if (data.success) {
        fetchMenus()
      }
    } catch (error) {
      console.error('Error updating menu:', error)
    }
  }

  const addMenuItem = (type, data) => {
    if (!currentMenu) return

    const newItem = {
      id: `item-${Date.now()}`,
      type,
      label: type === 'page' ? data.title : 'New Link',
      path: type === 'page' ? `/${data.slug}` : '',
      pageId: type === 'page' ? data._id : null,
      order: currentMenu.items.length,
      target: '_self',
      visible: true
    }

    const updatedItems = [...currentMenu.items, newItem]

    fetch(`/api/menus/${currentMenu._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: updatedItems })
    }).then(() => fetchMenus())
  }

  const deleteMenuItem = (itemId) => {
    if (!currentMenu) return
    if (!confirm('Are you sure you want to delete this menu item?')) return

    const updatedItems = currentMenu.items.filter(item => item.id !== itemId)

    fetch(`/api/menus/${currentMenu._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: updatedItems })
    }).then(() => fetchMenus())
  }

  const updateMenuItem = (itemId, updates) => {
    if (!currentMenu) return

    const updatedItems = currentMenu.items.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    )

    fetch(`/api/menus/${currentMenu._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: updatedItems })
    }).then(() => fetchMenus())
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Menu Manager</h1>
        <p className="mt-2 text-gray-600">Manage your website navigation menus</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu Selector */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold text-gray-900 mb-4">Menus</h2>
            <div className="space-y-2">
              {menus.map((menu) => (
                <button
                  key={menu._id}
                  onClick={() => setSelectedMenu(menu._id)}
                  className={`w-full text-left p-3 rounded-lg ${
                    selectedMenu === menu._id
                      ? 'bg-blue-50 text-blue-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {menu.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Items Editor */}
        <div className="lg:col-span-2">
          {currentMenu ? (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">{currentMenu.name}</h2>
              </div>
              <div className="p-6">
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="menu-items">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                        {currentMenu.items.map((item, index) => (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`p-4 border rounded-lg bg-white ${
                                  snapshot.isDragging ? 'shadow-lg' : ''
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3 flex-1">
                                    <div {...provided.dragHandleProps} className="cursor-move">
                                      <LinkIcon className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <input
                                      type="text"
                                      value={item.label}
                                      onChange={(e) => updateMenuItem(item.id, { label: e.target.value })}
                                      className="flex-1 px-3 py-2 border rounded-lg"
                                    />
                                    <input
                                      type="text"
                                      value={item.path}
                                      onChange={(e) => updateMenuItem(item.id, { path: e.target.value })}
                                      className="flex-1 px-3 py-2 border rounded-lg"
                                      placeholder="Path"
                                    />
                                  </div>
                                  <button
                                    onClick={() => deleteMenuItem(item.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>

                {/* Add Pages */}
                <div className="mt-6 p-4 border rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Add Pages</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {pages.map((page) => (
                      <button
                        key={page._id}
                        onClick={() => addMenuItem('page', page)}
                        className="w-full text-left p-2 hover:bg-gray-50 rounded flex items-center justify-between"
                      >
                        <span>{page.title}</span>
                        <Plus className="w-4 h-4 text-gray-400" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              No menu selected
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

