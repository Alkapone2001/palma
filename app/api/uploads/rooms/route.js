import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'
import { isAdminRequest, unauthorized } from '../../../lib/adminAuth'

export const runtime = 'nodejs'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'rooms')
const PUBLIC_PATH = '/uploads/rooms'
const ALLOWED_TYPES = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/gif', 'gif'],
])

export async function POST(request) {
  if (!isAdminRequest(request)) {
    return unauthorized()
  }

  try {
    const formData = await request.formData()
    const files = formData
      .getAll('images')
      .filter((file) => file && typeof file.arrayBuffer === 'function' && file.size > 0)

    if (files.length === 0) {
      return Response.json({ error: 'At least one image is required' }, { status: 400 })
    }

    await mkdir(UPLOAD_DIR, { recursive: true })

    const uploaded = []

    for (const file of files) {
      const extension = ALLOWED_TYPES.get(file.type)

      if (!extension) {
        return Response.json({ error: 'Only JPG, PNG, WebP, and GIF images are allowed' }, { status: 400 })
      }

      if (file.size > MAX_FILE_SIZE) {
        return Response.json({ error: 'Each image must be 5 MB or smaller' }, { status: 400 })
      }

      const name = createFileName(file.name, extension)
      const bytes = await file.arrayBuffer()
      await writeFile(path.join(UPLOAD_DIR, name), Buffer.from(bytes))
      uploaded.push(`${PUBLIC_PATH}/${name}`)
    }

    return Response.json({ images: uploaded })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Failed to upload room images' }, { status: 500 })
  }
}

function createFileName(originalName, extension) {
  const baseName = path
    .basename(originalName, path.extname(originalName))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60) || 'room'

  return `${Date.now()}-${randomUUID()}-${baseName}.${extension}`
}
