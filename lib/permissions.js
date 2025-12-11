import User from '@/models/User'

/**
 * Check if user has permission to perform an action
 */
export async function checkPermission(userId, action, resource = null) {
  try {
    const user = await User.findById(userId)
    if (!user || !user.isActive) {
      return { allowed: false, reason: 'User not found or inactive' }
    }

    const role = user.role

    // SuperAdmin has all permissions
    if (role === 'SuperAdmin') {
      return { allowed: true }
    }

    // Admin permissions
    if (role === 'Admin') {
      const adminActions = [
        'create:page', 'edit:page', 'delete:page', 'publish:page',
        'create:media', 'edit:media', 'delete:media',
        'create:menu', 'edit:menu', 'delete:menu',
        'create:user', 'edit:user', 'delete:user',
        'edit:theme', 'view:settings'
      ]
      if (adminActions.includes(action)) {
        return { allowed: true }
      }
    }

    // Editor permissions
    if (role === 'Editor') {
      const editorActions = [
        'create:page', 'edit:page', 'view:page',
        'create:media', 'edit:media', 'view:media',
        'view:menu'
      ]
      if (editorActions.includes(action)) {
        // Check if trying to publish - Editors can't publish unless granted permission
        if (action === 'publish:page' && resource) {
          // Check page-specific permissions
          if (resource.permissions?.users?.includes(userId)) {
            return { allowed: true }
          }
          return { allowed: false, reason: 'Editor cannot publish pages without explicit permission' }
        }
        return { allowed: true }
      }
    }

    // Operator permissions (limited)
    if (role === 'Operator') {
      const operatorActions = [
        'view:page', 'edit:page', // Can edit but not create or delete
        'view:media'
      ]
      if (operatorActions.includes(action)) {
        // Operators can only edit pages they have permission for
        if (action === 'edit:page' && resource) {
          if (resource.permissions?.users?.includes(userId) || 
              resource.permissions?.roles?.includes(role) ||
              resource.createdBy?.toString() === userId) {
            return { allowed: true }
          }
          return { allowed: false, reason: 'No permission to edit this page' }
        }
        return { allowed: true }
      }
    }

    return { allowed: false, reason: 'Insufficient permissions' }
  } catch (error) {
    console.error('Error checking permissions:', error)
    return { allowed: false, reason: 'Error checking permissions' }
  }
}

/**
 * Check if user can publish pages
 */
export async function canPublish(userId, page = null) {
  const user = await User.findById(userId)
  if (!user) return false

  // SuperAdmin and Admin can always publish
  if (['SuperAdmin', 'Admin'].includes(user.role)) {
    return true
  }

  // Editor can publish if page has explicit permission
  if (user.role === 'Editor' && page) {
    return page.permissions?.users?.includes(userId) || false
  }

  // Operator cannot publish
  return false
}

/**
 * Check if user can delete resources
 */
export async function canDelete(userId, resourceType) {
  const user = await User.findById(userId)
  if (!user) return false

  // Only SuperAdmin and Admin can delete
  return ['SuperAdmin', 'Admin'].includes(user.role)
}

/**
 * Get user role
 */
export async function getUserRole(userId) {
  const user = await User.findById(userId)
  return user?.role || null
}

