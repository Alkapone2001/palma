import { ObjectId } from 'mongodb'
import { isAdminRequest, unauthorized } from '../../lib/adminAuth'
import { createMongoClient, getRestaurantDb } from '../../lib/mongodb'

export const dynamic = 'force-dynamic'

export async function GET() {
  const client = createMongoClient()

  try {
    await client.connect()
    const database = getRestaurantDb(client)
    const rooms = database.collection('rooms')
    const result = await rooms.find({}).sort({ createdAt: -1, name: 1 }).toArray()
    return Response.json(result)
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Failed to fetch rooms' }, { status: 500 })
  } finally {
    await client.close()
  }
}

export async function POST(request) {
  if (!isAdminRequest(request)) {
    return unauthorized()
  }

  const client = createMongoClient()

  try {
    const body = await request.json()
    const room = {
      name: body.name,
      description: body.description,
      capacity: Number(body.capacity || 1),
      imageUrl: body.imageUrl || '',
      galleryImages: Array.isArray(body.galleryImages)
        ? body.galleryImages
        : String(body.galleryImages || '')
            .split('\n')
            .map((image) => image.trim())
            .filter(Boolean),
      category: body.category || '',
      size: body.size || '',
      bedType: body.bedType || '',
      price: body.price ? Number(body.price) : '',
      priceUnit: body.priceUnit || 'per night',
      priceNote: body.priceNote || '',
      priceLabel: body.priceLabel || '',
      details: Array.isArray(body.details)
        ? body.details
        : String(body.details || '')
            .split('\n')
            .map((detail) => detail.trim())
            .filter(Boolean),
      isAvailable: body.isAvailable !== false,
      createdAt: body.createdAt || new Date().toISOString(),
    }

    await client.connect()
    const database = getRestaurantDb(client)
    const rooms = database.collection('rooms')
    const result = await rooms.insertOne(room)
    return Response.json({ message: 'Room created', id: result.insertedId })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Failed to create room' }, { status: 500 })
  } finally {
    await client.close()
  }
}

export async function PUT(request) {
  if (!isAdminRequest(request)) {
    return unauthorized()
  }

  const client = createMongoClient()

  try {
    const body = await request.json()
    const { id, ...bodyData } = body
    const updateData = {
      ...bodyData,
      ...(bodyData.capacity !== undefined ? { capacity: Number(bodyData.capacity) } : {}),
      ...(bodyData.price !== undefined ? { price: bodyData.price ? Number(bodyData.price) : '' } : {}),
      ...(bodyData.galleryImages !== undefined
        ? {
            galleryImages: Array.isArray(bodyData.galleryImages)
              ? bodyData.galleryImages
              : String(bodyData.galleryImages || '')
                  .split('\n')
                  .map((image) => image.trim())
                  .filter(Boolean),
          }
        : {}),
      ...(bodyData.details !== undefined
        ? {
            details: Array.isArray(bodyData.details)
              ? bodyData.details
              : String(bodyData.details || '')
                  .split('\n')
                  .map((detail) => detail.trim())
                  .filter(Boolean),
          }
        : {}),
    }

    await client.connect()
    const database = getRestaurantDb(client)
    const rooms = database.collection('rooms')
    const result = await rooms.updateOne({ _id: new ObjectId(id) }, { $set: updateData })
    return Response.json({ message: 'Room updated' })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Failed to update room' }, { status: 500 })
  } finally {
    await client.close()
  }
}

export async function DELETE(request) {
  if (!isAdminRequest(request)) {
    return unauthorized()
  }

  const client = createMongoClient()
  const url = new URL(request.url)
  const id = url.searchParams.get('id')

  try {
    await client.connect()
    const database = getRestaurantDb(client)
    const rooms = database.collection('rooms')
    const result = await rooms.deleteOne({ _id: new ObjectId(id) })
    return Response.json({ message: 'Room deleted' })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Failed to delete room' }, { status: 500 })
  } finally {
    await client.close()
  }
}
