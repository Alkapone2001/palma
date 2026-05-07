import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const client = new MongoClient(uri)

export async function POST(request) {
  try {
    const body = await request.json()
    await client.connect()
    const database = client.db('restaurant')
    const reservations = database.collection('reservations')
    const result = await reservations.insertOne(body)
    return Response.json({ message: 'Booking created', id: result.insertedId })
  } catch (error) {
    return Response.json({ error: 'Failed to create booking' }, { status: 500 })
  } finally {
    await client.close()
  }
}