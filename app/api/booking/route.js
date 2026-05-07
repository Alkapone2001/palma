import { createMongoClient, getRestaurantDb } from '../../lib/mongodb'

export async function GET() {
  const client = createMongoClient()

  try {
    await client.connect()
    const database = getRestaurantDb(client)
    const reservations = database.collection('reservations')
    const result = await reservations.find({}).toArray()
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
    await client.connect()
    const database = getRestaurantDb(client)
    const reservations = database.collection('reservations')
    const result = await reservations.insertOne(body)
    return Response.json({ message: 'Booking created', id: result.insertedId })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Failed to create booking' }, { status: 500 })
  } finally {
    await client.close()
  }
}
