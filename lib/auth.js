import jwt from 'jsonwebtoken'

export function verifyToken(token) {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key-change-in-production'
    )
    return decoded
  } catch (error) {
    return null
  }
}

export function authenticate(request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) {
    return null
  }

  const token = authHeader.split(' ')[1]
  if (!token) {
    return null
  }

  return verifyToken(token)
}

