import { ObjectId } from 'mongodb'
import { createMongoClient, getRestaurantDb } from '../../lib/mongodb'

export async function GET() {
  const client = createMongoClient()

  try {
    await client.connect()
    const database = getRestaurantDb(client)
    const reservations = database.collection('reservations')
    const result = await reservations.find({}).sort({ createdAt: -1 }).toArray()
    return Response.json(result)
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Failed to fetch reservations' }, { status: 500 })
  } finally {
    await client.close()
  }
}

export async function POST(request) {
  const client = createMongoClient()

  try {
    const body = await request.json()
    const booking = {
      ...body,
      status: body.status || 'pending',
      createdAt: body.createdAt || new Date().toISOString(),
    }

    await client.connect()
    const database = getRestaurantDb(client)
    const reservations = database.collection('reservations')
    const result = await reservations.insertOne(booking)
    return Response.json({ message: 'Booking created', id: result.insertedId })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Failed to create booking' }, { status: 500 })
  } finally {
    await client.close()
  }
}

export async function PUT(request) {
  const client = createMongoClient()

  try {
    const body = await request.json()
    const { id, ...updateData } = body

    await client.connect()
    const database = getRestaurantDb(client)
    const reservations = database.collection('reservations')
    await reservations.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date().toISOString(),
        },
      },
    )

    return Response.json({ message: 'Booking updated' })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Failed to update booking' }, { status: 500 })
  } finally {
    await client.close()
  }
}
